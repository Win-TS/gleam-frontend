import { Stack } from "expo-router";
import React from "react";

import { useClientOnlyValue } from "@/src/components/useClientOnlyValue";
import BackBtn from "@/src/components/BackBtn";

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
        name="index"
        options={{
          title: "SETTING",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerLeft: () => <BackBtn />,
        }}
      />
      <Stack.Screen
        name="account"
        options={{
          title: "ACCOUNT CENTER",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerLeft: () => <BackBtn />,
        }}
      />
      <Stack.Screen
        name="notification"
        options={{
          title: "NOTIFICATION",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerLeft: () => <BackBtn />,
        }}
      />
    </Stack>
  );
}
