import { Stack } from "expo-router";
import React from "react";

import { useClientOnlyValue } from "@/src/components/useClientOnlyValue";
import { GleamTitle } from "@/src/constants/Title";

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Stack.Screen name="index" options={GleamTitle.withBackBtn} />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Hive",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
