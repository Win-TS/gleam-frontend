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
  tag_id: z.optional(z.coerce.number()), // TODO: ask backend which one is getting returned
  tag_name: z.optional(z.string()),
  frequency: z.object({
    Int32: z.coerce.number(),
    Valid: z.boolean(),
  }),
  max_members: z.coerce.number(),
  group_type: z.string(),
  visibility: z.boolean(),
  created_at: z.string(),
});

export type Hive = z.infer<typeof hive_>;
