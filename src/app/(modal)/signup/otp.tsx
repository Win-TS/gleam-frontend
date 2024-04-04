import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { FirebaseError } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { Text, Input, YStack, XStack } from "tamagui";
import z from "zod";

import PageContainer from "@/src/components/PageContainer";
import PrimaryBtn from "@/src/components/PrimaryBtn";

const params = z.object({
  email: z.string().email(),
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
    <PageContainer>
      <XStack
        flex={1}
        w="100%"
        justifyContent="center"
        alignItems="center"
        gap="$3"
      >
        {[...Array(6)].map((_, i) => (
          <Input
            key={i}
            flex={1}
            h="$6"
            maw="$4"
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
    </PageContainer>
  );
}
