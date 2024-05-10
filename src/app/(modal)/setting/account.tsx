import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { getAuth } from "firebase/auth";
import React, { useState } from "react";
import { Spinner, Text, View, XStack, YStack } from "tamagui";
import { z } from "zod";

import ActionDialog from "@/src/components/ActionDialog";
import PageContainer from "@/src/components/PageContainer";
import PressableSection from "@/src/components/PressableSection";
import PrimaryBtn from "@/src/components/PrimaryBtn";
import PrimaryInput from "@/src/components/PrimaryInput";
import PrimarySwitch from "@/src/components/PrimarySwitch";
import QueryPlaceholder from "@/src/components/QueryPlaceholder";
import Section from "@/src/components/Section";
import { TextStyle } from "@/src/constants/TextStyle";
import {
  useUserQuery,
  useEditUserUsernameMutation,
  useUserPrivateMutation,
} from "@/src/hooks/user";

export default function SettingScreen() {
  const userQuery = useUserQuery();

  const userPrivateMutation = useUserPrivateMutation();
  const usernameMutation = useEditUserUsernameMutation();

  const formValidator = {
    username: z.string().min(1),
  };

  const form = useForm({
    defaultValues: {
      username: "",
    },
    validatorAdapter: zodValidator,
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
          <Text {...TextStyle.button.large}>Private Account</Text>
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
          <Text {...TextStyle.button.large}>Username</Text>
          <form.Field
            name="username"
            validators={{ onChange: formValidator.username }}
            children={(field) => (
              <PrimaryInput
                w="100%"
                boc={
                  form.state.submissionAttempts > 0 &&
                  field.state.meta.errors.length > 0
                    ? "$red10"
                    : undefined
                }
                placeholder="Type your new username"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
              />
            )}
          />
          <Text col="$color10" {...TextStyle.description}>
            you may only change your username once in 7 days
          </Text>
          <XStack w="100%" jc="flex-end">
            <form.Subscribe
              selector={(state) => [
                state.isDirty,
                state.canSubmit,
                state.isSubmitting,
              ]}
              children={([isDirty, canSubmit, isSubmitting]) =>
                isSubmitting ? (
                  <Spinner size="large" color="$color11" />
                ) : (
                  <PrimaryBtn
                    h="$2"
                    opacity={isDirty && canSubmit ? 1 : 0.5}
                    onPress={form.handleSubmit}
                  >
                    <Text col="$color1" {...TextStyle.button.small}>
                      Change Username
                    </Text>
                  </PrimaryBtn>
                )
              }
            />
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
          <Text col="$red10" {...TextStyle.button.large}>
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
