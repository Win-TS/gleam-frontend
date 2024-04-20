import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { z, ZodError } from "zod";

import {
  useLoggingGetInfiniteQuery,
  useLoggingGetQuery,
} from "@/src/hooks/query";
import { friendPair_, friend_ } from "@/src/schemas/friend";
import { user_ } from "@/src/schemas/user";
import { userprofile_ } from "@/src/schemas/userprofile";
import { useUserId } from "@/src/stores/user";

export const useUserQuery = () => {
  const userId = useUserId({ throw: false });

  return useLoggingGetQuery({
    url: "/user_v1/userinfo",
    data: { user_id: userId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_USER_API,
    },
    queryKey: ["user", userId, "info", "all"],
    validator: user_,
    enabled: !!userId,
  });
};

export const useUserprofileQuery = (userId: number) => {
  return useLoggingGetQuery({
    url: "/user_v1/userprofile",
    data: { user_id: userId },
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
                const photoBlob = await (await fetch(photo)).blob();
                const uploadUserPhotoFormData = new FormData();
                uploadUserPhotoFormData.append(
                  "photo",
                  photoBlob,
                  `${userId}_${Date.now()}.${photo.split(";")[0].split("/")[1]}`,
                );
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
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<{ message: string }>,
    { username: string }
  >({
    mutationFn: async ({ username }) => {
      return await axios.patch(
        "/user_v1/editusername",
        {},
        {
          baseURL: process.env.EXPO_PUBLIC_USER_API,
          params: {
            user_id: userId,
            new_username: username,
          },
        },
      );
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ["user", userId, "info"],
      });
    },
  });
};

export const useUserPrivateMutation = () => {
  const userId = useUserId();
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError<{ message: string }>,
    { privateAccount: boolean }
  >({
    mutationFn: async ({ privateAccount }) => {
      const userPrivateFormData = new FormData();
      userPrivateFormData.append("private_account", `${privateAccount}`);
      return await axios.patch(
        "/user_v1/editprivateaccount",
        userPrivateFormData,
        {
          baseURL: process.env.EXPO_PUBLIC_USER_API,
          params: { user_id: userId },
        },
      );
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ["user", userId, "info"],
      });
    },
  });
};

export const useFriendStatusQuery = (otherUserId: number) => {
  const userId = useUserId({ throw: false });

  return useLoggingGetQuery({
    url: "/friend_v1/",
    data: { user_id1: userId, user_id2: otherUserId },
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
  return useLoggingGetInfiniteQuery({
    url: "/friend_v1/list",
    data: { user_id: userId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_USER_API,
    },
    queryKey: ["user", userId, "friend", "list"],
    validator: z.array(friend_),
  });
};

export const useAddFriendMutation = (otherUserId: number) => {
  const userId = useUserId();
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message: string }>>({
    mutationFn: async () => {
      return await axios.post(
        "/friend_v1/add",
        { user_id1: userId, user_id2: otherUserId },
        {
          baseURL: process.env.EXPO_PUBLIC_USER_API,
        },
      );
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ["user", userId, "friend", otherUserId],
      });
    },
  });
};

export const useAcceptFriendMutation = (otherUserId: number) => {
  const userId = useUserId();
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message: string }>>({
    mutationFn: async () => {
      return await axios.patch(
        "/friend_v1/accept",
        { user_id1: otherUserId, user_id2: userId },
        {
          baseURL: process.env.EXPO_PUBLIC_USER_API,
        },
      );
    },
    onSettled: async () => {
      return await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["user", userId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["user", otherUserId],
        }),
      ]);
    },
  });
};

export const useDeclineFriendMutation = (otherUserId: number) => {
  const userId = useUserId();
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message: string }>>({
    mutationFn: async () => {
      return await axios.delete("/friend_v1/decline", {
        data: { user_id1: otherUserId, user_id2: userId },
        baseURL: process.env.EXPO_PUBLIC_USER_API,
      });
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ["user", userId, "friend", "pending"],
      });
    },
  });
};

export const useFriendRequestListInfiniteQuery = () => {
  const userId = useUserId({ throw: false });

  return useLoggingGetInfiniteQuery({
    url: "/friend_v1/pending",
    data: { user_id: userId },
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

  return useLoggingGetQuery({
    url: "/friend_v1/requestcount",
    data: { user_id: userId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_USER_API,
    },
    queryKey: ["user", userId, "friend", "pending", "count"],
    validator: z.coerce.number(),
    enabled: !!userId,
  });
};
