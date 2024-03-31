import { z } from "zod";

export const post_ = z.object({
  post_id: z.coerce.number(),
  member_id: z.coerce.number(),
  group_id: z.coerce.number(),
  photo_url: z.object({
    String: z.string(),
    Valid: z.boolean(),
  }),
  description: z.object({
    String: z.string(),
    Valid: z.boolean(),
  }),
  created_at: z.string(),
});

export type Post = z.infer<typeof post_>;
