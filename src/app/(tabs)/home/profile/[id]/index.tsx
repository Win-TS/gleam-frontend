// import { ChevronRight } from "@tamagui/lucide-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { Dimensions } from "react-native";
import {
  Text,
  View,
  Image,
  Separator,
  Avatar,
  XStack,
  YStack,
  useTheme,
  Popover,
  Button,
} from "tamagui";
import { z } from "zod";

import DangerBtn from "@/src/components/DangerBtn";
import HiveBtn from "@/src/components/HiveBtn";
import PrimaryBtn from "@/src/components/PrimaryBtn";
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
    <YStack w="100%" gap="$3" $gtSm={{ maxWidth: "$20" }}>
      <YStack
        p="$3"
        w="100%"
        backgroundColor="$gleam1"
        borderWidth="$1.5"
        borderRadius="$8"
        borderColor="$gleam12"
        shadowColor="$gleam12"
        shadowRadius="$2"
        justifyContent="center"
        alignItems="center"
        gap="$3"
      >
        <Image
          source={{
            uri: "https://placekitten.com/200/300",
            width: 102,
            height: 102,
          }}
          style={{ borderRadius: 50 }}
        />
        <YStack w="100%" justifyContent="center" alignItems="center">
          <QueryPlaceholder
            query={userprofileQuery}
            spinnerSize="large"
            renderData={(data) => (
              <>
                <Text h="$2.5" fontSize="$7" fontWeight="bold" color="$color11">
                  {[data.firstname, data.lastname].join(" ")}
                </Text>

                <Text fontSize="$4" fontWeight="normal" color="$color11">
                  {data.username}
                </Text>
              </>
            )}
          />
        </YStack>
        <XStack justifyContent="center" alignItems="center" gap="$3">
          <PrimaryBtn w="$10" size="$2.5">
            FOLLOW
          </PrimaryBtn>
          <PrimaryBtn w="$10" size="$2.5">
            MESSAGE
          </PrimaryBtn>
        </XStack>
        <XStack gap="$3">
          <YStack w="$5" justifyContent="center" alignItems="center">
            <Text color="$color11" fontWeight="bold">
              FRIEND
            </Text>
            <QueryPlaceholder
              query={userprofileQuery}
              spinnerSize="small"
              renderData={(data) => (
                <Text color="$color11" fontWeight="normal">
                  {data.friends_count}
                </Text>
              )}
            />
          </YStack>
          <Separator alignSelf="stretch" vertical borderColor="$gleam12" />
          <YStack w="$5" justifyContent="center" alignItems="center">
            <Text color="$color11" fontWeight="bold">
              LEVEL
            </Text>
            <Text color="$color11" fontWeight="normal">
              130
            </Text>
          </YStack>
        </XStack>
        <ProfileOptionsPopover userId={userId} />
      </YStack>
      <XStack
        w="100%"
        borderRadius="$8"
        backgroundColor="$gleam12"
        borderColor="$gleam12"
        justifyContent="center"
        alignItems="center"
        gap="$3"
      >
        <Text color="$color1" fontSize="$4" fontWeight="bold">
          HIGHEST STREAKS
        </Text>
        <Text color="$color1" fontSize="$10" fontWeight="bold">
          81
        </Text>
        <Text color="$color1" fontSize="$4" fontWeight="bold">
          DAYS
        </Text>
      </XStack>

      {showBadge ? (
        <YStack w="100%" gap="$3">
          <Text flex={1} color="$color11">
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
  const { id: userId } = params.parse(useLocalSearchParams<{ id: string }>());
  const userprofileQuery = useUserprofileQuery(userId);
  const hiveListInfiniteQuery = useHiveListInfiniteQuery(); // TODO

  const showHive = true;

  const flattenedHiveList = useMemo(
    () => hiveListInfiniteQuery.data?.pages.flatMap(({ data }) => data) ?? [],
    [hiveListInfiniteQuery.data],
  );

  return (
    <YStack
      flex={1}
      paddingVertical="$4"
      backgroundColor="$color1"
      justifyContent="flex-start"
      alignItems="center"
      overflow="scroll"
      gap="$3"
      $sm={{ paddingHorizontal: "$4" }}
    >
      <View
        flex={1}
        w={Math.min(Dimensions.get("window").width - 16)}
        $gtSm={{ maxWidth: 290 }}
      >
        {showHive ? (
          <VerticalList
            data={flattenedHiveList}
            numColumns={3}
            ItemSeparatorComponent={() => <View h="$0.75" />}
            ListHeaderComponent={() => (
              <YStack w="100%" paddingBottom="$3" gap="$3">
                <ProfileScreenNoHive userId={userId} />
                <YStack w="100%" gap="$3" $gtSm={{ maxWidth: "$20" }}>
                  <XStack flex={1}>
                    <QueryPlaceholder
                      query={userprofileQuery}
                      spinnerSize="small"
                      renderData={(data) => (
                        <Text color="$color11">
                          {data?.firstname?.toUpperCase()}
                        </Text>
                      )}
                    />
                    <Text color="$color11">'S HIVE</Text>
                  </XStack>
                </YStack>
              </YStack>
            )}
            estimatedItemSize={
              Math.min(Dimensions.get("window").width - 32, 290) / 3 + 16
            }
            onEndReached={hiveListInfiniteQuery.fetchNextPage}
            renderItem={({ item }) => (
              <View flex={1} paddingHorizontal="$1.5">
                <HiveBtn hive={item} />
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
