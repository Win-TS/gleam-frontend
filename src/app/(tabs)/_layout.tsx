import { Image as ExpoImage } from "expo-image";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "tamagui";

import { nav } from "@/assets";
import { useClientOnlyValue } from "@/src/components/useClientOnlyValue";
import { useColorScheme } from "@/src/components/useColorScheme";
import Colors from "@/src/constants/Colors";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon({
  icon,
  focused,
  size,
}: {
  icon: React.ComponentProps<typeof ExpoImage>["source"];
  focused: boolean;
  size?: number;
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
      <ExpoImage
        source={icon}
        style={{ width: size ?? 24, height: size ?? 24 }}
      />
    </View>
  );
}

export default function TabLayout() {
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
          tabBarIcon: ({ focused }) => (
            <TabBarIcon icon={nav.home} focused={focused} />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon icon={nav.search} focused={focused} />
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
            <TabBarIcon icon={nav.add_streak} size={36} focused={focused} />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon icon={nav.notification} focused={focused} />
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
          tabBarIcon: ({ focused }) => (
            <TabBarIcon icon={nav.profile} focused={focused} />
          ),
          tabBarLabel: () => null,
        }}
      />
    </Tabs>
  );
}
