import { z } from "zod";

export const post_ = z.object({
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

export const feedPost_ = post_.extend({
  group_name: z.string(),
  group_photo_url: z.object({
    String: z.string(),
    Valid: z.coerce.boolean(),
  }),
  poster_username: z.string(),
  poster_photo_url: z.string(),
});

export type Post = z.infer<typeof post_>;
export type FeedPost = z.infer<typeof feedPost_>;
