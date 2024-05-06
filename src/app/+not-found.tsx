import { Link, Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "tamagui";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View f={1} jc="center" ai="center" p={20}>
        <Text fos={20} fow="bold">
          This screen doesn&apos;t exist.
        </Text>

        <Link href="/home/" style={styles.link}>
          <Text fos={16}>Go to home screen!</Text>
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
