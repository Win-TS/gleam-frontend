import { useForm } from "@tanstack/react-form";
import { getAuth } from "firebase/auth";
import React, { useState } from "react";
import { Input, Text, View, XStack, YStack } from "tamagui";

import ActionDialog from "@/src/components/ActionDialog";
import PageContainer from "@/src/components/PageContainer";
import PressableSection from "@/src/components/PressableSection";
import PrimaryBtn from "@/src/components/PrimaryBtn";
import PrimarySwitch from "@/src/components/PrimarySwitch";
import QueryPlaceholder from "@/src/components/QueryPlaceholder";
import Section from "@/src/components/Section";
import {
  useUserQuery,
  useUsernameMutation,
  useUserPrivateMutation,
} from "@/src/hooks/user";

export default function SettingScreen() {
  const userQuery = useUserQuery();

  const userPrivateMutation = useUserPrivateMutation();
  const usernameMutation = useUsernameMutation();

  const usernameForm = useForm({
    defaultValues: {
      username: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await usernameMutation.mutateAsync(value);
      } catch {}
    },
  });

  const [openPrivateDialog, setOpenPrivateDialog] = useState(false);

  return (
    <PageContainer justifyContent="flex-start">
      <Section>
        <XStack w="100%" px="$3" py="$1" jc="space-between">
          <Text fos="$5">Private Account</Text>
          <QueryPlaceholder
            query={userQuery}
            renderData={(data) => (
              <PrimarySwitch
                checked={data.private_account}
                onCheckedChange={() => setOpenPrivateDialog(true)}
              />
            )}
          />
        </XStack>
      </Section>
      <Section>
        <YStack w="100%" px="$3" py="$1" gap="$2">
          <usernameForm.Provider>
            <Text fos="$5">Username</Text>
            <usernameForm.Field
              name="username"
              children={(field) => (
                <Input
                  py="$1"
                  w="100%"
                  h="$3"
                  bw="$1"
                  boc="$gleam12"
                  fos="$3"
                  placeholder="Type your new username"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChangeText={field.handleChange}
                />
              )}
            />
            <Text fos="$3" col="$color10">
              you may only change your username once in 7 days
            </Text>
            <XStack w="100%" jc="flex-end">
              <PrimaryBtn h="$2" onPress={usernameForm.handleSubmit}>
                Change Username
              </PrimaryBtn>
            </XStack>
          </usernameForm.Provider>
        </YStack>
      </Section>
      <Section>
        <YStack w="100%" px="$3" py="$1" gap="$2">
          <Text fos="$5">Phone Number</Text>
          <Input
            py="$1"
            w="100%"
            h="$3"
            bw="$1"
            boc="$gleam12"
            fos="$3"
            placeholder="Type your new phone number"
          />
          <XStack w="100%" jc="flex-end">
            <PrimaryBtn h="$2">Receive OTP</PrimaryBtn>
          </XStack>
        </YStack>
      </Section>
      <PressableSection
        onPress={async () => {
          const auth = getAuth();
          await auth.signOut();
        }}
      >
        <View w="100%" p="$3">
          <Text fos="$5" fow="bold" col="$red10">
            Delete Account
          </Text>
        </View>
      </PressableSection>
      <ActionDialog
        open={openPrivateDialog}
        onOpenChange={setOpenPrivateDialog}
        onAction={async () => {
          try {
            await userPrivateMutation.mutateAsync({
              privateAccount: !userQuery.data?.private_account,
            });
          } catch {}
        }}
        title={`Are you sure you want to make the account ${userQuery.data?.private_account ? "public" : "private"}?`}
        description=""
      />
    </PageContainer>
  );
}
