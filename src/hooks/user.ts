import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { z, ZodError } from "zod";

import { FriendPair, friendPair_, friend_ } from "@/src/schemas/friend";
import { User, user_ } from "@/src/schemas/user";
import { userprofile_, Userprofile } from "@/src/schemas/userprofile";
import { useUserId } from "@/src/stores/user";

export const useUserQuery = () => {
  const userId = useUserId({ throw: false });

  return useQuery<User, AxiosError<{ message: string }> | ZodError>({
    queryKey: ["user", userId, "info", "all"],
    queryFn: async () => {
      return await user_.parseAsync(
        (
          await axios.get("/user_v1/userinfo", {
            baseURL: process.env.EXPO_PUBLIC_USER_API,
            params: { user_id: userId },
          })
        ).data,
      );
    },
    enabled: !!userId,
  });
};

export const useUserprofileQuery = (userId: number) => {
  return useQuery<Userprofile, AxiosError<{ message: string }> | ZodError>({
    queryKey: ["user", userId, "info"],
    queryFn: async () => {
      return await userprofile_.parseAsync(
        (
          await axios.get("/user_v1/userprofile", {
            baseURL: process.env.EXPO_PUBLIC_USER_API,
            params: { user_id: userId },
          })
        ).data,
      );
    },
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
  const userId = useUserId();

  return useQuery<FriendPair[], AxiosError<{ message: string }>>({
    queryKey: ["user", userId, "friend", otherUserId],
    queryFn: async () => {
      try {
        return await z.array(friendPair_).parseAsync(
          await axios.get("/friend_v1/", {
            baseURL: process.env.EXPO_PUBLIC_USER_API,
            params: { user_id1: userId, user_id2: otherUserId },
          }),
        );
      } catch {
        // FIXME: no way to really tell if backend error or we do not have friends
        return [];
      }
    },
  });
};

export const useFriendListInfiniteQuery = (userId: number) => {
  return useInfiniteQuery({
    queryKey: ["user", userId, "friend", "list"],
    queryFn: async ({ pageParam }) => {
      const data = await z.array(friend_).parseAsync(
        (
          await axios.get("/friend_v1/list", {
            params: { user_id: userId, limit: 12, offset: pageParam },
            baseURL: process.env.EXPO_PUBLIC_GROUP_API,
          })
        ).data,
      );
      const calcPreviousOffset = Math.max(0, pageParam - 12);
      const calcNextOffset = pageParam + data.length;
      return {
        data,
        previousOffset:
          calcPreviousOffset !== pageParam ? calcPreviousOffset : undefined,
        nextOffset: calcNextOffset !== pageParam ? calcNextOffset : undefined,
      };
    },
    initialPageParam: 0,
    getPreviousPageParam: (firstPage) => firstPage.previousOffset ?? undefined,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
    gcTime: 5,
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
  const userId = useUserId();

  return useInfiniteQuery({
    queryKey: ["user", userId, "friend", "pending", "list"],
    queryFn: async ({ pageParam }) => {
      const data = await z.array(user_).parseAsync(
        (
          await axios.get("/friend_v1/pending", {
            params: { user_id: userId, limit: 12, offset: pageParam },
            baseURL: process.env.EXPO_PUBLIC_USER_API,
          })
        ).data,
      );
      const calcPreviousOffset = Math.max(0, pageParam - 12);
      const calcNextOffset = pageParam + data.length;
      return {
        data,
        previousOffset:
          calcPreviousOffset !== pageParam ? calcPreviousOffset : undefined,
        nextOffset: calcNextOffset !== pageParam ? calcNextOffset : undefined,
      };
    },
    initialPageParam: 0,
    getPreviousPageParam: (firstPage) => firstPage.previousOffset ?? undefined,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
    gcTime: 5,
  });
};

export const useFriendRequestCountQuery = () => {
  const userId = useUserId();

  return useQuery<number, AxiosError<{ message: string }>>({
    queryKey: ["user", userId, "friend", "pending", "count"],
    queryFn: async () => {
      return await z.coerce.number().parseAsync(
        (
          await axios.get("/friend_v1/requestcount", {
            baseURL: process.env.EXPO_PUBLIC_USER_API,
            params: { user_id: userId },
          })
        ).data,
      );
    },
  });
};
