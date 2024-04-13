// import { ChevronRight } from "@tamagui/lucide-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  Text,
  View,
  Separator,
  Avatar,
  XStack,
  YStack,
  useTheme,
  Popover,
  Button,
  useWindowDimensions,
} from "tamagui";
import { z } from "zod";

import DangerBtn from "@/src/components/DangerBtn";
import HiveBtn from "@/src/components/HiveBtn";
import PrimaryBtn from "@/src/components/PrimaryBtn";
import ProfileHeader from "@/src/components/ProfileHeader";
import QueryPlaceholder from "@/src/components/QueryPlaceholder";
import VerticalList from "@/src/components/VerticalList";
import { useHiveListInfiniteQuery } from "@/src/hooks/hive";
import { useUserprofileQuery } from "@/src/hooks/user";

const ProfileOptionsPopover = ({ userId }: { userId: number }) => {
  const theme = useTheme();

  return (
    <Popover placement="bottom-end" allowFlip offset={4}>
      <Popover.Trigger asChild>
        <Button
          position="absolute"
          size="$3"
          borderRadius="$8"
          top="$0"
          right="$0"
          backgroundColor="$gleam1"
        >
          <FontAwesome name="ellipsis-h" color={theme.gleam12.val} size={24} />
        </Button>
      </Popover.Trigger>
      <Popover.Content
        p="$2"
        w="$12"
        backgroundColor="$color1"
        borderWidth="$1"
        borderColor="$color4"
      >
        <View w="100%" gap="$2">
          <Link
            href={{
              pathname: "/(tabs)/home/profile/[id]/report",
              params: {
                id: userId,
              },
            }}
            asChild
          >
            <DangerBtn size="$2.5" w="100%" borderRadius="$4">
              Report
            </DangerBtn>
          </Link>
        </View>
      </Popover.Content>

      <Popover.Adapt platform="touch">
        <Popover.Sheet snapPointsMode="fit" modal>
          <Popover.Sheet.Frame>
            <Popover.Sheet.ScrollView p="$4">
              <Popover.Adapt.Contents />
            </Popover.Sheet.ScrollView>
          </Popover.Sheet.Frame>
          <Popover.Sheet.Overlay />
        </Popover.Sheet>
      </Popover.Adapt>
    </Popover>
  );
};

const ProfileScreenNoHive = ({ userId }: { userId: number }) => {
  const userprofileQuery = useUserprofileQuery(userId);

  const showBadge = true;

  return (
    <YStack w="100%" gap="$3" $gtSm={{ maw: "$20" }}>
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
        <QueryPlaceholder
          query={userprofileQuery}
          spinnerSize="large"
          renderData={(data) => <ProfileHeader userprofile={data} />}
        />
        <XStack jc="center" ai="center" gap="$3">
          <PrimaryBtn w="$10" size="$2.5">
            FOLLOW
          </PrimaryBtn>
          <PrimaryBtn w="$10" size="$2.5">
            MESSAGE
          </PrimaryBtn>
        </XStack>
        <XStack gap="$3">
          <YStack w="$5" jc="center" ai="center">
            <Text col="$color11" fow="bold">
              FRIEND
            </Text>
            <QueryPlaceholder
              query={userprofileQuery}
              spinnerSize="small"
              renderData={(data) => (
                <Text col="$color11" fow="normal">
                  {data.friends_count}
                </Text>
              )}
            />
          </YStack>
          <Separator als="stretch" vertical boc="$gleam12" />
          <YStack w="$5" jc="center" ai="center">
            <Text col="$color11" fow="bold">
              LEVEL
            </Text>
            <Text col="$color11" fow="normal">
              130
            </Text>
          </YStack>
        </XStack>
        <ProfileOptionsPopover userId={userId} />
      </YStack>
      <XStack
        w="100%"
        bc="$gleam12"
        br="$8"
        boc="$gleam12"
        jc="center"
        ai="center"
        gap="$3"
      >
        <Text col="$color1" fos="$4" fow="bold">
          HIGHEST STREAKS
        </Text>
        <Text col="$color1" fos="$10" fow="bold">
          81
        </Text>
        <Text col="$color1" fos="$4" fow="bold">
          DAYS
        </Text>
      </XStack>

      {showBadge ? (
        <YStack w="100%" gap="$3">
          <Text f={1} col="$color11">
            BADGES
          </Text>

          <XStack>
            {/* TODO:  */}
            <Avatar circular size="$6">
              <Avatar.Fallback bc="grey" />
            </Avatar>
          </XStack>
        </YStack>
      ) : null}
    </YStack>
  );
};

const params = z.object({
  id: z.coerce.number(),
});

export default function ProfileScreen() {
  const { width } = useWindowDimensions();

  const { id: userId } = params.parse(useLocalSearchParams<{ id: string }>());

  const router = useRouter();

  const userprofileQuery = useUserprofileQuery(userId);
  const hiveListInfiniteQuery = useHiveListInfiniteQuery(); // TODO

  const showHive = true;

  const flattenedHiveList = useMemo(
    () => hiveListInfiniteQuery.data?.pages.flatMap(({ data }) => data) ?? [],
    [hiveListInfiniteQuery.data],
  );

  return (
    <YStack
      f={1}
      py="$4"
      bc="$color1"
      jc="flex-start"
      ai="center"
      ov="scroll"
      gap="$3"
      $sm={{ px: "$4" }}
    >
      <View f={1} w={width - 16} $gtSm={{ maw: 290 }}>
        {showHive ? (
          <VerticalList
            data={flattenedHiveList}
            numColumns={3}
            ItemSeparatorComponent={() => <View h="$0.75" />}
            ListHeaderComponent={() => (
              <YStack w="100%" pb="$3" gap="$3">
                <ProfileScreenNoHive userId={userId} />
                <YStack w="100%" gap="$3" $gtSm={{ maw: "$20" }}>
                  <XStack f={1}>
                    <QueryPlaceholder
                      query={userprofileQuery}
                      spinnerSize="small"
                      renderData={(data) => (
                        <Text col="$color11">
                          {data?.firstname?.toUpperCase()}
                        </Text>
                      )}
                    />
                    <Text col="$color11">'S HIVE</Text>
                  </XStack>
                </YStack>
              </YStack>
            )}
            estimatedItemSize={Math.min(width - 32, 290) / 3 + 16}
            onEndReached={hiveListInfiniteQuery.fetchNextPage}
            renderItem={({ item }) => (
              <View f={1} px="$1.5">
                <HiveBtn
                  hive={item}
                  onPress={() =>
                    router.replace({
                      pathname: "/(tabs)/home/hive/[id]/",
                      params: { id: item.group_id },
                    })
                  }
                />
              </View>
            )}
          />
        ) : (
          <ProfileScreenNoHive userId={userId} />
        )}
      </View>
    </YStack>
  );
}
