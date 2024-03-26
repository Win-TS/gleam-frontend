import { Link } from "expo-router";
import React from "react";
import { Button, Image, Text, View, YStack, ZStack } from "tamagui";

import { Hive } from "@/src/schemas/hive";

export default ({
  hive: {
    group_id,
    group_name,
    photo_url: { String: hiveImg },
    frequency: { Int32: hiveFreq },
  },
}: {
  hive: Hive;
}) => {
  return (
    <YStack alignItems="center">
      <Link
        href={{ pathname: "/(tabs)/home/hive/[id]/", params: { id: group_id } }}
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
            <Image
              source={{ uri: hiveImg }}
              w="100%"
              aspectRatio={1}
              borderRadius="$4"
            />
            <View
              w="100%"
              aspectRatio={1}
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize="$12" fontWeight="bold" color="$color1">
                {hiveFreq}
              </Text>
            </View>
          </ZStack>
        </Button>
      </Link>
      <Text fontSize="$3" fontWeight="bold" textOverflow="ellipsis">
        {group_name}
      </Text>
    </YStack>
  );
};
