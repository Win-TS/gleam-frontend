import { Link } from "expo-router";
import React from "react";
import { Button, Text, View, YStack, ZStack } from "tamagui";

export default ({ hiveId }: { hiveId: number }) => {
  return (
    <YStack alignItems="center">
      <Link
        href={{ pathname: "/(tabs)/home/hive/[id]/", params: { id: hiveId } }}
        asChild
        replace
      >
        <Button w="100%" aspectRatio={1} unstyled>
          <ZStack
            w="100%"
            aspectRatio={1}
            justifyContent="center"
            alignItems="center"
          >
            <View
              w="100%"
              aspectRatio={1}
              borderRadius="$4"
              backgroundColor="#bbbbbb"
            ></View>
            <View
              w="100%"
              aspectRatio={1}
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize="$12" fontWeight="bold" color="$color1">
                {hiveId}
              </Text>
            </View>
          </ZStack>
        </Button>
      </Link>
      <Text fontSize="$3" fontWeight="bold" textOverflow="ellipsis">
        NO SHOWER
      </Text>
    </YStack>
  );
};
