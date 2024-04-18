import { router } from "expo-router";
import React, { useMemo } from "react";
import { Avatar, Text, View, XStack, YStack } from "tamagui";

import { Icon } from "@/assets";
import PageContainer from "@/src/components/PageContainer";
import PressableSection from "@/src/components/PressableSection";
import VerticalList from "@/src/components/VerticalList";
import {
  useHiveQueries,
  useHiveRequestCountQuery,
  useUserHiveListQuery,
} from "@/src/hooks/hive";
import { useUserId } from "@/src/stores/user";
import { HiveWithMemberInfo } from "@/src/schemas/hive";
import QueryPlaceholder from "@/src/components/QueryPlaceholder";

const HiveRequestSection = ({ hive }: { hive: HiveWithMemberInfo }) => {
  const hiveRequestCountQuery = useHiveRequestCountQuery(
    hive.group_info.group_id,
  );

  return (
    <PressableSection
      onPress={() =>
        router.push({
          pathname: "/(tabs)/notification/hive/[id]/",
          params: { id: hive.group_info.group_id },
        })
      }
    >
      <XStack w="100%" jc="space-between" ai="center" p="$3">
        <XStack jc="center" ai="center" gap="$3">
          <Avatar>
            <Avatar circular size="$4">
              <Avatar.Image src={hive.group_info.photo_url.String} />
              <Avatar.Fallback bc="$color5" />
            </Avatar>
          </Avatar>
          <YStack>
            <Text fos="$5" fow="bold">
              {hive.group_info.group_name}
            </Text>
            <QueryPlaceholder
              query={hiveRequestCountQuery}
              renderData={(data) => (
                <Text fos="$2">{data} requests pending</Text>
              )}
            />
          </YStack>
        </XStack>
        <Icon name="chevron_right" />
      </XStack>
    </PressableSection>
  );
};

export default function HiveNotificationScreen() {
  const userId = useUserId();

  const userHiveListQuery = useUserHiveListQuery(userId);
  const flattenedHiveIdList = useMemo(
    () =>
      [
        ...(userHiveListQuery.data?.personal_groups ?? []),
        ...(userHiveListQuery.data?.social_groups ?? []),
      ].map(({ group_id }) => group_id),
    [userHiveListQuery.data],
  );
  const extendedUserHiveListQuery = useHiveQueries(flattenedHiveIdList);
  const flattenedUserAdminHiveList = useMemo(
    () =>
      extendedUserHiveListQuery
        .map(({ data }) => data)
        .filter(Boolean)
        .filter(
          (data) => data.status === "creator" || data.status === "co_leader",
        ),
    [extendedUserHiveListQuery],
  );

  return (
    <PageContainer>
      <View w="100%" h="100%">
        <VerticalList
          data={flattenedUserAdminHiveList}
          numColumns={1}
          estimatedItemSize={74}
          renderItem={({ item }) => <HiveRequestSection hive={item} />}
        />
      </View>
    </PageContainer>
  );
}
