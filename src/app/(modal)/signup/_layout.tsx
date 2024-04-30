import { Stack } from "expo-router";

import { useClientOnlyValue } from "@/src/components/useClientOnlyValue";
import { usePreventHardwareBackPress } from "@/src/hooks/usePreventHardwareBackPress";

export default function ModalLayout() {
  usePreventHardwareBackPress();

  return (
    <Stack
      screenOptions={{
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Stack.Screen
        name="form"
        options={{
          title: "Form",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="otp"
        options={{
          title: "OTP",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
