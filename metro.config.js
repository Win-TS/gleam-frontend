// Learn more https://docs.expo.io/guides/customizing-metro
const { generate } = require("@storybook/react-native/scripts/generate");
const { withTamagui } = require("@tamagui/metro-plugin");
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

generate({
  configPath: path.resolve(__dirname, "./.storybook"),
});

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});
config.transformer.unstable_allowRequireContext = true;

config.resolver.sourceExts.push("mjs");
config.resolver.sourceExts.push("cjs");

const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};
config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...resolver.sourceExts, "svg"],
};

module.exports = withTamagui(config, {
  components: ["tamagui"],
  config: "./tamagui.config.ts",
  themeBuilder: {
    input: "./themes-input.ts",
    output: "./themes.ts",
  },
  outputCSS: "./tamagui.css",
});
