import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Stack, router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Button, useTheme } from "tamagui";
import z from "zod";

import { useClientOnlyValue } from "@/src/components/useClientOnlyValue";

export default function StackLayout() {
  const theme = useTheme();
  const params = z.object({
    id: z.coerce.number(),
  });
  const { id: hiveId } = params.parse(useLocalSearchParams<{ id: string }>());

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
          title: "GLEAM",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerLeft: () => (
            <FontAwesome size={25} color={theme.gleam12.val} name="bell" />
          ),
          headerRight: () => (
            <Button
              chromeless
              onPress={() => router.push(`/home/hive/${hiveId}/setting`)}
            >
              <FontAwesome size={30} color={theme.gleam12.val} name="gear" />
            </Button>
          ),
        }}
      />
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
      <Stack.Screen
        name="member"
        options={{
          title: "GLEAM",
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
          headerRight: () => (
            <Button
              chromeless
              onPress={() => router.push(`/home/hive/${hiveId}/setting`)}
            >
              <FontAwesome size={30} color={theme.gleam12.val} name="gear" />
            </Button>
          ),
        }}
      />
      <Stack.Screen
        name="setting"
        options={{
          title: "Setting",
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
