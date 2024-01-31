import React from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "tamagui";

import { ExternalLink } from "./ExternalLink";

import { useColorScheme } from "@/src/components/useColorScheme";
import Colors from "@/src/constants/Colors";

export default function EditScreenInfo({ path }: { path: string }) {
  const colorScheme = useColorScheme();

  return (
    <View>
      <View alignItems="center" marginHorizontal={48}>
        <Text fontSize={16} textAlign="center">
          Open up the code for this screen:
        </Text>

        <View marginHorizontal={8} paddingHorizontal={4} borderRadius={4}>
          <Text fontFamily="$mono">{path}</Text>
        </View>

        <Text fontSize={16} textAlign="center">
          Change any of the text, save the file, and your app will automatically
          update.
        </Text>
      </View>

      <View marginTop={16} marginHorizontal={20} alignItems="center">
        <ExternalLink
          style={styles.helpLink}
          href="https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet"
        >
          <Text color={Colors[colorScheme ?? "light"].tint}>
            Tap here if your app doesn&apos;t automatically update after making
            changes
          </Text>
        </ExternalLink>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  helpLink: {
    paddingVertical: 15,
  },
});
