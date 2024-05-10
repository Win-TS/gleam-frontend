import { FontAwesome } from "@expo/vector-icons";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable } from "react-native";
import { Image, Spinner, Text, View, XStack, YStack, useTheme } from "tamagui";
import { z } from "zod";

import ImagePickerSheet from "@/src/components/ImagePickerSheet";
import PageContainer from "@/src/components/PageContainer";
import PrimaryBtn from "@/src/components/PrimaryBtn";
import ProfileHivePickerSheet from "@/src/components/ProfileHivePickerSheet";
import SecondaryBtn from "@/src/components/SecondaryBtn";
import { TextStyle } from "@/src/constants/TextStyle";
import { useCreatePostMutation } from "@/src/hooks/post";
import { Hive, hive_ } from "@/src/schemas/hive";
import { useUserId } from "@/src/stores/user";

export default function AddStreakScreen() {
  const theme = useTheme();
  const router = useRouter();

  const userId = useUserId();

  const createPostMutation = useCreatePostMutation();

  const formValidator = {
    hive: hive_,
    image: z.string().min(1),
  };

  const form = useForm({
    defaultValues: {
      hive: undefined as Hive | undefined,
      image: "",
    },
    validatorAdapter: zodValidator,
    onSubmit: async ({ value }) => {
      try {
        const {
          hive: { group_id },
          image,
        } = await z.object(formValidator).parseAsync(value);
        await createPostMutation.mutateAsync({
          hiveId: group_id,
          photo: image,
        });
        router.replace("/home/");
      } catch {}
    },
  });

  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [profileHivePickerOpen, setProfileHivePickerOpen] = useState(false);

  useEffect(() => setImagePickerOpen(true), []);

  return (
    <PageContainer>
      <YStack w="100%" f={1} jc="center" ai="center" gap="$6">
        <form.Field
          name="image"
          validators={{ onChange: formValidator.image }}
          children={(field) => (
            <>
              <View
                w="100%"
                p="$2"
                boc={
                  form.state.submissionAttempts > 0 &&
                  field.state.meta.errors.length > 0
                    ? "$red10"
                    : "$gleam12"
                }
                bw="$1"
                br="$4"
              >
                <Pressable onPress={() => setImagePickerOpen(!imagePickerOpen)}>
                  {field.state.value ? (
                    <Image w="100%" aspectRatio={1} src={field.state.value} />
                  ) : (
                    <View w="100%" aspectRatio={1} bc="$color5" />
                  )}
                </Pressable>
              </View>
              <ImagePickerSheet
                open={imagePickerOpen}
                setOpen={setImagePickerOpen}
                setImage={field.handleChange}
              />
            </>
          )}
        />
        <YStack w="100%" jc="center" ai="center" gap="$3">
          <Text {...TextStyle.button.small} ta="center">
            WHAT IS YOUR ACHIEVEMENT TODAY??
          </Text>
          <form.Field
            name="hive"
            validators={{ onChange: formValidator.hive }}
            children={(field) => (
              <>
                <SecondaryBtn
                  w="$18"
                  h="$3"
                  boc={
                    form.state.submissionAttempts > 0 &&
                    field.state.meta.errors.length > 0
                      ? "$red10"
                      : undefined
                  }
                  onPress={() =>
                    setProfileHivePickerOpen(!profileHivePickerOpen)
                  }
                >
                  <Text col="$gleam12" {...TextStyle.button.small}>
                    {field.state.value?.group_name ?? "CHOOSE YOUR HIVE"}
                  </Text>
                </SecondaryBtn>
                <ProfileHivePickerSheet
                  open={profileHivePickerOpen}
                  setOpen={setProfileHivePickerOpen}
                  userId={userId}
                  onPress={field.handleChange}
                />
              </>
            )}
          />
        </YStack>
      </YStack>
      <XStack w="100%" jc="space-between" ai="center">
        <SecondaryBtn
          h="$5"
          w="$5"
          p="$0"
          onPress={() => setImagePickerOpen(!imagePickerOpen)}
        >
          <FontAwesome name="repeat" size={32} color={theme.gleam12.val} />
        </SecondaryBtn>
        <form.Subscribe
          selector={(state) => [
            state.isDirty,
            state.canSubmit,
            state.isSubmitting,
          ]}
          children={([isDirty, canSubmit, isSubmitting]) =>
            isSubmitting ? (
              <Spinner size="large" color="$color11" />
            ) : (
              <PrimaryBtn
                h="$5"
                w="$5"
                p="$0"
                opacity={isDirty && canSubmit ? 1 : 0.5}
                onPress={form.handleSubmit}
              >
                <FontAwesome name="check" size={32} color={theme.color1.val} />
              </PrimaryBtn>
            )
          }
        />
      </XStack>
    </PageContainer>
  );
}
