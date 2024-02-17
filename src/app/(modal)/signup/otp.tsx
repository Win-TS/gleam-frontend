import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { FirebaseError } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { Button, View, Text, Input, Theme } from "tamagui";
import z from "zod";

const params = z.object({
  email: z.string(),
  password: z.string(),
});

export default function SignupOtpScreen() {
  const { email, password } = params.parse(useLocalSearchParams());

  const otpMutation = useMutation<undefined, FirebaseError>({
    mutationFn: async () => {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
    },
  });

  return (
    <View flex={1} p="$4" justifyContent="center" alignItems="center" gap="$3">
      <View
        flex={1}
        flexDirection="row"
        w="100%"
        maxWidth="$20"
        justifyContent="center"
        alignItems="center"
        gap="$3"
      >
        {[...Array(6)].map((_, i) => (
          <Input
            key={i}
            h="$6"
            p="$0"
            borderWidth="$1"
            borderRadius="$4"
            fontSize="$8"
            fontWeight="bold"
            textAlign="center"
            inputMode="numeric"
            maxLength={1}
          />
        ))}
      </View>
      <View
        h="$11"
        w="100%"
        justifyContent="center"
        alignItems="center"
        gap="$3"
      >
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
            onPress={async () => {
              try {
                await otpMutation.mutateAsync();
              } catch {}
            }}
          >
            Create an account
          </Button>
        </Theme>
        <View flexDirection="row" gap="$3">
          <Text
            color="#b8ab8c"
            fontSize="$2"
            fontWeight="bold"
            textDecorationLine="underline"
          >
            Resend OTP
          </Text>
        </View>
      </View>
    </View>
  );
}
