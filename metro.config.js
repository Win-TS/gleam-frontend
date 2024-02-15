// Learn more https://docs.expo.io/guides/customizing-metro

const { withTamagui } = require("@tamagui/metro-plugin");
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});

config.resolver.sourceExts.push("cjs");

module.exports = withTamagui(config, {
  components: ["tamagui"],
  config: "./tamagui.config.ts",
  themeBuilder: {
    input: "./themes-input.ts",
    output: "./themes.ts",
  },
  outputCSS: "./tamagui.css",
});
