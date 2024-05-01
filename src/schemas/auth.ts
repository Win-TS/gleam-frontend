import { z } from "zod";

export const authUser_ = z.object({
  displayName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  providerId: z.string(),
  rawId: z.string(),
  CustomClaims: z.object({
    gleamUserId: z.coerce.number(),
  }),
  Disabled: z.coerce.boolean(),
  EmailVerified: z.coerce.boolean(),
  ProviderUserInfo: z.array(
    z.union([
      z.object({
        phoneNumber: z.string(),
        providerId: z.string(),
        rawId: z.string(),
      }),
      z.object({
        displayName: z.string(),
        email: z.string().email(),
        providerId: z.string(),
        rawId: z.string(),
      }),
    ]),
  ),
  TokensValidAfterMillis: z.coerce.number(),
  UserMetadata: z.object({
    CreationTimestamp: z.coerce.number(),
    LastLogInTimestamp: z.coerce.number(),
    LastRefreshTimestamp: z.coerce.number(),
  }),
  TenantID: z.string(),
});

export type AuthUser = z.infer<typeof authUser_>;
