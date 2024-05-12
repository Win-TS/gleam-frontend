import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable } from "react-native";
import {
  Text,
  Separator,
  XStack,
  YStack,
  useWindowDimensions,
  Spinner,
} from "tamagui";
import { z } from "zod";

import { Icon } from "@/assets";
import GleamContainer from "@/src/components/GleamContainer";
import ImagePicker from "@/src/components/ImagePicker";
import PageContainer from "@/src/components/PageContainer";
import PressableSection from "@/src/components/PressableSection";
import PrimaryBtn from "@/src/components/PrimaryBtn";
import ProfileHeader from "@/src/components/ProfileHeader";
import QueryPlaceholder from "@/src/components/QueryPlaceholder";
import SecondaryInput from "@/src/components/SecondaryInput";
import Section from "@/src/components/Section";
import SwitchWithLabel from "@/src/components/SwitchWithLabel";
import { TextStyle } from "@/src/constants/TextStyle";
import {
  useEditUserNameMutation,
  useEditUserPhotoMutation,
  useUploadUserPhotoMutation,
  useUserprofileQuery,
} from "@/src/hooks/user";
import { Userprofile } from "@/src/schemas/userprofile";
import { useUserId } from "@/src/stores/user";

const ProfileFormHeader = ({
  userprofile,
  setIsEditProfile,
}: {
  userprofile: Userprofile;
  setIsEditProfile: (edit: boolean) => void;
}) => {
  const editUserNameMutation = useEditUserNameMutation();
  const uploadUserPhotoMutation = useUploadUserPhotoMutation();
  const editUserPhotoMutation = useEditUserPhotoMutation();

  const formValidator = {
    firstname: z.string().min(1),
    lastname: z.string().min(1),
    photo: z.optional(z.string()),
  };

  const form = useForm({
    defaultValues: {
      firstname: userprofile.firstname,
      lastname: userprofile.lastname,
      photo: undefined as string | undefined,
    },
    validatorAdapter: zodValidator,
    onSubmit: async ({ value }) => {
      try {
        const { firstname, lastname, photo } = await z
          .object(formValidator)
          .parseAsync(value);
        await Promise.all(
          [
            editUserNameMutation.mutateAsync({ firstname, lastname }),
            photo
              ? (async () => {
                  const { url: photoUrl } =
                    await uploadUserPhotoMutation.mutateAsync({ photo });
                  await editUserPhotoMutation.mutateAsync({ photoUrl });
                })()
              : undefined,
          ].filter(Boolean),
        );
        setIsEditProfile(false);
      } catch {}
    },
  });

  return (
    <YStack w="100%" jc="center" ai="center" gap="$3">
      <form.Field
        name="photo"
        validators={{ onChange: formValidator.photo }}
        children={(field) => (
          <ImagePicker
            size="$12"
            image={field.state.value ?? userprofile.photo_url}
            setImage={field.handleChange}
            error={
              form.state.submissionAttempts > 0 &&
              field.state.meta.errors.length > 0
            }
          />
        )}
      />
      <YStack w="100%" jc="center" ai="center" gap="$1">
        <XStack w="100%" jc="center" ai="center" gap="$2">
          <form.Field
            name="firstname"
            validators={{ onChange: formValidator.firstname }}
            children={(field) => (
              <SecondaryInput
                f={1}
                h="$2.5"
                col="$color11"
                boc={
                  form.state.submissionAttempts > 0 &&
                  field.state.meta.errors.length > 0
                    ? "$red10"
                    : undefined
                }
                br="$4"
                value={field.state.value}
                onChangeText={field.handleChange}
              />
            )}
          />
          <form.Field
            name="lastname"
            validators={{ onChange: formValidator.lastname }}
            children={(field) => (
              <SecondaryInput
                f={1}
                h="$2.5"
                col="$color11"
                boc={
                  form.state.submissionAttempts > 0 &&
                  field.state.meta.errors.length > 0
                    ? "$red10"
                    : undefined
                }
                br="$4"
                value={field.state.value}
                onChangeText={field.handleChange}
              />
            )}
          />
        </XStack>
      </YStack>
      <Text col="$color11" {...TextStyle.description}>
        {userprofile.username}
      </Text>
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) =>
          isSubmitting ? (
            <Spinner size="large" color="$color11" />
          ) : (
            <PrimaryBtn
              size="$2.5"
              w="$12"
              opacity={canSubmit ? 1 : 0.5}
              onPress={form.handleSubmit}
            >
              <Text col="$color1" {...TextStyle.button.small}>
                DONE
              </Text>
            </PrimaryBtn>
          )
        }
      />
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
                  <Text col="$color1" {...TextStyle.button.small}>
                    EDIT PROFILE
                  </Text>
                </PrimaryBtn>
              </>
            )
          }
        />
        {!isEditProfile && (
          <XStack gap="$3">
            <Pressable onPress={() => router.push("/(tabs)/profile/friend")}>
              <YStack w="$8s" jc="center" ai="center">
                <Text col="$color11" {...TextStyle.button.large}>
                  FRIEND
                </Text>

                <QueryPlaceholder
                  query={userprofileQuery}
                  spinnerSize="small"
                  renderData={(data) => (
                    <Text col="$color11" {...TextStyle.button.large}>
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
        p="$2"
        br="$8"
        bc="$gleam12"
        boc="$gleam12"
        jc="center"
        ai="center"
        gap="$3"
      >
        <Text col="$color1" {...TextStyle.button.small}>
          HIGHEST STREAKS
        </Text>
        <QueryPlaceholder
          query={userprofileQuery}
          spinnerSize="large"
          renderData={(data) => (
            <Text col="$color1" {...TextStyle.button.extraLarge}>
              {data.max_streak}
            </Text>
          )}
        />
        <Text col="$color1" {...TextStyle.button.small}>
          DAYS
        </Text>
      </XStack>

      <Separator w={width} $gtSm={{ maw: "$20" }} boc="$gleam12" />
      {isEditProfile ? (
        <Section>
          <XStack w="100%" jc="space-between" ai="center" px="$3" py="$1">
            <Text f={1} col="$color11" {...TextStyle.button.large}>
              MY HIVE
            </Text>
            <SwitchWithLabel label="show in profile" />
          </XStack>
        </Section>
      ) : (
        <PressableSection onPress={() => router.push("/(tabs)/profile/hive")}>
          <XStack w="100%" jc="space-between" ai="center" px="$3" py="$1">
            <Text f={1} col="$color11" {...TextStyle.button.large}>
              MY HIVE
            </Text>
            <Icon name="chevron_right" />
          </XStack>
        </PressableSection>
      )}
    </PageContainer>
  );
}
