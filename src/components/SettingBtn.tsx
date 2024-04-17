import { useRouter } from "expo-router";
import React from "react";
import { Pressable } from "react-native";

import { Icon } from "@/assets";

export default function () {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.push("/setting/")} style={{ padding: 16 }}>
      <Icon name="gear" />
    </Pressable>
  );
}
