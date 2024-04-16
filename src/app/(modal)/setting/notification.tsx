import React from "react";
import { Text, XStack } from "tamagui";

import PageContainer from "@/src/components/PageContainer";
import PrimarySwitch from "@/src/components/PrimarySwitch";
import Section from "@/src/components/Section";

export default function SettingScreen() {
  return (
    <PageContainer justifyContent="flex-start">
      <>
        <Section>
          <Text fos="$5" col="$gleam12" fow="bold">
            GLEAM SOCIETY
          </Text>
        </Section>
      </>
      <Section>
        <XStack w="100%" px="$3" py="$1" jc="space-between">
          <Text fos="$5">New posts</Text>
          <PrimarySwitch />
        </XStack>
      </Section>
      <Section>
        <XStack w="100%" px="$3" py="$1" jc="space-between">
          <Text fos="$5">Likes</Text>
          <PrimarySwitch />
        </XStack>
      </Section>
      <Section>
        <XStack w="100%" px="$3" py="$1" jc="space-between">
          <Text fos="$5">New followers</Text>
          <PrimarySwitch />
        </XStack>
      </Section>
      <Section>
        <XStack w="100%" px="$3" py="$1" jc="space-between">
          <Text fos="$5">Accepted follow requests</Text>
          <PrimarySwitch />
        </XStack>
      </Section>
      <Section>
        <XStack w="100%" px="$3" py="$1" jc="space-between">
          <Text fos="$5">Hive requests</Text>
          <PrimarySwitch />
        </XStack>
      </Section>
      <Section>
        <XStack w="100%" px="$3" py="$1" jc="space-between">
          <Text fos="$5">Chat messages</Text>
          <PrimarySwitch />
        </XStack>
      </Section>
      <>
        <Section>
          <Text fos="$5" col="$gleam12" fow="bold">
            REMINDER
          </Text>
        </Section>
      </>
      <Section>
        <XStack w="100%" px="$3" py="$1" jc="space-between">
          <Text fos="$5">Streak</Text>
          <PrimarySwitch />
        </XStack>
      </Section>
      <Section>
        <XStack w="100%" px="$3" py="$1" jc="space-between">
          <Text fos="$5">Earned badge</Text>
          <PrimarySwitch />
        </XStack>
      </Section>
    </PageContainer>
  );
}
