import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Image as ExpoImage } from "expo-image";
import { useRouter } from "expo-router";
import { FirebaseError } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useCallback } from "react";
import { BackHandler } from "react-native";
import { Text, Checkbox, YStack, XStack } from "tamagui";

import { logo } from "@/assets";
import PageContainer from "@/src/components/PageContainer";
import PrimaryBtn from "@/src/components/PrimaryBtn";
import SecondaryBtn from "@/src/components/SecondaryBtn";
import SecondaryInput from "@/src/components/SecondaryInput";

export default function LoginScreen() {
  const router = useRouter();

  const preventBackCallback = useCallback(() => true, []);

  const removeCallback = useCallback(
    () =>
      BackHandler.removeEventListener("hardwareBackPress", preventBackCallback),
    [],
  );

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", preventBackCallback);

    return removeCallback;
  }, []);

  type FormFields = {
    email: string;
    password: string;
  };

  const loginMutation = useMutation<undefined, FirebaseError, FormFields>({
    mutationFn: async ({ email, password }: FormFields) => {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await loginMutation.mutateAsync(value);
      } catch {}
    },
  });

  return (
    <PageContainer>
      <YStack f={1} w="100%" jc="center" ai="center" gap="$3">
        <ExpoImage source={logo} style={{ width: 144, aspectRatio: 1 }} />
        <form.Provider>
          <form.Field
            name="email"
            children={(field) => (
              <SecondaryInput
                w="100%"
                placeholder="Email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
              />
            )}
          />
          <form.Field
            name="password"
            children={(field) => (
              <SecondaryInput
                w="100%"
                password
                placeholder="Password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
              />
            )}
          />
          <XStack h="$1" w="100%" als="flex-start" gap="$2">
            <Checkbox size="$3">
              <Checkbox.Indicator>
                <FontAwesome name="check" />
              </Checkbox.Indicator>
            </Checkbox>
            <Text col="#b8ab8c" fos="$3" fow="bold">
              remember me
            </Text>
          </XStack>
          <Text h="$4" w="100%" col="#ff0000" fos="$2" fow="bold">
            {loginMutation.error?.message ?? ""}
          </Text>
          <PrimaryBtn size="$4" w="100%" onPress={form.handleSubmit}>
            LOG IN
          </PrimaryBtn>
          <SecondaryBtn
            size="$4"
            w="100%"
            onPress={() => {
              removeCallback();
              router.replace("/signup/form");
            }}
          >
            SIGN UP
          </SecondaryBtn>
        </form.Provider>
      </YStack>
      <Text h="$4" col="#b8ab8c" fos="$2" fow="bold">
        Forgot password?
      </Text>
    </PageContainer>
  );
}
