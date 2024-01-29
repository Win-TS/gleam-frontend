// Learn more https://docs.expo.io/guides/customizing-metro

import { getDefaultConfig } from "expo/metro-config";
/** @type {import('expo/metro-config').MetroConfig} */

const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});
import { withTamagui } from "@tamagui/metro-plugin";

export default withTamagui(config, {
  components: ["tamagui"],
  config: "./tamagui.config.ts",
  themeBuilder: {
    input: "./themes-input.ts",
    output: "./themes.ts",
  },
  outputCSS: "./tamagui.css",
});
