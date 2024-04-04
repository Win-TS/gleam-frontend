// import { ChevronRight } from "@tamagui/lucide-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useForm } from "@tanstack/react-form";
import React, { useState } from "react";
import { useWindowDimensions } from "react-native";
import {
  Text,
  View,
  Separator,
  Avatar,
  XStack,
  YStack,
  Input,
  useTheme,
} from "tamagui";

import ImagePicker from "@/src/components/ImagePicker";
import PageContainer from "@/src/components/PageContainer";
import PrimaryBtn from "@/src/components/PrimaryBtn";
import ProfileHeader from "@/src/components/ProfileHeader";
import QueryPlaceholder from "@/src/components/QueryPlaceholder";
import SwitchWithLabel from "@/src/components/SwitchWithLabel";
import { useUserprofileMutation, useUserprofileQuery } from "@/src/hooks/user";
import { Userprofile } from "@/src/schemas/userprofile";
import { useUserStore } from "@/src/stores/user";

const ProfileFormHeader = ({
  userprofile,
  setIsEditProfile,
}: {
  userprofile: Userprofile;
  setIsEditProfile: (edit: boolean) => void;
}) => {
  const userprofileMutation = useUserprofileMutation({
    onSettled: () => setIsEditProfile(false),
  });

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
    },
  });

  return (
    <YStack w="100%" justifyContent="center" alignItems="center" gap="$3">
      <form.Provider>
        <form.Field
          name="photo"
          children={(field) => (
            <ImagePicker
              image={field.state.value ?? userprofile.photo_url}
              setImage={field.handleChange}
            />
          )}
        />
        <YStack w="100%" justifyContent="center" alignItems="center" gap="$1">
          <XStack w="100%" justifyContent="center" alignItems="center" gap="$2">
            <form.Field
              name="firstname"
              children={(field) => (
                <Input
                  flex={1}
                  h="$2.5"
                  backgroundColor="$gleam1"
                  color="$color11"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                />
              )}
            />
            <form.Field
              name="lastname"
              children={(field) => (
                <Input
                  flex={1}
                  h="$2.5"
                  backgroundColor="$gleam1"
                  color="$color11"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                />
              )}
            />
          </XStack>
        </YStack>
        <Text fontSize="$4" fontWeight="normal" color="$color11">
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

  const userStore = useUserStore();

  const [isEditProfile, setIsEditProfile] = useState<boolean>(false);

  const userprofileQuery = useUserprofileQuery(userStore.user?.id ?? 1);

  return (
    <PageContainer>
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
        )}
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

      <YStack w="100%" gap="$3">
        <XStack>
          <Text flex={1} color="$color11">
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
          <Text flex={1} color="$color11">
            MY HIVE
          </Text>
          <SwitchWithLabel label="show in profile" />
        </XStack>
      ) : (
        <>
          <Separator w={width} $gtSm={{ maw: "$20" }} borderColor="$gleam12" />
          <XStack w="100%" alignItems="center" gap="$3">
            <Text flex={1} color="$color11">
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
          <Separator w={width} $gtSm={{ maw: "$20" }} borderColor="$gleam12" />
        </>
      )}
    </PageContainer>
  );
}
