import { z } from "zod";

import {
  useLoggingInfiniteQuery,
  useLoggingMutation,
  useLoggingQuery,
} from "@/src/hooks/query";
import { post_, feedPost_, hivePost_ } from "@/src/schemas/post";
import { useUserId } from "@/src/stores/user";

export const usePostQuery = (postId: number) => {
  const userId = useUserId({ throw: false });

  return useLoggingQuery({
    url: "/post_v1/post",
    query: { post_id: postId, user_id: userId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    queryKey: ["post", postId, "data", "user", userId],
    validator: post_,
    enabled: !!userId,
  });
};

export const useHivePostListInfiniteQuery = (hiveId: number) => {
  return useLoggingInfiniteQuery({
    url: "/post_v1/groupposts",
    query: { group_id: hiveId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    queryKey: ["post", "hive", hiveId, "list"],
    validator: z.array(hivePost_),
  });
};

export const useOngoingPostListInfiniteQuery = () => {
  const userId = useUserId({ throw: false });

  return useLoggingInfiniteQuery({
    url: "/post_v1/ongoingfeed",
    query: { user_id: userId },
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

  return useLoggingInfiniteQuery({
    url: "/post_v1/followingfeed",
    query: { user_id: userId },
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
  return useLoggingQuery({
    url: "/reaction_v1/postreactioncount",
    query: { post_id: postId },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    queryKey: ["post", postId, "reaction", "count"],
    validator: postReactionCountsResponse_,
  });
};

export const useCreatePostMutation = () => {
  const userId = useUserId();

  return useLoggingMutation({
    method: "POST_FORM",
    url: "/post_v1/post",
    body: { member_id: userId, description: "" },
    getMutationRequestParams: ({
      hiveId,
      photo,
    }: {
      hiveId: number;
      photo: string;
    }) => {
      return {
        body: {
          group_id: hiveId,
          photo: {
            uri: photo,
            filename: (blob: Blob) =>
              `${userId}_${hiveId}_${Date.now()}.${blob.type.split("/")[1]}`,
          },
        },
      };
    },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    validator: z.any(),
  });
};

export const useCreatePostReactionMutation = (
  postId: number,
  reaction: string,
) => {
  const userId = useUserId();

  return useLoggingMutation({
    method: "POST",
    url: "/reaction_v1/reaction",
    body: { post_id: postId, member_id: userId, reaction },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    validator: z.any(),
    invalidateKeys: [
      ["post", postId],
      ["post", "user", userId],
    ],
  });
};

export const useDeletePostReactionMutation = (postId: number) => {
  const userId = useUserId();
  const postQuery = usePostQuery(postId);

  return useLoggingMutation({
    method: "DELETE",
    url: "/reaction_v1/reaction",
    body: {
      post_id: postId,
      member_id: userId,
      reaction: postQuery.data?.reaction?.reaction, // FIXME: maybe backend can just delete the reaction
    },
    config: {
      baseURL: process.env.EXPO_PUBLIC_GROUP_API,
    },
    validator: z.any(),
    invalidateKeys: [
      ["post", postId],
      ["post", "user", userId],
    ],
  });
};
