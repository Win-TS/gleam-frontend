import { config as configBase } from "@tamagui/config";
import defu, { Defu } from "defu";
import { createFont, createTamagui } from "tamagui";

import * as themes from "./themes";

const baseFont = {
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
};

const createFontMap = <FontFamilies extends string[]>(
  fontFamilies: FontFamilies,
): {
  [FontFamily in FontFamilies[number] as Uncapitalize<FontFamily>]: Defu<
    { family: FontFamily },
    [typeof baseFont]
  >;
} =>
  // @ts-ignore
  Object.fromEntries(
    fontFamilies.map((fontFamily) => [
      fontFamily.charAt(0).toLowerCase() + fontFamily.slice(1),
      createFont(
        defu(
          {
            family: fontFamily,
          },
          baseFont,
        ),
      ),
    ]),
  );

const olyford = createFontMap([
  "OlyfordHeavy",
  "OlyfordBlack",
  "OlyfordExtrabold",
  "OlyfordBold",
  "OlyfordMedium",
  "OlyfordRegular",
  "OlyfordLight",
  "OlyfordExtralight",
  "OlyfordThin",
] as const);

const acuminProWideLight = createFont({
  family: `AcuminProWideLight`,
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
});

const acuminProWideSemibold = createFont({
  family: `AcuminProWideSemibold`,
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
});

const mergedConfig = defu(
  {
    fonts: {
      header: olyford.olyfordBlack,
      body: acuminProWideLight,
      ...olyford,
      acuminProWideLight,
      acuminProWideSemibold,
      mono: createFont({
        family: `SpaceMono`,
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
    themes,
  },
  configBase,
);

export const config = createTamagui(mergedConfig);

export default config;

export type Conf = typeof config;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}
