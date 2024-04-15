// import { ChevronRight } from "@tamagui/lucide-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useForm } from "@tanstack/react-form";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable } from "react-native";
import {
  Text,
  View,
  Separator,
  Avatar,
  XStack,
  YStack,
  Input,
  useTheme,
  useWindowDimensions,
} from "tamagui";

import HeaderContainer from "@/src/components/HeaderContainer";
import ImagePicker from "@/src/components/ImagePicker";
import PageContainer from "@/src/components/PageContainer";
import PrimaryBtn from "@/src/components/PrimaryBtn";
import ProfileHeader from "@/src/components/ProfileHeader";
import QueryPlaceholder from "@/src/components/QueryPlaceholder";
import SwitchWithLabel from "@/src/components/SwitchWithLabel";
import { useUserprofileMutation, useUserprofileQuery } from "@/src/hooks/user";
import { Userprofile } from "@/src/schemas/userprofile";
import { useUserId } from "@/src/stores/user";

const ProfileFormHeader = ({
  userprofile,
  setIsEditProfile,
}: {
  userprofile: Userprofile;
  setIsEditProfile: (edit: boolean) => void;
}) => {
  const userprofileMutation = useUserprofileMutation();

  const form = useForm({
    defaultValues: {
      photo: undefined as string | undefined,
      firstname: userprofile.firstname,
      lastname: userprofile.lastname,
    },
    onSubmit: async ({ value }) => {
      try {
        await userprofileMutation.mutateAsync(value);
      } catch {}
      setIsEditProfile(false);
    },
  });

  return (
    <YStack w="100%" jc="center" ai="center" gap="$3">
      <form.Provider>
        <form.Field
          name="photo"
          children={(field) => (
            <ImagePicker
              size="$12"
              image={field.state.value ?? userprofile.photo_url}
              setImage={field.handleChange}
            />
          )}
        />
        <YStack w="100%" jc="center" ai="center" gap="$1">
          <XStack w="100%" jc="center" ai="center" gap="$2">
            <form.Field
              name="firstname"
              children={(field) => (
                <Input
                  f={1}
                  h="$2.5"
                  bc="$gleam1"
                  col="$color11"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                />
              )}
            />
            <form.Field
              name="lastname"
              children={(field) => (
                <Input
                  f={1}
                  h="$2.5"
                  bc="$gleam1"
                  col="$color11"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                />
              )}
            />
          </XStack>
        </YStack>
        <Text fos="$4" fow="normal" col="$color11">
          {userprofile.username}
        </Text>
        <PrimaryBtn size="$2.5" w="$12" onPress={form.handleSubmit}>
          DONE
        </PrimaryBtn>
      </form.Provider>
    </YStack>
  );
};

export default function ProfileScreen() {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const userId = useUserId();

  const [isEditProfile, setIsEditProfile] = useState<boolean>(false);

  const userprofileQuery = useUserprofileQuery(userId);

  return (
    <PageContainer justifyContent="flex-start">
      <HeaderContainer>
        <QueryPlaceholder
          query={userprofileQuery}
          spinnerSize="large"
          renderData={(data) =>
            isEditProfile ? (
              <ProfileFormHeader
                userprofile={data}
                setIsEditProfile={setIsEditProfile}
              />
            ) : (
              <>
                <ProfileHeader userprofile={data} />
                <PrimaryBtn
                  size="$2.5"
                  w="$12"
                  onPress={() => {
                    setIsEditProfile(true);
                  }}
                >
                  EDIT PROFILE
                </PrimaryBtn>
              </>
            )
          }
        />
        {!isEditProfile && (
          <XStack gap="$3">
            <Pressable onPress={() => router.push("/(tabs)/profile/friend")}>
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
            </Pressable>
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
        )}
      </HeaderContainer>
      <XStack
        w="100%"
        br="$8"
        bc="$gleam12"
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

      <YStack w="100%" gap="$3">
        <XStack>
          <Text f={1} col="$color11">
            BADGES
          </Text>
          {isEditProfile && <SwitchWithLabel label="show in profile" />}
        </XStack>

        <XStack>
          {/* TODO:  */}
          <Avatar circular size="$6">
            <Avatar.Fallback bc="grey" />
          </Avatar>
        </XStack>
      </YStack>

      {isEditProfile ? (
        <XStack w="100%" gap="$3">
          <Text f={1} col="$color11">
            MY HIVE
          </Text>
          <SwitchWithLabel label="show in profile" />
        </XStack>
      ) : (
        <>
          <Separator w={width} $gtSm={{ maw: "$20" }} boc="$gleam12" />
          <XStack w="100%" ai="center" gap="$3">
            <Text f={1} col="$color11">
              MY HIVE
            </Text>
            <View p="$2">
              <FontAwesome
                size={14}
                color={theme.gleam12.val}
                name="chevron-right"
              />
            </View>
          </XStack>
          <Separator w={width} $gtSm={{ maw: "$20" }} boc="$gleam12" />
        </>
      )}
    </PageContainer>
  );
}
