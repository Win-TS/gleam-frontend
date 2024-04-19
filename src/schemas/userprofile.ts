import { z } from "zod";

export const userprofile_ = z.object({
  username: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  friends_count: z.coerce.number(),
  photo_url: z.string(),
  max_streak: z.coerce.number(),
});

export type Userprofile = z.infer<typeof userprofile_>;
