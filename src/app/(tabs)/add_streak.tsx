import { FontAwesome } from "@expo/vector-icons";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Spinner, Text, View, XStack, YStack, useTheme } from "tamagui";
import { z } from "zod";

import ImagePickerSheet from "@/src/components/ImagePickerSheet";
import PageContainer from "@/src/components/PageContainer";
import PrimaryBtn from "@/src/components/PrimaryBtn";
import ProfileHivePickerSheet from "@/src/components/ProfileHivePickerSheet";
import SecondaryBtn from "@/src/components/SecondaryBtn";
import { useCreatePostMutation } from "@/src/hooks/post";
import { Hive, hive_ } from "@/src/schemas/hive";
import { useUserStore } from "@/src/stores/user";

export default function TabTwoScreen() {
  const theme = useTheme();
  const router = useRouter();

  const user = useUserStore();

  const createPostMutation = useCreatePostMutation();

  const form = useForm({
    defaultValues: {
      hive: undefined as Hive | undefined,
      image: "",
    },
    defaultState: { canSubmit: false },
    validators: {
      onChange: z.object({
        hive: hive_,
        image: z.string().url(),
      }),
    },
    validatorAdapter: zodValidator,
    onSubmit: async ({ value: { hive, image } }) => {
      if (hive) {
        try {
          await createPostMutation.mutateAsync({
            hiveId: hive?.group_id,
            photo: image,
          });
          router.replace("/home/");
        } catch {}
      }
    },
  });

  const [imagePickerOpen, setImagePickerOpen] = useState(true);
  const [profileHivePickerOpen, setProfileHivePickerOpen] = useState(false);

  return (
    <PageContainer>
      <form.Provider>
        <YStack flex={1} jc="center" ai="center" gap="$3">
          <View w="100%" p="$2" boc="$gleam12" bw="$1" br="$4">
            <form.Field
              name="image"
              children={(field) =>
                URL.canParse(field.getValue()) ? (
                  <Image aspectRatio={1} source={{ uri: field.getValue() }} />
                ) : (
                  <View aspectRatio={1} bc="$color5" />
                )
              }
            />
          </View>
          <Text fow="bold">WHAT IS YOUR ACHIEVEMENT TODAY?</Text>
          <form.Field
            name="hive"
            children={(field) => (
              <SecondaryBtn
                w="100%"
                onPress={() => setProfileHivePickerOpen(true)}
              >
                {field.getValue()?.group_name ?? "CHOOSE YOUR HIVE"}
              </SecondaryBtn>
            )}
          />
        </YStack>
        <XStack w="100%" jc="space-between" ai="center">
          <SecondaryBtn h="$5" w="$5" onPress={() => setImagePickerOpen(true)}>
            <FontAwesome name="repeat" size={32} color={theme.gleam12.val} />
          </SecondaryBtn>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) =>
              isSubmitting ? (
                <Spinner size="large" color="$color11" />
              ) : (
                <PrimaryBtn
                  h="$5"
                  w="$5"
                  disabled={!canSubmit}
                  opacity={canSubmit ? 1 : 0.5}
                  onPress={form.handleSubmit}
                >
                  <FontAwesome
                    name="check"
                    size={32}
                    color={theme.color1.val}
                  />
                </PrimaryBtn>
              )
            }
          />
        </XStack>
        <form.Field
          name="image"
          children={(field) => (
            <ImagePickerSheet
              open={imagePickerOpen}
              setOpen={setImagePickerOpen}
              setImage={field.handleChange}
            />
          )}
        />
        <form.Field
          name="hive"
          children={(field) => (
            <ProfileHivePickerSheet
              open={profileHivePickerOpen}
              setOpen={setProfileHivePickerOpen}
              userId={user.user?.id ?? 1}
              onPress={field.handleChange}
            />
          )}
        />
      </form.Provider>
    </PageContainer>
  );
}
