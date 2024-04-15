import React from "react";
import { Separator, Text, XStack, useWindowDimensions } from "tamagui";

import PageContainer from "@/src/components/PageContainer";
import PrimarySwitch from "@/src/components/PrimarySwitch";

export default function SettingScreen() {
  const { width } = useWindowDimensions();

  return (
    <PageContainer justifyContent="flex-start">
      <>
        <Text fos="$5" col="$gleam12" fow="bold">
          GLEAM SOCIETY
        </Text>
        <Separator w={width} $gtSm={{ maw: "$20" }} boc="$gleam12" />
      </>
      <XStack w="100%" px="$3" py="$1" jc="space-between">
        <Text fos="$5">New posts</Text>
        <PrimarySwitch />
      </XStack>
      <Separator w={width} $gtSm={{ maw: "$20" }} boc="$gleam12" />
      <XStack w="100%" px="$3" py="$1" jc="space-between">
        <Text fos="$5">Likes</Text>
        <PrimarySwitch />
      </XStack>
      <Separator w={width} $gtSm={{ maw: "$20" }} boc="$gleam12" />
      <XStack w="100%" px="$3" py="$1" jc="space-between">
        <Text fos="$5">New followers</Text>
        <PrimarySwitch />
      </XStack>
      <Separator w={width} $gtSm={{ maw: "$20" }} boc="$gleam12" />
      <XStack w="100%" px="$3" py="$1" jc="space-between">
        <Text fos="$5">Accepted follow requests</Text>
        <PrimarySwitch />
      </XStack>
      <Separator w={width} $gtSm={{ maw: "$20" }} boc="$gleam12" />
      <XStack w="100%" px="$3" py="$1" jc="space-between">
        <Text fos="$5">Hive requests</Text>
        <PrimarySwitch />
      </XStack>
      <Separator w={width} $gtSm={{ maw: "$20" }} boc="$gleam12" />
      <XStack w="100%" px="$3" py="$1" jc="space-between">
        <Text fos="$5">Chat messages</Text>
        <PrimarySwitch />
      </XStack>
      <Separator w={width} $gtSm={{ maw: "$20" }} boc="$gleam12" />
      <>
        <Text fos="$5" col="$gleam12" fow="bold">
          REMINDER
        </Text>
        <Separator w={width} $gtSm={{ maw: "$20" }} boc="$gleam12" />
      </>
      <XStack w="100%" px="$3" py="$1" jc="space-between">
        <Text fos="$5">Streak</Text>
        <PrimarySwitch />
      </XStack>
      <Separator w={width} $gtSm={{ maw: "$20" }} boc="$gleam12" />
      <XStack w="100%" px="$3" py="$1" jc="space-between">
        <Text fos="$5">Earned badge</Text>
        <PrimarySwitch />
      </XStack>
      <Separator w={width} $gtSm={{ maw: "$20" }} boc="$gleam12" />
    </PageContainer>
  );
}
