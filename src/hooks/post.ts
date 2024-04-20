import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { z } from "zod";

import {
  useLoggingGetInfiniteQuery,
  useLoggingGetQuery,
} from "@/src/hooks/query";
import { post_, feedPost_, hivePost_ } from "@/src/schemas/post";
import { useUserId } from "@/src/stores/user";

export const usePostQuery = (postId: number) => {
  const userId = useUserId({ throw: false });

  return useLoggingGetQuery({
    url: "/post_v1/post",
    data: { post_id: postId, user_id: userId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    queryKey: ["post", postId, "data", "user", userId],
    validator: post_,
    enabled: !!userId,
  });
};

export const useHivePostListInfiniteQuery = (hiveId: number) => {
  return useLoggingGetInfiniteQuery({
    url: "/post_v1/groupposts",
    data: { group_id: hiveId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    queryKey: ["post", "hive", hiveId, "list"],
    validator: z.array(hivePost_),
  });
};

export const useOngoingPostListInfiniteQuery = () => {
  const userId = useUserId({ throw: false });

  return useLoggingGetInfiniteQuery({
    url: "/post_v1/ongoingfeed",
    data: { user_id: userId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    queryKey: ["post", "user", userId, "ongoing", "list"],
    validator: z.array(feedPost_),
    enabled: !!userId,
  });
};

export const useFollowingPostListInfiniteQuery = () => {
  const userId = useUserId({ throw: false });

  return useLoggingGetInfiniteQuery({
    url: "/post_v1/followingfeed",
    data: { user_id: userId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    queryKey: ["post", "user", userId, "following", "list"],
    validator: z.array(feedPost_),
    enabled: !!userId,
  });
};

export const postReactionCountsResponse_ = z.object({
  data: z.record(z.string(), z.coerce.number()),
  total_reaction: z.coerce.number(),
  post_id: z.coerce.number(),
  success: z.coerce.boolean(),
});
export const usePostReactionCountsQuery = (postId: number) => {
  return useLoggingGetQuery({
    url: "/reaction_v1/postreactioncount",
    data: { post_id: postId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    queryKey: ["post", postId, "reaction", "count"],
    validator: postReactionCountsResponse_,
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
      return await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["post", postId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["post", "user", userId],
        }),
      ]);
    },
  });
};

export const useDeletePostReactionMutation = (postId: number) => {
  const userId = useUserId();
  const queryClient = useQueryClient();

  const postQuery = usePostQuery(postId);

  return useMutation<void, AxiosError<{ message: string }>>({
    mutationFn: async () => {
      return await axios.delete("/reaction_v1/reaction", {
        baseURL: process.env.EXPO_PUBLIC_GROUP_API,
        data: {
          post_id: postId,
          member_id: userId,
          reaction: postQuery.data?.reaction?.reaction, // FIXME: maybe backend can just delete the reaction
        },
      });
    },
    onSettled: async () => {
      return await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["post", postId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["post", "user", userId],
        }),
      ]);
    },
  });
};
