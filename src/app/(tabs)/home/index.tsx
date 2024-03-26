import { Link } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import { Text, Theme, View } from "tamagui";

import EditScreenInfo from "@/src/components/EditScreenInfo";

export default function TabOneScreen() {
  return (
    <View flex={1} justifyContent="center" alignItems="center">
      <Text fontSize={20} fontWeight={"bold"}>
        Tab One
      </Text>
      <Link
        href={{
          pathname: "/(tabs)/home/hive/[id]/",
          params: {
            id: 1,
          },
        }}
        replace
        asChild
      >
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
