import React from "react";
import { Text, Theme, View } from "tamagui";

import EditScreenInfo from "@/src/components/EditScreenInfo";

export default function TabTwoScreen() {
  return (
    <View f={1} jc="center" ai="center">
      <Text fos={20} fow={"bold"}>
        Tab Two
      </Text>
      <Theme inverse>
        <View my={32} h={1} w="80%" />
      </Theme>
      <EditScreenInfo path="app/(tabs)/two.tsx" />
    </View>
  );
}
