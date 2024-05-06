import { Tabs } from "expo-router";
import React from "react";
import { DimensionValue } from "react-native";
import { View } from "tamagui";

import { NavIcon, NavIconName } from "@/assets";
import { useClientOnlyValue } from "@/src/components/useClientOnlyValue";

function TabBarIcon({
  name,
  focused,
  size,
}: {
  name: NavIconName;
  focused: boolean;
  size?: DimensionValue;
}) {
  return (
    <View
      w="$3"
      h="$3"
      jc="center"
      ai="center"
      bc={focused ? "$color5" : undefined}
      br="$3"
    >
      <NavIcon name={name} size={size} />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="home" focused={focused} />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="search" focused={focused} />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="add_streak"
        options={{
          title: "add streak",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="add_streak" size={36} focused={focused} />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="notification" focused={focused} />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon name="profile" focused={focused} />
          ),
          tabBarLabel: () => null,
        }}
      />
    </Tabs>
  );
}
