import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import React from "react";
import { Text, View } from "tamagui";

import PageContainer from "@/src/components/PageContainer";
import PressableSection from "@/src/components/PressableSection";
import { TextStyle } from "@/src/constants/TextStyle";

export default function SettingScreen() {
  const router = useRouter();

  return (
    <PageContainer justifyContent="flex-start">
      <PressableSection onPress={() => router.push("/(modal)/setting/account")}>
        <View w="100%" p="$3">
          <Text {...TextStyle.button.large}>ACCOUNT CENTER</Text>
        </View>
      </PressableSection>
      <PressableSection
        onPress={() => router.push("/(modal)/setting/notification")}
      >
        <View w="100%" p="$3">
          <Text {...TextStyle.button.large}>NOTIFICATION SETTING</Text>
        </View>
      </PressableSection>
      <PressableSection
        onPress={async () => {
          const auth = getAuth();
          await auth.signOut();
        }}
      >
        <View w="100%" p="$3">
          <Text {...TextStyle.button.large}>LOGOUT</Text>
        </View>
      </PressableSection>
    </PageContainer>
  );
}
