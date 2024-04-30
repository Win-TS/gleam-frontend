import { z } from "zod";

export const tag_ = z.object({
  tag_id: z.coerce.number(),
  tag_name: z.string(),
  icon_url: z.object({
    String: z.string(),
    Valid: z.coerce.boolean(),
  }),
  category_id: z.object({
    Int32: z.coerce.number(),
    Valid: z.coerce.boolean(),
  }),
});

export type Tag = z.infer<typeof tag_>;
