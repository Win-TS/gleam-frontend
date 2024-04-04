import { z } from "zod";

export const hive_ = z.object({
  group_id: z.coerce.number(),
  group_name: z.string(),
  group_creator_id: z.coerce.number(),
  description: z.object({
    String: z.string(),
    Valid: z.boolean(),
  }),
  photo_url: z.object({
    String: z.string(),
    Valid: z.boolean(),
  }),
  tag_name: z.string(),
  frequency: z.object({
    Int32: z.coerce.number(),
    Valid: z.boolean(),
  }),
  max_members: z.coerce.number(),
  total_member: z.coerce.number(),
  group_type: z.string(),
  visibility: z.boolean(),
  created_at: z.string().datetime(),
});

export type Hive = z.infer<typeof hive_>;
