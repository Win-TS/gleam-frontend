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
      <XStack f={1} w="100%" jc="center" ai="center" gap="$3">
        {[...Array(6)].map((_, i) => (
          <Input
            key={i}
            f={1}
            h="$6"
            maw="$4"
            p="$0"
            bw="$1"
            br="$4"
            fos="$8"
            fow="bold"
            ta="center"
            inputMode="numeric"
            maxLength={1}
          />
        ))}
      </XStack>
      <YStack h="$11" w="100%" jc="center" ai="center" gap="$3">
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
            fos="$2"
            fow="bold"
            textDecorationLine="underline"
          >
            Resend OTP
          </Text>
        </XStack>
      </YStack>
    </PageContainer>
  );
}
