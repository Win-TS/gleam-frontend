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
    <YStack f={1} pt="$4" bc="$color1" jc="flex-start" ai="center" ov="scroll">
      <YStack
        f={1}
        w="100%"
        jc={justifyContent ?? "center"}
        ai="center"
        gap="$3"
        $sm={{ px: "$4" }}
        $gtSm={{ maw: "$20" }}
      >
        {children}
      </YStack>
    </YStack>
  );
}
