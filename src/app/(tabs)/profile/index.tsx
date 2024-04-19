import { useForm } from "@tanstack/react-form";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable } from "react-native";
import {
  Text,
  Separator,
  XStack,
  YStack,
  Input,
  useWindowDimensions,
} from "tamagui";

import { Icon } from "@/assets";
import GleamContainer from "@/src/components/GleamContainer";
import ImagePicker from "@/src/components/ImagePicker";
import PageContainer from "@/src/components/PageContainer";
import PressableSection from "@/src/components/PressableSection";
import PrimaryBtn from "@/src/components/PrimaryBtn";
import ProfileHeader from "@/src/components/ProfileHeader";
import QueryPlaceholder from "@/src/components/QueryPlaceholder";
import Section from "@/src/components/Section";
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
  const { width } = useWindowDimensions();

  const userId = useUserId();

  const [isEditProfile, setIsEditProfile] = useState<boolean>(false);

  const userprofileQuery = useUserprofileQuery(userId);

  return (
    <PageContainer justifyContent="flex-start">
      <GleamContainer>
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
        )}
      </GleamContainer>
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

      <Separator w={width} $gtSm={{ maw: "$20" }} boc="$gleam12" />
      {isEditProfile ? (
        <Section>
          <XStack w="100%" jc="space-between" ai="center" px="$3" py="$1">
            <Text f={1} col="$color11">
              MY HIVE
            </Text>
            <SwitchWithLabel label="show in profile" />
          </XStack>
        </Section>
      ) : (
        <PressableSection onPress={() => router.push("/(tabs)/profile/hive")}>
          <XStack w="100%" jc="space-between" ai="center" px="$3" py="$1">
            <Text f={1} col="$color11">
              MY HIVE
            </Text>
            <Icon name="chevron_right" />
          </XStack>
        </PressableSection>
      )}
    </PageContainer>
  );
}
