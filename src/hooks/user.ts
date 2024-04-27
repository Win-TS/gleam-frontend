import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { z, ZodError } from "zod";

import {
  useLoggingInfiniteQuery,
  useLoggingMutation,
  useLoggingQuery,
} from "@/src/hooks/query";
import { friendPair_, friend_ } from "@/src/schemas/friend";
import { user_ } from "@/src/schemas/user";
import { userprofile_ } from "@/src/schemas/userprofile";
import { useUserId } from "@/src/stores/user";
import { fetchUriAsBlob } from "@/src/utils/fetchUriAsBlob";

export const useUserQuery = () => {
  const userId = useUserId({ throw: false });

  return useLoggingQuery({
    url: "/user_v1/userinfo",
    query: { user_id: userId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_USER_API,
    },
    queryKey: ["user", userId, "info", "all"],
    validator: user_,
    enabled: !!userId,
  });
};

export const useUserprofileQuery = (userId: number) => {
  return useLoggingQuery({
    url: "/user_v1/userprofile",
    query: { user_id: userId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_USER_API,
    },
    queryKey: ["user", userId, "info"],
    validator: userprofile_,
  });
};

export const uploadUserPhotoResponse_ = z.object({
  success: z.coerce.boolean(),
  message: z.string(),
  url: z.string(),
});

export const useUserprofileMutation = () => {
  const userId = useUserId();
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<{ message: string }> | ZodError,
    { photo: string | undefined; firstname: string; lastname: string }
  >({
    mutationFn: async ({
      photo,
      firstname,
      lastname,
    }: {
      photo: string | undefined;
      firstname: string;
      lastname: string;
    }) => {
      await Promise.all(
        [
          axios.patch(
            "/user_v1/editname",
            { firstname, lastname },
            {
              baseURL: process.env.EXPO_PUBLIC_USER_API,
              params: {
                user_id: userId,
              },
            },
          ),
          photo
            ? (async () => {
                const photoBlob = await fetchUriAsBlob(photo);
                const uploadUserPhotoFormData = new FormData();
                // @ts-ignore
                uploadUserPhotoFormData.append("photo", {
                  uri: photo,
                  name: `${userId}_${Date.now()}.${photoBlob.type.split("/")[1]}`,
                  type: photoBlob.type,
                });
                const { url: photoUrl } =
                  await uploadUserPhotoResponse_.parseAsync(
                    (
                      await axios.post(
                        "/user_v1/uploaduserphoto",
                        uploadUserPhotoFormData,
                        {
                          baseURL: process.env.EXPO_PUBLIC_USER_API,
                          headers: {
                            "Content-Type": "multipart/form-data",
                          },
                        },
                      )
                    ).data,
                  );
                const editPhotoFormData = new FormData();
                editPhotoFormData.append("photo_url", photoUrl);
                await axios.patch("/user_v1/editphoto", editPhotoFormData, {
                  baseURL: process.env.EXPO_PUBLIC_USER_API,
                  params: {
                    user_id: userId,
                  },
                });
              })()
            : undefined,
        ].filter(Boolean),
      );
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ["user", userId, "info"],
      });
    },
  });
};

export const useUsernameMutation = () => {
  const userId = useUserId();

  return useLoggingMutation({
    method: "PATCH",
    url: "/user_v1/editusername",
    query: { user_id: userId },
    getMutationRequestParams: ({ username }: { username: string }) => {
      return { query: { new_username: username } };
    },
    config: {
      baseURL: process.env.EXPO_PUBLIC_USER_API,
    },
    validator: z.any(),
    invalidateKeys: [["user", userId, "info"]],
  });
};

export const useUserPrivateMutation = () => {
  const userId = useUserId();

  return useLoggingMutation({
    method: "PATCH_FORM",
    url: "/user_v1/editprivateaccount",
    query: { user_id: userId },
    getMutationRequestParams: ({
      privateAccount,
    }: {
      privateAccount: boolean;
    }) => {
      return { body: { private_account: `${privateAccount}` } };
    },
    config: {
      baseURL: process.env.EXPO_PUBLIC_USER_API,
    },
    validator: z.any(),
    invalidateKeys: [["user", userId, "info"]],
  });
};

export const useFriendStatusQuery = (otherUserId: number) => {
  const userId = useUserId({ throw: false });

  return useLoggingQuery({
    url: "/friend_v1/",
    query: { user_id1: userId, user_id2: otherUserId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_USER_API,
    },
    queryKey: ["user", userId, "friend", otherUserId],
    validator: z.array(friendPair_),
    default: [], // FIXME: no way to really tell if backend error or we do not have friends
    enabled: !!userId,
  });
};

export const useFriendListInfiniteQuery = (userId: number) => {
  return useLoggingInfiniteQuery({
    url: "/friend_v1/list",
    query: { user_id: userId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_USER_API,
    },
    queryKey: ["user", userId, "friend", "list"],
    validator: z.array(friend_),
  });
};

export const useAddFriendMutation = (otherUserId: number) => {
  const userId = useUserId();

  return useLoggingMutation({
    method: "POST",
    url: "/friend_v1/add",
    body: { user_id1: userId, user_id2: otherUserId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_USER_API,
    },
    validator: z.any(),
    invalidateKeys: [["user", userId, "friend", otherUserId]],
  });
};

export const useAcceptFriendMutation = (otherUserId: number) => {
  const userId = useUserId();

  return useLoggingMutation({
    method: "PATCH",
    url: "/friend_v1/accept",
    body: { user_id1: otherUserId, user_id2: userId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_USER_API,
    },
    validator: z.any(),
    invalidateKeys: [
      ["user", userId],
      ["user", otherUserId],
    ],
  });
};

export const useDeclineFriendMutation = (otherUserId: number) => {
  const userId = useUserId();

  return useLoggingMutation({
    method: "DELETE",
    url: "/friend_v1/decline",
    body: {
      user_id1: otherUserId,
      user_id2: userId,
    },
    config: {
      baseURL: process.env.EXPO_PUBLIC_USER_API,
    },
    validator: z.any(),
    invalidateKeys: [["user", userId, "friend", "pending"]],
  });
};

export const useFriendRequestListInfiniteQuery = () => {
  const userId = useUserId({ throw: false });

  return useLoggingInfiniteQuery({
    url: "/friend_v1/pending",
    query: { user_id: userId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_USER_API,
    },
    queryKey: ["user", userId, "friend", "pending", "list"],
    validator: z.array(user_),
    enabled: !!userId,
  });
};

export const useFriendRequestCountQuery = () => {
  const userId = useUserId({ throw: false });

  return useLoggingQuery({
    url: "/friend_v1/requestcount",
    query: { user_id: userId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_USER_API,
    },
    queryKey: ["user", userId, "friend", "pending", "count"],
    validator: z.coerce.number(),
    enabled: !!userId,
  });
};
