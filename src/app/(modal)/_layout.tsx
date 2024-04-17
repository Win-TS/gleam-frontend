import { Stack } from "expo-router";
import React from "react";

import { useClientOnlyValue } from "@/src/components/useClientOnlyValue";

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          title: "Log in",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: "Sign up",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="recover"
        options={{
          title: "Recover",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="setting"
        options={{
          title: "Setting",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
