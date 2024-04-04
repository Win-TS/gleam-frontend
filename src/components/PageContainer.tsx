import React from "react";
import { FlexStyle } from "react-native";
import { YStack } from "tamagui";

export default function ({
  justifyContent,
  children,
}: {
  justifyContent?: FlexStyle["justifyContent"];
  children: React.ReactNode;
}) {
  return (
    <YStack
      flex={1}
      paddingVertical="$4"
      backgroundColor="$color1"
      justifyContent="flex-start"
      alignItems="center"
      overflow="scroll"
    >
      <YStack
        flex={1}
        w="100%"
        justifyContent={justifyContent ?? "center"}
        alignItems="center"
        gap="$3"
        $sm={{ px: "$4" }}
        $gtSm={{ maw: "$20" }}
      >
        {children}
      </YStack>
    </YStack>
  );
}
