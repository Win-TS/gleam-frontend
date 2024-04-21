import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Pressable } from "react-native";
import {
  Text,
  View,
  XStack,
  YStack,
  useTheme,
  Popover,
  Button,
  useWindowDimensions,
} from "tamagui";
import { z } from "zod";

import DangerBtn from "@/src/components/DangerBtn";
import DullBtn from "@/src/components/DullBtn";
import GleamContainer from "@/src/components/GleamContainer";
import HiveBtn from "@/src/components/HiveBtn";
import PrimaryBtn from "@/src/components/PrimaryBtn";
import ProfileHeader from "@/src/components/ProfileHeader";
import QueryPlaceholder from "@/src/components/QueryPlaceholder";
import SecondaryBtn from "@/src/components/SecondaryBtn";
import VerticalList from "@/src/components/VerticalList";
import { useUserHiveListQuery } from "@/src/hooks/hive";
import {
  useAddFriendMutation,
  useFriendStatusQuery,
  useUserprofileQuery,
} from "@/src/hooks/user";

const ProfileOptionsPopover = ({ userId }: { userId: number }) => {
  const theme = useTheme();
  const router = useRouter();

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
          <DangerBtn
            size="$2.5"
            w="100%"
            borderRadius="$4"
            onPress={() =>
              router.push({
                pathname: "/(tabs)/home/profile/[id]/report",
                params: {
                  id: userId,
                },
              })
            }
          >
            Report
          </DangerBtn>
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

const FriendStatusButton = ({ userId }: { userId: number }) => {
  const friendQuery = useFriendStatusQuery(userId);
  const addFriendMutation = useAddFriendMutation(userId);

  return (
    <QueryPlaceholder
      query={friendQuery}
      renderData={(data) => {
        switch (data[0]?.status.String) {
          case "Accepted":
            return (
              <SecondaryBtn size="$2.5" w="$12">
                FRIENDED
              </SecondaryBtn>
            );
          case "Pending":
            return (
              <DullBtn size="$2.5" w="$12">
                REQUESTED
              </DullBtn>
            );
          default:
            return (
              <PrimaryBtn
                size="$2.5"
                w="$12"
                onPress={async () => {
                  try {
                    await addFriendMutation.mutateAsync();
                  } catch {}
                }}
              >
                ADD FRIEND
              </PrimaryBtn>
            );
        }
      }}
    />
  );
};

const ProfileScreenNoHive = ({ userId }: { userId: number }) => {
  const userprofileQuery = useUserprofileQuery(userId);

  return (
    <YStack w="100%" gap="$3" $gtSm={{ maw: "$20" }}>
      <GleamContainer>
        <QueryPlaceholder
          query={userprofileQuery}
          spinnerSize="large"
          renderData={(data) => <ProfileHeader userprofile={data} />}
        />
        <XStack jc="center" ai="center" gap="$3">
          <FriendStatusButton userId={userId} />
        </XStack>
        <XStack gap="$3">
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/(tabs)/home/profile/[id]/friend",
                params: {
                  id: userId,
                },
              })
            }
          >
            <YStack w="$6" jc="center" ai="center">
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
          </Pressable>
        </XStack>
        <ProfileOptionsPopover userId={userId} />
      </GleamContainer>
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
        <QueryPlaceholder
          query={userprofileQuery}
          spinnerSize="large"
          renderData={(data) => (
            <Text col="$color1" fos="$10" fow="bold">
              {data.max_streak}
            </Text>
          )}
        />
        <Text col="$color1" fos="$4" fow="bold">
          DAYS
        </Text>
      </XStack>
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
  const userHiveListQuery = useUserHiveListQuery(userId);

  const showHive = true;

  const flattenedHiveList = useMemo(
    () => [
      ...(userHiveListQuery.data?.social_groups ?? []),
      ...(userHiveListQuery.data?.personal_groups ?? []),
    ],
    [userHiveListQuery.data],
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
            renderItem={({ item }) => (
              <View f={1} px="$1.5">
                <HiveBtn
                  hive={item}
                  onPress={() =>
                    router.push({
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
