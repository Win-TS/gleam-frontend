import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useRouter } from "expo-router";
import { Text, Checkbox, YStack, XStack, Spinner } from "tamagui";
import { z } from "zod";

import { LogoIcon } from "@/assets";
import PageContainer from "@/src/components/PageContainer";
import PrimaryBtn from "@/src/components/PrimaryBtn";
import SecondaryBtn from "@/src/components/SecondaryBtn";
import SecondaryInput from "@/src/components/SecondaryInput";
import { TextStyle } from "@/src/constants/TextStyle";
import { useSignInMutation } from "@/src/hooks/auth";
import { useMutationErrorMessage } from "@/src/hooks/query";
import { usePreventHardwareBackPress } from "@/src/hooks/usePreventHardwareBackPress";

export default function LoginScreen() {
  usePreventHardwareBackPress();

  const router = useRouter();

  const signInMutation = useSignInMutation();
  const signInMutationErrorMessage = useMutationErrorMessage(signInMutation);

  const formValidator = {
    email: z.string().email(),
    password: z.string(),
  };

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validatorAdapter: zodValidator,
    onSubmit: async ({ value }) => {
      try {
        await signInMutation.mutateAsync(value);
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
          <form.Field
            name="password"
            validators={{ onChange: formValidator.password }}
            children={(field) => (
              <SecondaryInput
                w="100%"
                password
                placeholder="Password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
              />
            )}
          />
          <XStack h="$1" w="100%" als="flex-start" gap="$2">
            <Checkbox size="$3">
              <Checkbox.Indicator>
                <FontAwesome name="check" />
              </Checkbox.Indicator>
            </Checkbox>
            <Text col="#b8ab8c" {...TextStyle.description}>
              remember me
            </Text>
          </XStack>
          <Text h="$4" w="100%" col="#ff0000" {...TextStyle.description}>
            {signInMutationErrorMessage ?? ""}
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
                    LOG IN
                  </Text>
                </PrimaryBtn>
              )
            }
          />
          <SecondaryBtn
            size="$4"
            w="100%"
            onPress={() => {
              router.replace("/signup/form");
            }}
          >
            <Text col="$gleam12" {...TextStyle.button.large}>
              SIGN UP
            </Text>
          </SecondaryBtn>
        </form.Provider>
      </YStack>
      <Text
        h="$4"
        col="#b8ab8c"
        {...TextStyle.description}
        onPress={() => router.replace("/recover")}
      >
        Forgot password?
      </Text>
    </PageContainer>
  );
}
