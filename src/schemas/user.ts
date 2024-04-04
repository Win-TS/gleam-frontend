import { z } from "zod";

export const user_ = z.object({
  id: z.coerce.number(),
  email: z.string().email(),
  phone_no: z.string(),
  private_account: z.boolean(),
  nationality: z.string(),
  age: z.coerce.number(),
  birthday: z.string().datetime(),
  gender: z.string(),
  created_at: z.string().datetime(),
});

export type User = z.infer<typeof user_>;
