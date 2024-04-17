import { router } from "expo-router";
import React from "react";

import PageContainer from "@/src/components/PageContainer";
import ProfileHivePicker from "@/src/components/ProfileHivePicker";
import { useUserId } from "@/src/stores/user";

export default function ProfileHiveScreen() {
  const userId = useUserId();

  return (
    <PageContainer>
      <ProfileHivePicker
        userId={userId}
        onPress={(hive) =>
          router.replace({
            pathname: "/(tabs)/home/hive/[id]/",
            params: { id: hive.group_id },
          })
        }
      ></ProfileHivePicker>
    </PageContainer>
  );
}
