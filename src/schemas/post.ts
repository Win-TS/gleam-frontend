import { z } from "zod";

import { baseReaction_ } from "@/src/schemas/reaction";

export const basePost_ = z.object({
  post_id: z.coerce.number(),
  member_id: z.coerce.number(),
  group_id: z.coerce.number(),
  photo_url: z.object({
    String: z.string(),
    Valid: z.coerce.boolean(),
  }),
  description: z.object({
    String: z.string(),
    Valid: z.coerce.boolean(),
  }),
  created_at: z.string(),
});

export const post_ = z.object({
  data: basePost_,
  member: z.object({
    userId: z.coerce.number(),
    username: z.string(),
    email: z.string(),
    firstname: z.string(),
    lastname: z.string(),
    photourl: z.string(),
  }),
  message: z.string(),
  reaction: z.nullable(baseReaction_),
  success: z.coerce.boolean(),
});

export const hivePost_ = basePost_.extend({
  user_id: z.coerce.number(),
  username: z.string(),
  user_photourl: z.string(),
});

export const feedPost_ = basePost_.extend({
  group_name: z.string(),
  group_photo_url: z.object({
    String: z.string(),
    Valid: z.coerce.boolean(),
  }),
  poster_username: z.string(),
  poster_photo_url: z.string(),
  total_streak_count: z.coerce.number(),
  weekly_streak_count: z.coerce.number(),
  user_reaction: z.string(),
});

export type BasePost = z.infer<typeof basePost_>;
export type Post = z.infer<typeof post_>;
export type HivePost = z.infer<typeof hivePost_>;
export type FeedPost = z.infer<typeof feedPost_>;
