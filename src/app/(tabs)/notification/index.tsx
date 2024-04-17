import { useRouter } from "expo-router";
import React from "react";
import { XStack, YStack, Text } from "tamagui";

import { Icon } from "@/assets";
import PageContainer from "@/src/components/PageContainer";
import PressableSection from "@/src/components/PressableSection";

export default function NotificationScreen() {
  const router = useRouter();

  return (
    <PageContainer justifyContent="flex-start">
      <YStack w="100%">
        <PressableSection
          onPress={() => router.push("/(tabs)/notification/friend")}
        >
          <XStack w="100%" px="$3" py="$3" jc="space-between" ai="center">
            <XStack gap="$3" jc="center" ai="center">
              <Icon name="friend" />
              <YStack>
                <Text fos="$5" fow="bold">
                  Friend Request
                </Text>
                <Text fos="$2">?? and ?? others</Text>
              </YStack>
            </XStack>
            <Icon name="chevron_right" />
          </XStack>
        </PressableSection>
        <PressableSection
          onPress={() => router.push("/(tabs)/notification/hive/")}
        >
          <XStack w="100%" px="$3" py="$3" jc="space-between" ai="center">
            <XStack gap="$3" jc="center" ai="center">
              <Icon name="hive" />
              <YStack>
                <Text fos="$5" fow="bold">
                  Hive Request
                </Text>
                <Text fos="$2">?? requests are waiting</Text>
              </YStack>
            </XStack>
            <Icon name="chevron_right" />
          </XStack>
        </PressableSection>
      </YStack>
    </PageContainer>
  );
}
