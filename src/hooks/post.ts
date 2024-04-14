import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ZodError, z } from "zod";

import { post_, feedPost_ } from "@/src/schemas/post";
import { reaction_, Reaction } from "@/src/schemas/reaction";
import { useUserId, useUserStore } from "@/src/stores/user";

export const useHivePostListInfiniteQuery = (hiveId: number) => {
  return useInfiniteQuery({
    queryKey: ["post", "hive", hiveId, "list"],
    queryFn: async ({ pageParam }) => {
      const data = await z.array(post_).parseAsync(
        (
          await axios.get("/post_v1/groupposts", {
            params: { group_id: hiveId, limit: 24, offset: pageParam },
            baseURL: process.env.EXPO_PUBLIC_GROUP_API,
          })
        ).data,
      );
      const calcPreviousOffset = Math.max(0, pageParam - 24);
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
  });
};

export const useOngoingPostListInfiniteQuery = () => {
  const userId = useUserId();

  return useInfiniteQuery({
    queryKey: ["post", "user", userId, "ongoing", "list"],
    queryFn: async ({ pageParam }) => {
      const data = await z.array(feedPost_).parseAsync(
        (
          await axios.get("/post_v1/ongoingfeed", {
            params: {
              user_id: userId,
              limit: 24,
              offset: pageParam,
            },
            baseURL: process.env.EXPO_PUBLIC_GROUP_API,
          })
        ).data,
      );
      const calcPreviousOffset = Math.max(0, pageParam - 24);
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
  });
};

export const useFollowingPostListInfiniteQuery = () => {
  const userId = useUserId();

  return useInfiniteQuery({
    queryKey: ["post", "user", userId, "following", "list"],
    queryFn: async ({ pageParam }) => {
      const data = await z.array(feedPost_).parseAsync(
        (
          await axios.get("/post_v1/followingfeed", {
            params: {
              user_id: userId,
              limit: 24,
              offset: pageParam,
            },
            baseURL: process.env.EXPO_PUBLIC_GROUP_API,
          })
        ).data,
      );
      const calcPreviousOffset = Math.max(0, pageParam - 24);
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
  });
};

export const usePostReactionsQuery = (postId: number) => {
  return useQuery<Reaction[], AxiosError<{ message: string }> | ZodError>({
    queryKey: ["post", postId, "reaction"],
    queryFn: async () => {
      return await z.array(reaction_).parseAsync(
        (
          await axios.get("/reaction_v1/postreactions", {
            baseURL: process.env.EXPO_PUBLIC_GROUP_API,
            params: { post_id: postId },
          })
        ).data,
      );
    },
  });
};

export const useCreatePostMutation = () => {
  const userId = useUserId();

  return useMutation<
    void,
    AxiosError<{ message: string }>,
    {
      hiveId: number;
      photo: string;
    }
  >({
    mutationFn: async ({ hiveId, photo }) => {
      const photoBlob = await (await fetch(photo)).blob();
      const postFormData = new FormData();
      postFormData.append("member_id", userId.toString());
      postFormData.append("group_id", hiveId.toString());
      postFormData.append("description", "");
      postFormData.append(
        "photo",
        photoBlob,
        `${userId}_${Date.now()}.${photo.split(";")[0].split("/")[1]}`,
      );
      return await axios.post("/post_v1/post", postFormData, {
        baseURL: process.env.EXPO_PUBLIC_GROUP_API,
      });
    },
  });
};

export const useCreatePostReactionMutation = (
  postId: number,
  reaction: string,
) => {
  const userId = useUserId();
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message: string }>>({
    mutationFn: async () => {
      return await axios.post(
        "/reaction_v1/reaction",
        {
          post_id: postId,
          member_id: userId,
          reaction,
        },
        { baseURL: process.env.EXPO_PUBLIC_GROUP_API },
      );
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ["post", postId, "reaction"],
      });
    },
  });
};

export const useDeletePostReactionMutation = (
  postId: number,
  reaction: string,
) => {
  const userId = useUserId();
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message: string }>>({
    mutationFn: async () => {
      return await axios.delete("/reaction_v1/reaction", {
        baseURL: process.env.EXPO_PUBLIC_GROUP_API,
        params: {
          post_id: postId,
          member_id: userId,
          reaction,
        },
      });
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ["post", postId, "reaction"],
      });
    },
  });
};
