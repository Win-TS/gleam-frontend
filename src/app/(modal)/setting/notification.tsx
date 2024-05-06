import React from "react";
import { Text, XStack } from "tamagui";

import PageContainer from "@/src/components/PageContainer";
import PrimarySwitch from "@/src/components/PrimarySwitch";
import Section from "@/src/components/Section";
import { TextStyle } from "@/src/constants/TextStyle";

export default function SettingScreen() {
  return (
    <PageContainer justifyContent="flex-start">
      <>
        <Section>
          <Text {...TextStyle.button.large}>GLEAM SOCIETY</Text>
        </Section>
      </>
      <Section>
        <XStack w="100%" px="$3" py="$1" jc="space-between">
          <Text {...TextStyle.button.large}>New posts</Text>
          <PrimarySwitch />
        </XStack>
      </Section>
      <Section>
        <XStack w="100%" px="$3" py="$1" jc="space-between">
          <Text {...TextStyle.button.large}>Likes</Text>
          <PrimarySwitch />
        </XStack>
      </Section>
      <Section>
        <XStack w="100%" px="$3" py="$1" jc="space-between">
          <Text {...TextStyle.button.large}>New followers</Text>
          <PrimarySwitch />
        </XStack>
      </Section>
      <Section>
        <XStack w="100%" px="$3" py="$1" jc="space-between">
          <Text {...TextStyle.button.large}>Accepted follow requests</Text>
          <PrimarySwitch />
        </XStack>
      </Section>
      <Section>
        <XStack w="100%" px="$3" py="$1" jc="space-between">
          <Text {...TextStyle.button.large}>Hive requests</Text>
          <PrimarySwitch />
        </XStack>
      </Section>
      <Section>
        <XStack w="100%" px="$3" py="$1" jc="space-between">
          <Text {...TextStyle.button.large}>Chat messages</Text>
          <PrimarySwitch />
        </XStack>
      </Section>
      <>
        <Section>
          <Text {...TextStyle.button.large}>REMINDER</Text>
        </Section>
      </>
      <Section>
        <XStack w="100%" px="$3" py="$1" jc="space-between">
          <Text {...TextStyle.button.large}>Streak</Text>
          <PrimarySwitch />
        </XStack>
      </Section>
      <Section>
        <XStack w="100%" px="$3" py="$1" jc="space-between">
          <Text {...TextStyle.button.large}>Earned badge</Text>
          <PrimarySwitch />
        </XStack>
      </Section>
    </PageContainer>
  );
}
