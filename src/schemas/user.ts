import { z } from "zod";

export const user_ = z.object({
  id: z.coerce.number(),
  email: z.string(),
  phone_no: z.string(),
  private_account: z.boolean(),
  nationality: z.string(),
  age: z.coerce.number(),
  birthday: z.string(),
  gender: z.string(),
  created_at: z.string(),
});

export type User = z.infer<typeof user_>;
