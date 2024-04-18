import { z } from "zod";

export const friend_ = z.object({
  friend_id: z.coerce.number(),
  id: z.coerce.number(),
  username: z.string(),
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  phone_no: z.string(),
  private_account: z.coerce.boolean(),
  nationality: z.string(),
  birthday: z.string(),
  gender: z.string(),
  photourl: z.object({
    String: z.string(),
    Valid: z.coerce.boolean(),
  }),
  created_at: z.string(),
});

export const friendPair_ = z.object({
  id: z.coerce.number(),
  user_id1: z.object({
    Int32: z.coerce.number(),
    Valid: z.coerce.boolean(),
  }),
  user_id2: z.object({
    Int32: z.coerce.number(),
    Valid: z.coerce.boolean(),
  }),
  status: z.object({
    String: z.string(),
    Valid: z.coerce.boolean(),
  }),
  created_at: z.string(),
});

export type Friend = z.infer<typeof friend_>;
export type FriendPair = z.infer<typeof friendPair_>;
