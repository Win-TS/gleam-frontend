import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { FirebaseError } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { Text, Input, YStack, XStack } from "tamagui";
import z from "zod";

import PrimaryBtn from "@/src/components/PrimaryBtn";

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
    <YStack
      flex={1}
      paddingVertical="$4"
      backgroundColor="$color1"
      justifyContent="center"
      alignItems="center"
      gap="$3"
      $sm={{ paddingHorizontal: "$4" }}
    >
      <XStack
        flex={1}
        w="100%"
        justifyContent="center"
        alignItems="center"
        gap="$3"
        $gtSm={{ maxWidth: "$20" }}
      >
        {[...Array(6)].map((_, i) => (
          <Input
            key={i}
            flex={1}
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
      </XStack>
      <YStack
        h="$11"
        w="100%"
        justifyContent="center"
        alignItems="center"
        gap="$3"
      >
        <PrimaryBtn
          size="$4"
          w="100%"
          $gtSm={{ maxWidth: "$20" }}
          onPress={async () => {
            try {
              await otpMutation.mutateAsync();
            } catch {}
          }}
        >
          Create an account
        </PrimaryBtn>
        <XStack gap="$3">
          <Text
            color="#b8ab8c"
            fontSize="$2"
            fontWeight="bold"
            textDecorationLine="underline"
          >
            Resend OTP
          </Text>
        </XStack>
      </YStack>
    </YStack>
  );
}
