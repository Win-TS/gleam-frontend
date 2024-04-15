import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import React from "react";
import { Pressable } from "react-native";
import { Separator, Text, View, useWindowDimensions } from "tamagui";

import PageContainer from "@/src/components/PageContainer";

export default function SettingScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  return (
    <PageContainer justifyContent="flex-start">
      <Pressable
        onPress={() => router.push("/(modal)/setting/account")}
        style={{ width: "100%" }}
      >
        <View w="100%" p="$3">
          <Text fos="$5">ACCOUNT CENTER</Text>
        </View>
      </Pressable>
      <Separator w={width} $gtSm={{ maw: "$20" }} boc="$gleam12" />
      <Pressable
        onPress={() => router.push("/(modal)/setting/notification")}
        style={{ width: "100%" }}
      >
        <View w="100%" p="$3">
          <Text fos="$5">NOTIFICATION SETTING</Text>
        </View>
      </Pressable>
      <Separator w={width} $gtSm={{ maw: "$20" }} boc="$gleam12" />
      <Pressable
        onPress={async () => {
          const auth = getAuth();
          await auth.signOut();
        }}
        style={{ width: "100%" }}
      >
        <View w="100%" p="$3">
          <Text fos="$5">LOGOUT</Text>
        </View>
      </Pressable>
      <Separator w={width} $gtSm={{ maw: "$20" }} boc="$gleam12" />
    </PageContainer>
  );
}
