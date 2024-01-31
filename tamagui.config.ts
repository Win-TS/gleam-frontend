import { config as configBase } from "@tamagui/config";
import defu from "defu";
import { createFont, createTamagui } from "tamagui";

export const config = createTamagui(
  defu(
    {
      fonts: {
        mono: createFont({
          family: `Space Mono`,
          weight: {
            1: "500",
          },
          size: {
            1: 11,
            2: 12,
            3: 13,
            4: 14,
            5: 16,
            6: 18,
            7: 20,
            8: 22,
            9: 30,
            10: 42,
            11: 52,
            12: 62,
            13: 72,
            14: 92,
            15: 114,
            16: 124,
          },
        }),
      },
    },
    configBase,
  ) as typeof configBase,
);

export default config;

export type Conf = typeof config;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}
