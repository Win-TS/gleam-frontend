import { Link, Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "tamagui";

import { useColorScheme } from "@/src/components/useColorScheme";
import Colors from "@/src/constants/Colors";

export default function NotFoundScreen() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View f={1} jc="center" ai="center" p={20}>
        <Text fos={20} fow="bold">
          This screen doesn&apos;t exist.
        </Text>

        <Link href="/home/" style={styles.link}>
          <Text fos={16} col={Colors[colorScheme ?? "light"].tint}>
            Go to home screen!
          </Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
