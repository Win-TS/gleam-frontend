import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Stack, router } from "expo-router";
import React from "react";
import { Button, useTheme } from "tamagui";

import { useClientOnlyValue } from "@/src/components/useClientOnlyValue";

export default function StackLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Stack.Screen
        name="report"
        options={{
          title: "Report",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerLeft: () => (
            <Button chromeless onPress={() => router.back()}>
              <FontAwesome
                size={14}
                color={theme.gleam12.val}
                name="chevron-left"
              />
            </Button>
          ),
        }}
      />
    </Stack>
  );
}
