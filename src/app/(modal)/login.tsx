import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Link } from "expo-router";
import { FirebaseError } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import {
  Button,
  View,
  Text,
  Input,
  Checkbox,
  YStack,
  XStack,
  useTheme,
} from "tamagui";

import PrimaryBtn from "@/src/components/PrimaryBtn";
import SecondaryBtn from "@/src/components/SecondaryBtn";

export default function LoginScreen() {
  const theme = useTheme();

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
              <Input
                size="$3"
                w="100%"
                borderWidth="$1"
                borderRadius="$6"
                placeholder="Email"
                $gtSm={{ maxWidth: "$20" }}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
              />
            )}
          />
          <View position="relative" w="100%" $gtSm={{ maxWidth: "$20" }}>
            <form.Field
              name="password"
              children={(field) => (
                <Input
                  size="$3"
                  w="100%"
                  borderWidth="$1"
                  borderRadius="$6"
                  placeholder="Password"
                  secureTextEntry
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChangeText={field.handleChange}
                />
              )}
            />
            <View
              position="absolute"
              flex={1}
              right="$0"
              top="$0"
              h="$3"
              justifyContent="center"
              alignItems="center"
            >
              <Button size="$3" borderRadius="$6" chromeless>
                <FontAwesome
                  size={16}
                  color={theme.color9.val}
                  name="eye-slash"
                />
              </Button>
            </View>
          </View>
          <YStack h="$1" w="100%" $gtSm={{ maxWidth: "$20" }}>
            <XStack alignSelf="flex-start" flex={1} gap="$2">
              <Checkbox size="$3">
                <Checkbox.Indicator>
                  <FontAwesome name="check" />
                </Checkbox.Indicator>
              </Checkbox>
              <Text color="#b8ab8c" fontSize="$3" fontWeight="bold">
                remember me
              </Text>
            </XStack>
          </YStack>
          <YStack
            position="relative"
            h="$4"
            w="100%"
            $gtSm={{ maxWidth: "$20" }}
          >
            <Text color="#ff0000" fontSize="$2" fontWeight="bold">
              {loginMutation.error?.message ?? ""}
            </Text>
          </YStack>
          <PrimaryBtn
            size="$4"
            w="100%"
            $gtSm={{ maxWidth: "$20" }}
            onPress={form.handleSubmit}
          >
            LOG IN
          </PrimaryBtn>
          <Link href="/signup/form" replace asChild>
            <SecondaryBtn size="$4" w="100%" $gtSm={{ maxWidth: "$20" }}>
              SIGN UP
            </SecondaryBtn>
          </Link>
        </form.Provider>
      </YStack>
      <Text h="$4" color="#b8ab8c" fontSize="$2" fontWeight="bold">
        Forgot password?
      </Text>
    </YStack>
  );
}
