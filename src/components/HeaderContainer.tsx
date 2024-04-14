import React from "react";
import { YStack } from "tamagui";

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <YStack
      p="$3"
      w="100%"
      bc="$gleam1"
      bw="$1.5"
      br="$8"
      boc="$gleam12"
      shac="$gleam12"
      shar="$2"
      jc="center"
      ai="center"
      gap="$3"
    >
      {children}
    </YStack>
  );
}
