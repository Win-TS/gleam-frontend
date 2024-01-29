import React from "react";
import { Link, Stack } from "expo-router";
import { StyleSheet } from "react-native";

import { Text, View } from "tamagui";

import { useColorScheme } from "@/src/components/useColorScheme";
import Colors from "@/src/constants/Colors";

export default function NotFoundScreen() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View flex={1} justifyContent="center" alignItems="center" padding={20}>
        <Text fontSize={20} fontWeight={"bold"}>
          This screen doesn&apos;t exist.
        </Text>

        <Link href="/" style={styles.link}>
          <Text fontSize={16} color={Colors[colorScheme ?? "light"].tint}>
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
