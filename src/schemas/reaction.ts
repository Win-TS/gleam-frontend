import { z } from "zod";

export const reaction_ = z.object({
  reaction_id: z.coerce.number(),
  post_id: z.coerce.number(),
  member_id: z.coerce.number(),
  reaction: z.string(),
  created_at: z.string(),
  user_id: z.coerce.number(),
  username: z.string(),
  user_photourl: z.string(),
});

export type Reaction = z.infer<typeof reaction_>;
