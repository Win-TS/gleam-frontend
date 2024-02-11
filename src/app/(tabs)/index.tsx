import React from "react";
import { Text, Theme, View } from "tamagui";

import EditScreenInfo from "@/src/components/EditScreenInfo";
import { Link } from "expo-router";
import { Pressable } from "react-native";

export default function TabOneScreen() {
  return (
    <View flex={1} justifyContent="center" alignItems="center">
      <Text fontSize={20} fontWeight={"bold"}>
        Tab One
      </Text>
      <Link href="/signup" asChild>
        <Pressable>
          <Text fontSize={20}>gooo</Text>
        </Pressable>
      </Link>
      <Theme inverse>
        <View marginVertical={32} height={1} width="80%" />
      </Theme>
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}
