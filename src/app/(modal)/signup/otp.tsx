import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, Input, YStack, XStack } from "tamagui";
import z from "zod";

import PageContainer from "@/src/components/PageContainer";
import PrimaryBtn from "@/src/components/PrimaryBtn";
import { TextStyle } from "@/src/constants/TextStyle";
import { useSignInMutation } from "@/src/hooks/auth";

const params = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default function SignupOtpScreen() {
  const { email, password } = params.parse(useLocalSearchParams());

  const signInMutation = useSignInMutation();

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
              await signInMutation.mutateAsync({ email, password });
            } catch {}
          }}
        >
          <Text col="$color1" {...TextStyle.button.large}>
            Create an account
          </Text>
        </PrimaryBtn>
        <XStack gap="$3">
          <Text
            color="#b8ab8c"
            {...TextStyle.description}
            textDecorationLine="underline"
          >
            Resend OTP
          </Text>
        </XStack>
      </YStack>
    </PageContainer>
  );
}
