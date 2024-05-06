import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useRouter } from "expo-router";
import { Spinner, Text, YStack } from "tamagui";
import { z } from "zod";

import { LogoIcon } from "@/assets";
import PageContainer from "@/src/components/PageContainer";
import PrimaryBtn from "@/src/components/PrimaryBtn";
import SecondaryBtn from "@/src/components/SecondaryBtn";
import SecondaryInput from "@/src/components/SecondaryInput";
import { TextStyle } from "@/src/constants/TextStyle";
import {
  useFindAuthUserByEmailMutation,
  useUpdatePasswordMutation,
} from "@/src/hooks/auth";
import { usePreventHardwareBackPress } from "@/src/hooks/usePreventHardwareBackPress";

export default function RecoverScreen() {
  usePreventHardwareBackPress();

  const router = useRouter();

  const findAuthUserByEmailMutation = useFindAuthUserByEmailMutation();
  const updatePasswordMutation = useUpdatePasswordMutation();

  const formValidator = {
    email: z.string().email(),
    confirmationCode: z.string(),
    password: z.string(),
  };

  const form = useForm({
    defaultValues: {
      email: "",
      confirmationCode: "",
      password: "",
    },
    validatorAdapter: zodValidator,
    onSubmit: async ({ value }) => {
      try {
        const { email, password } = await z
          .object(formValidator)
          .parseAsync(value);
        const authUser = await findAuthUserByEmailMutation.mutateAsync({
          email,
        });
        await updatePasswordMutation.mutateAsync({
          uid: authUser.rawId,
          password,
        });
      } catch {}
    },
  });

  return (
    <PageContainer>
      <YStack f={1} w="100%" jc="center" ai="center" gap="$3">
        <LogoIcon />
        <form.Provider>
          <form.Field
            name="email"
            validators={{ onChange: formValidator.email }}
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
          <PrimaryBtn size="$4" w="100%">
            <Text col="$color1" {...TextStyle.button.small}>
              GET CONFIRMATION CODE
            </Text>
          </PrimaryBtn>
          <form.Field
            name="confirmationCode"
            validators={{ onChange: formValidator.confirmationCode }}
            children={(field) => (
              <SecondaryInput
                w="100%"
                placeholder="Confirmation code"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
              />
            )}
          />
          <form.Field
            name="password"
            validators={{ onChange: formValidator.password }}
            children={(field) => (
              <SecondaryInput
                w="100%"
                password
                placeholder="Enter your new password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
              />
            )}
          />
          <Text h="$4" w="100%" col="#ff0000" {...TextStyle.description}>
            {""}
          </Text>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) =>
              isSubmitting ? (
                <Spinner size="large" color="$color11" />
              ) : (
                <PrimaryBtn
                  size="$4"
                  w="100%"
                  disabled={!canSubmit}
                  opacity={canSubmit ? 1 : 0.5}
                  onPress={form.handleSubmit}
                >
                  <Text col="$color1" {...TextStyle.button.large}>
                    RESET PASSWORD
                  </Text>
                </PrimaryBtn>
              )
            }
          />
          <SecondaryBtn
            size="$4"
            w="100%"
            onPress={() => {
              router.replace("/login");
            }}
          >
            <Text col="$gleam12" {...TextStyle.button.large}>
              BACK TO LOGIN
            </Text>
          </SecondaryBtn>
        </form.Provider>
      </YStack>
    </PageContainer>
  );
}
