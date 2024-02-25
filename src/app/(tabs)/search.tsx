import React from "react";
import { Dimensions } from "react-native";
import { Input, Text, View, YStack } from "tamagui";

import HiveBtn from "@/src/components/HiveBtn";
import VerticalList from "@/src/components/VerticalList";

export default function SearchScreen() {
  return (
    <View
      flex={1}
      paddingVertical="$4"
      backgroundColor="$color1"
      justifyContent="flex-start"
      alignItems="center"
      overflow="scroll"
      gap="$3"
      $sm={{ paddingHorizontal: "$4" }}
    >
      <Input
        size="$3"
        w="100%"
        borderWidth="$1"
        borderRadius="$6"
        placeholder="What're you looking for?"
        $gtSm={{ maxWidth: "$20" }}
      />

      <YStack w="100%" $gtSm={{ maxWidth: "$20" }}>
        <Text>PERSONAL STREAK</Text>
      </YStack>
      <View
        h="$14"
        w={Math.min(Dimensions.get("window").width - 16)}
        $gtSm={{ maxWidth: 290 }}
      >
        <VerticalList
          data={[...Array(999)].map((_, i) => i)}
          numColumns={3}
          ItemSeparatorComponent={() => <View h="$0.75" />}
          estimatedItemSize={
            Math.min(Dimensions.get("window").width - 32, 290) / 3 + 16
          }
          renderItem={({ item }) => (
            <View flex={1} paddingHorizontal="$1.5">
              <HiveBtn hiveId={item} />
            </View>
          )}
        />
      </View>

      <YStack w="100%" $gtSm={{ maxWidth: "$20" }}>
        <Text>JOIN HIVE</Text>
      </YStack>
      <View
        flex={1}
        w={Math.min(Dimensions.get("window").width - 16)}
        $gtSm={{ maxWidth: 290 }}
      >
        <VerticalList
          data={[...Array(999)].map((_, i) => i)}
          numColumns={3}
          ItemSeparatorComponent={() => <View h="$0.75" />}
          estimatedItemSize={
            Math.min(Dimensions.get("window").width - 32, 290) / 3 + 16
          }
          renderItem={({ item }) => (
            <View flex={1} paddingHorizontal="$1.5">
              <HiveBtn hiveId={item} />
            </View>
          )}
        />
      </View>
    </View>
  );
}
