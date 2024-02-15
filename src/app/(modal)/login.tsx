import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Link } from "expo-router";
import { FirebaseError } from "firebase/app";
import {
  UserCredential,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React from "react";
import { Button, View, Text, Input, Checkbox, Theme } from "tamagui";

export default function LoginScreen() {
  const auth = getAuth();

  type FormFields = {
    email: string;
    password: string;
  };

  const loginMutation = useMutation<UserCredential, FirebaseError, FormFields>({
    mutationFn: async ({ email, password }: FormFields) => {
      return await signInWithEmailAndPassword(auth, email, password);
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
    <View flex={1} p="$4" justifyContent="center" alignItems="center" gap="$3">
      <View
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
                maxWidth="$20"
                borderWidth="$1"
                borderRadius="$6"
                placeholder="Email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
              />
            )}
          />
          <View position="relative" w="100%" maxWidth="$20">
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
                  color="hsl(0, 0%, 56.1%)"
                  name="eye-slash"
                />
              </Button>
            </View>
          </View>
          <View h="$1" w="100%" maxWidth="$20">
            <View alignSelf="flex-start" flex={1} flexDirection="row" gap="$2">
              <Checkbox size="$3">
                <Checkbox.Indicator>
                  <FontAwesome name="check" />
                </Checkbox.Indicator>
              </Checkbox>
              <Text color="#b8ab8c" fontSize="$3" fontWeight="bold">
                remember me
              </Text>
            </View>
          </View>
          <View position="relative" h="$4" w="100%" maxWidth="$20">
            <Text color="#ff0000" fontSize="$2" fontWeight="bold">
              {loginMutation.error?.message ?? ""}
            </Text>
          </View>
          <Theme name="gleam">
            <Button
              size="$4"
              w="100%"
              maxWidth="$20"
              borderWidth="$1"
              borderRadius="$8"
              backgroundColor="$color12"
              borderColor="$color12"
              color="$color1"
              fontWeight="bold"
              onPress={form.handleSubmit}
            >
              LOG IN
            </Button>
            <Link href="/signup" replace asChild>
              <Button
                size="$4"
                w="100%"
                maxWidth="$20"
                borderWidth="$1"
                borderRadius="$8"
                backgroundColor="$color1"
                borderColor="$color12"
                color="$color12"
                fontWeight="bold"
              >
                SIGN UP
              </Button>
            </Link>
          </Theme>
        </form.Provider>
      </View>
      <Text h="$4" color="#b8ab8c" fontSize="$2" fontWeight="bold">
        Forgot password?
      </Text>
    </View>
  );
}
