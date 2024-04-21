import React from "react";
import { Pressable } from "react-native";
import { Image, Text, View, YStack, ZStack } from "tamagui";

export default ({
  group_name,
  hiveImg,
  overlay,
  onPress,
}: {
  group_name: string;
  hiveImg: string;
  overlay?: string;
  onPress: () => void;
}) => {
  return (
    <YStack alignItems="center">
      <Pressable onPress={onPress} style={{ width: "100%" }}>
        <ZStack w="100%" aspectRatio={1} jc="center" ai="center">
          <Image src={hiveImg || undefined} w="100%" aspectRatio={1} br="$4" />
          {overlay ? (
            <View w="100%" aspectRatio={1} jc="center" ai="center">
              <Text fos="$12" fow="bold" col="$color1">
                {overlay}
              </Text>
            </View>
          ) : undefined}
        </ZStack>
      </Pressable>
      <Text fontSize="$3" fontWeight="bold" textOverflow="ellipsis">
        {group_name}
      </Text>
    </YStack>
  );
};
