import { z } from "zod";

export const user_ = z.object({
  id: z.coerce.number(),
  username: z.string(),
  email: z.string().email(),
  firstname: z.string(),
  lastname: z.string(),
  phone_no: z.string(),
  private_account: z.boolean(),
  nationality: z.string(),
  birthday: z.string().datetime(),
  gender: z.string(),
  photourl: z.object({
    String: z.string(),
    Valid: z.boolean(),
  }),
  created_at: z.string().datetime(),
});

export type User = z.infer<typeof user_>;
