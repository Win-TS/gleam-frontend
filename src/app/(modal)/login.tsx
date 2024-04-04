import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Link } from "expo-router";
import { FirebaseError } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { Text, Checkbox, YStack, XStack } from "tamagui";

import PageContainer from "@/src/components/PageContainer";
import PrimaryBtn from "@/src/components/PrimaryBtn";
import SecondaryBtn from "@/src/components/SecondaryBtn";
import SecondaryInput from "@/src/components/SecondaryInput";

export default function LoginScreen() {
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
      <YStack
        flex={1}
        w="100%"
        justifyContent="center"
        alignItems="center"
        gap="$3"
      >
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
          <XStack h="$1" w="100%" alignSelf="flex-start" gap="$2">
            <Checkbox size="$3">
              <Checkbox.Indicator>
                <FontAwesome name="check" />
              </Checkbox.Indicator>
            </Checkbox>
            <Text color="#b8ab8c" fontSize="$3" fontWeight="bold">
              remember me
            </Text>
          </XStack>
          <Text h="$4" w="100%" color="#ff0000" fontSize="$2" fontWeight="bold">
            {loginMutation.error?.message ?? ""}
          </Text>
          <PrimaryBtn size="$4" w="100%" onPress={form.handleSubmit}>
            LOG IN
          </PrimaryBtn>
          <Link href="/signup/form" replace asChild>
            <SecondaryBtn size="$4" w="100%">
              SIGN UP
            </SecondaryBtn>
          </Link>
        </form.Provider>
      </YStack>
      <Text h="$4" color="#b8ab8c" fontSize="$2" fontWeight="bold">
        Forgot password?
      </Text>
    </PageContainer>
  );
}
