import React from "react";
import { Pressable } from "react-native";
import { Image, Text, View, YStack, ZStack } from "tamagui";

import { TextStyle } from "@/src/constants/TextStyle";
import { Hive } from "@/src/schemas/hive";

export default ({
  hive: {
    group_name,
    photo_url: { String: hiveImg },
  },
  overlay,
  onPress,
}: {
  hive: Hive;
  overlay?: string;
  onPress?: () => void;
}) => {
  return (
    <YStack alignItems="center" gap="$1">
      <Pressable onPress={onPress} style={{ width: "100%" }}>
        <ZStack w="100%" aspectRatio={1} jc="center" ai="center">
          <Image src={hiveImg || undefined} w="100%" aspectRatio={1} br="$4" />
          {overlay ? (
            <View w="100%" aspectRatio={1} jc="center" ai="center">
              <Text col="$color1" {...TextStyle.button.extraLarge}>
                {overlay}
              </Text>
            </View>
          ) : undefined}
        </ZStack>
      </Pressable>
      <Text col="$color12" textOverflow="ellipsis" {...TextStyle.button.small}>
        {group_name}
      </Text>
    </YStack>
  );
};
