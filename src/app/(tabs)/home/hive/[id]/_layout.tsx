import { Stack } from "expo-router";
import React from "react";

import BackBtn from "@/src/components/BackBtn";
import { useClientOnlyValue } from "@/src/components/useClientOnlyValue";
import { gleamTitle } from "@/src/constants/gleamTitle";

export default function StackLayout() {
  return (
    <Stack
      screenOptions={{
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Stack.Screen name="index" options={gleamTitle.withBackBtn} />
      <Stack.Screen
        name="report"
        options={{
          title: "Report",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerLeft: () => <BackBtn />,
        }}
      />
      <Stack.Screen
        name="post"
        options={{
          title: "Post",
          headerShown: false,
        }}
      />
      <Stack.Screen name="member" options={gleamTitle.withBackBtn} />
      <Stack.Screen
        name="setting"
        options={{
          title: "Setting",
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
