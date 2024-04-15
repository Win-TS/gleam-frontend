import { Image as ExpoImage } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable } from "react-native";

import { icons } from "@/assets";

export default function () {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.back()} style={{ padding: 16 }}>
      <ExpoImage
        source={icons.chevron_left}
        style={{ width: 24, height: 24 }}
      />
    </Pressable>
  );
}
