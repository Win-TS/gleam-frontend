import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import {
  Text,
  Input,
  YStack,
  Button,
  Avatar,
  useTheme,
  ZStack,
  View,
  XStack,
} from "tamagui";

import PrimaryBtn from "@/src/components/PrimaryBtn";
import { Pressable } from "react-native";

export default function ProfilePictureScreen() {
  const theme = useTheme();

  const form = useForm({
    defaultValues: {
      userImage: "",
      username: "",
    },
    onSubmit: async ({ value }) => {
      try {
        // await signupMutation.mutateAsync(value);
      } catch {}
    },
  });

  return (
    <YStack
      flex={1}
      paddingVertical="$4"
      backgroundColor="$color1"
      justifyContent="center"
      alignItems="center"
      gap="$3"
      $sm={{ paddingHorizontal: "$4" }}
    >
      <YStack
        w="100%"
        justifyContent="center"
        alignItems="center"
        $gtSm={{ maxWidth: "$20" }}
      >
        <Text fontSize="$6" fontWeight="bold" textAlign="center">
          SET YOUR PROFILE PIC
        </Text>
        <Text fontSize="$6" fontWeight="bold" textAlign="center">
          AND USERNAME
        </Text>
      </YStack>
      <form.Provider>
        <form.Field
          name="userImage"
          children={(field) => (
            <ZStack w="$16" h="$16">
              <Avatar circular size="$16" borderColor="$gleam12" bw="$1">
                <Avatar.Image
                  src={field.state.value === "" ? undefined : field.state.value}
                />
                <Avatar.Fallback bc="$color5" />
              </Avatar>
              <View w="$16" h="$16" justifyContent="center" alignItems="center">
                <XStack gap="$3">
                  <Pressable
                    onPress={async () => {
                      const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        aspect: [1, 1],
                        quality: 1,
                      });

                      if (!result.canceled) {
                        field.handleChange(result.assets[0].uri);
                      }
                    }}
                  >
                    <ZStack
                      w="$8"
                      h="$8"
                      borderColor="$gleam12"
                      borderRadius="$12"
                      bw="$1"
                    >
                      <View
                        w="100%"
                        h="100%"
                        borderRadius="$12"
                        backgroundColor="$color1"
                        opacity={0.3}
                      />
                      <View
                        w="100%"
                        h="100%"
                        borderRadius="$12"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <FontAwesome
                          size={36}
                          color={theme.gleam12.val}
                          name="photo"
                        />
                      </View>
                    </ZStack>
                  </Pressable>
                  <Pressable
                    onPress={async () => {
                      const result = await ImagePicker.launchCameraAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        aspect: [1, 1],
                        quality: 1,
                      });

                      if (!result.canceled) {
                        field.handleChange(result.assets[0].uri);
                      }
                    }}
                  >
                    <ZStack
                      w="$8"
                      h="$8"
                      borderColor="$gleam12"
                      borderRadius="$12"
                      bw="$1"
                    >
                      <View
                        w="100%"
                        h="100%"
                        borderRadius="$12"
                        backgroundColor="$color1"
                        opacity={0.3}
                      />
                      <View
                        w="100%"
                        h="100%"
                        borderRadius="$12"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <FontAwesome
                          size={36}
                          color={theme.gleam12.val}
                          name="camera"
                        />
                      </View>
                    </ZStack>
                  </Pressable>
                </XStack>
              </View>
            </ZStack>
          )}
        />
        <form.Field
          name="username"
          children={(field) => (
            <Input
              size="$3"
              w="100%"
              borderWidth="$1"
              borderRadius="$6"
              placeholder="ENTER YOUR USERNAME"
              $gtSm={{ maxWidth: "$20" }}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChangeText={field.handleChange}
            />
          )}
        />
        <PrimaryBtn
          size="$4"
          w="100%"
          $gtSm={{ maxWidth: "$20" }}
          onPress={form.handleSubmit}
        >
          Next
        </PrimaryBtn>
      </form.Provider>
    </YStack>
  );
}
