import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import React from "react";
import { Text, View } from "tamagui";

import PageContainer from "@/src/components/PageContainer";
import PressableSection from "@/src/components/PressableSection";

export default function SettingScreen() {
  const router = useRouter();

  return (
    <PageContainer justifyContent="flex-start">
      <PressableSection onPress={() => router.push("/(modal)/setting/account")}>
        <View w="100%" p="$3">
          <Text fos="$5" fow="bold">
            ACCOUNT CENTER
          </Text>
        </View>
      </PressableSection>
      <PressableSection
        onPress={() => router.push("/(modal)/setting/notification")}
      >
        <View w="100%" p="$3">
          <Text fos="$5" fow="bold">
            NOTIFICATION SETTING
          </Text>
        </View>
      </PressableSection>
      <PressableSection
        onPress={async () => {
          const auth = getAuth();
          await auth.signOut();
        }}
      >
        <View w="100%" p="$3">
          <Text fos="$5" fow="bold">
            LOGOUT
          </Text>
        </View>
      </PressableSection>
    </PageContainer>
  );
}
