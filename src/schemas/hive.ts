import { z } from "zod";

export const hive_ = z.object({
  group_id: z.coerce.number(),
  group_name: z.string(),
  photo_url: z.object({
    String: z.string(),
    Valid: z.boolean(),
  }),
  group_type: z.string(),
});

export const extendedHive_ = hive_.extend({
  group_creator_id: z.coerce.number(),
  description: z.object({
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
  visibility: z.boolean(),
  created_at: z.string().datetime(),
});

export const hiveWithMemberInfo_ = z.object({
  group_info: extendedHive_,
  user_id: z.coerce.number(),
  status: z.string(),
});

export type Hive = z.infer<typeof hive_>;
export type ExtendedHive = z.infer<typeof extendedHive_>;
export type HiveWithMemberInfo = z.infer<typeof hiveWithMemberInfo_>;
