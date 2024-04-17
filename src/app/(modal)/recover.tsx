import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useCallback } from "react";
import { BackHandler } from "react-native";
import { Text, YStack } from "tamagui";

import { LogoIcon } from "@/assets";
import PageContainer from "@/src/components/PageContainer";
import PrimaryBtn from "@/src/components/PrimaryBtn";
import SecondaryBtn from "@/src/components/SecondaryBtn";
import SecondaryInput from "@/src/components/SecondaryInput";

export default function RecoverScreen() {
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
    confirmationCode: string;
    password: string;
  };

  const recoverMutation = useMutation<undefined, AxiosError, FormFields>({
    mutationFn: async ({ email, password }: FormFields) => {
      const user = (
        await axios.get("/auth_v1/find/email", {
          params: { email },
          baseURL: process.env.EXPO_PUBLIC_AUTH_API,
        })
      ).data;
      await axios.put(
        "/auth_v1/update-password",
        { uid: user.rawId, password },
        {
          baseURL: process.env.EXPO_PUBLIC_AUTH_API,
          headers: { "content-type": "application/x-www-form-urlencoded" },
        },
      );
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      confirmationCode: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await recoverMutation.mutateAsync(value);
      } catch {}
    },
  });

  return (
    <PageContainer>
      <YStack f={1} w="100%" jc="center" ai="center" gap="$3">
        <LogoIcon />
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
          <PrimaryBtn size="$4" w="100%">
            GET CONFIRMATION CODE
          </PrimaryBtn>
          <form.Field
            name="confirmationCode"
            children={(field) => (
              <SecondaryInput
                w="100%"
                placeholder="Confirmation code"
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
                placeholder="Enter your new password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
              />
            )}
          />
          <Text h="$4" w="100%" col="#ff0000" fos="$2" fow="bold">
            {""}
          </Text>
          <PrimaryBtn size="$4" w="100%" onPress={form.handleSubmit}>
            RESET PASSWORD
          </PrimaryBtn>
          <SecondaryBtn
            size="$4"
            w="100%"
            onPress={() => {
              router.replace("/login");
            }}
          >
            BACK TO LOGIN
          </SecondaryBtn>
        </form.Provider>
      </YStack>
    </PageContainer>
  );
}
