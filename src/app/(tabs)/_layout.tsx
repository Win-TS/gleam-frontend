import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";

import { useClientOnlyValue } from "@/src/components/useClientOnlyValue";
import { useColorScheme } from "@/src/components/useColorScheme";
import Colors from "@/src/constants/Colors";
import { useTheme } from "tamagui";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const theme = useTheme();
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="home" color={theme.gleam12.val} />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "GLEAM",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="search" color={theme.gleam12.val} />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="add_streak"
        options={{
          title: "add streak",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="plus-circle" color={theme.gleam12.val} />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="bell" color={theme.gleam12.val} />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "GLEAM",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="user" color={theme.gleam12.val} />
          ),
          tabBarLabel: () => null,
        }}
      />
    </Tabs>
  );
}
