import { Stack } from "expo-router";
import React from "react";

import BackBtn from "@/src/components/BackBtn";
import { useClientOnlyValue } from "@/src/components/useClientOnlyValue";
import { titleStyle } from "@/src/constants/Title";

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
          headerTitleStyle: titleStyle,
          headerLeft: () => <BackBtn />,
        }}
      />
      <Stack.Screen
        name="account"
        options={{
          title: "ACCOUNT CENTER",
          headerTitleAlign: "center",
          headerTitleStyle: titleStyle,
          headerLeft: () => <BackBtn />,
        }}
      />
      <Stack.Screen
        name="notification"
        options={{
          title: "NOTIFICATION",
          headerTitleAlign: "center",
          headerTitleStyle: titleStyle,
          headerLeft: () => <BackBtn />,
        }}
      />
    </Stack>
  );
}
