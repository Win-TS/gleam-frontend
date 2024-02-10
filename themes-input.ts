import { createThemeBuilder, objectEntries } from "@tamagui/theme-builder";
import {
  componentThemeDefinitions,
  palettes,
  templates,
  masks,
  shadows,
  maskOptions,
} from "@tamagui/themes";

const gleamPalettes = {
  light: {
    gleam1: "#ffffff",
    gleam2: "#fff9e8",
    gleam3: "#fff3d1",
    gleam4: "#ffeeb9",
    gleam5: "#ffe8a2",
    gleam6: "#ffe28b",
    gleam7: "#ffdc74",
    gleam8: "#ffd65d",
    gleam9: "#ffd146",
    gleam10: "#ffcb2e",
    gleam11: "#ffc517",
    gleam12: "#febe00",
  },
  dark: {
    gleam1: "#000000",
    gleam2: "#171100",
    gleam3: "#2e2300",
    gleam4: "#463400",
    gleam5: "#5d4600",
    gleam6: "#745700",
    gleam7: "#8b6800",
    gleam8: "#a27a00",
    gleam9: "#b98b00",
    gleam10: "#d19c00",
    gleam11: "#e8ae00",
    gleam12: "#febe00",
  },
} as const;

const themesBuilder = createThemeBuilder()
  .addPalettes({
    light: palettes.light,
    dark: palettes.dark,
    light_gleam: objectEntries(gleamPalettes.light).map(([_, v]) => v),
    dark_gleam: objectEntries(gleamPalettes.dark).map(([_, v]) => v),
  })
  .addTemplates(templates)
  .addMasks(masks)
  .addThemes({
    light: {
      template: "base",
      palette: "light",
      nonInheritedValues: {
        ...gleamPalettes.light,
        ...shadows.light,
      },
    },
    dark: {
      template: "base",
      palette: "dark",
      nonInheritedValues: {
        ...gleamPalettes.dark,
        ...shadows.dark,
      },
    },
  })
  .addChildThemes({
    gleam: [
      {
        parent: "light",
        palette: "gleam",
        template: "colorLight",
      },
      {
        parent: "dark",
        palette: "gleam",
        template: "base",
      },
    ],
  })
  .addChildThemes({
    alt1: {
      mask: "soften",
      ...maskOptions.alt,
    },
    alt2: {
      mask: "soften2",
      ...maskOptions.alt,
    },
    active: {
      mask: "soften3",
      skip: {
        color: 1,
      },
    },
  });

export const themes = themesBuilder.build();
