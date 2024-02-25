// import { ChevronRight } from "@tamagui/lucide-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Link, useLocalSearchParams } from "expo-router";
import React from "react";
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
import z from "zod";

import DangerBtn from "@/src/components/DangerBtn";
import HiveBtn from "@/src/components/HiveBtn";
import PrimaryBtn from "@/src/components/PrimaryBtn";
import VerticalList from "@/src/components/VerticalList";

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
          <Link href={`/home/profile/${userId}/report`} asChild>
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
  const userNameQuery = useQuery<
    AxiosResponse,
    AxiosError<{ message: string }>
  >({
    queryKey: ["userprofile", userId],
    queryFn: async () => {
      return await axios.get("/user_v1/userprofile", {
        baseURL: process.env.EXPO_PUBLIC_USER_API,
        params: { user_id: userId },
      });
    },
  });

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
          <Text h="$2.5" fontSize="$7" fontWeight="bold" color="$color11">
            {userNameQuery.data?.data?.username ?? "Tony Stark"}
          </Text>

          <Text fontSize="$4" fontWeight="normal" color="$color11">
            @tonystark
          </Text>
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
            <Text color="$color11" fontWeight="normal">
              87
            </Text>
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

  const showHive = true;

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
            data={[...Array(999)].map((_, i) => i)}
            numColumns={3}
            ItemSeparatorComponent={() => <View h="$0.75" />}
            ListHeaderComponent={() => (
              <YStack w="100%" paddingBottom="$3" gap="$3">
                <ProfileScreenNoHive userId={userId} />
                <YStack w="100%" gap="$3" $gtSm={{ maxWidth: "$20" }}>
                  <Text flex={1} color="$color11">
                    TONY'S HIVE
                  </Text>
                </YStack>
              </YStack>
            )}
            estimatedItemSize={
              Math.min(Dimensions.get("window").width - 32, 290) / 3 + 16
            }
            renderItem={({ item }) => (
              <View flex={1} paddingHorizontal="$1.5">
                <HiveBtn hiveId={item} />
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
