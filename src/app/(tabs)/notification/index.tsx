import { useRouter } from "expo-router";
import React from "react";
import { XStack, YStack, Text } from "tamagui";

import { Icon } from "@/assets";
import PageContainer from "@/src/components/PageContainer";
import PressableSection from "@/src/components/PressableSection";
import QueryPlaceholder from "@/src/components/QueryPlaceholder";
import { TextStyle } from "@/src/constants/TextStyle";
import { useUserAdminHiveRequestCountQuery } from "@/src/hooks/hive";
import {
  useFriendRequestCountQuery,
  useFriendRequestListInfiniteQuery,
} from "@/src/hooks/user";

export default function NotificationScreen() {
  const router = useRouter();

  const friendRequestListInfiniteQuery = useFriendRequestListInfiniteQuery();
  const friendRequestCountQuery = useFriendRequestCountQuery();

  const userAdminHiveRequestCountQuery = useUserAdminHiveRequestCountQuery();

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
                <Text {...TextStyle.button.large}>Friend Request</Text>
                <QueryPlaceholder
                  query={friendRequestCountQuery}
                  renderData={(countData) => {
                    switch (countData) {
                      case 0:
                        return (
                          <Text {...TextStyle.description}>
                            no pending requests
                          </Text>
                        );
                      case 1:
                        return (
                          <QueryPlaceholder
                            query={friendRequestListInfiniteQuery}
                            renderData={(listData) => (
                              <Text {...TextStyle.description}>
                                {listData.pages[0].data[0].username}
                              </Text>
                            )}
                          />
                        );
                      default:
                        return (
                          <QueryPlaceholder
                            query={friendRequestListInfiniteQuery}
                            renderData={(listData) => (
                              <Text {...TextStyle.description}>
                                {listData.pages[0].data[0].username} and{" "}
                                {countData - 1} others
                              </Text>
                            )}
                          />
                        );
                    }
                  }}
                />
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
                <Text {...TextStyle.button.large}>Hive Request</Text>
                <QueryPlaceholder
                  query={userAdminHiveRequestCountQuery}
                  renderData={(data) => {
                    switch (data) {
                      case 0:
                        return (
                          <Text {...TextStyle.description}>
                            no pending requests
                          </Text>
                        );
                      default:
                        return (
                          <Text {...TextStyle.description}>
                            {data} requests pending
                          </Text>
                        );
                    }
                  }}
                />
              </YStack>
            </XStack>
            <Icon name="chevron_right" />
          </XStack>
        </PressableSection>
      </YStack>
    </PageContainer>
  );
}
