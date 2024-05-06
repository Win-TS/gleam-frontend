import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, View, Separator, XStack, useWindowDimensions } from "tamagui";
import { z } from "zod";

import DeleteHiveDialog from "@/src/components/DeleteHiveDialog";
import PageContainer from "@/src/components/PageContainer";
import PrimarySwitch from "@/src/components/PrimarySwitch";
import { TextStyle } from "@/src/constants/TextStyle";
import { useDeleteHiveMutation } from "@/src/hooks/hive";
import { useUserId } from "@/src/stores/user";

const params = z.object({
  id: z.coerce.number(),
});

export default function SettingScreen() {
  const { id: hiveId } = params.parse(useLocalSearchParams<{ id: string }>());
  const { width } = useWindowDimensions();
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const router = useRouter();
  const userId = useUserId();

  const deleteHiveMutation = useDeleteHiveMutation(hiveId, userId);

  return (
    <PageContainer justifyContent="flex-start">
      <XStack w="100%" ai="center" gap="$3" p="$3">
        <Text
          f={1}
          col="$red10"
          {...TextStyle.button.large}
          onPress={() => setDeleteModal(true)}
        >
          Delete League
        </Text>
        <DeleteHiveDialog
          open={deleteModal}
          onOpenChange={setDeleteModal}
          onAction={async () => {
            try {
              await deleteHiveMutation.mutateAsync();
              router.push("/(tabs)/search");
            } catch {}
          }}
        />
      </XStack>
      <Separator w={width} $gtSm={{ maw: "$20" }} boc="$gleam12" />
      <XStack w="100%" ai="center" gap="$3" p="$3">
        <Text f={1} col="$color11" {...TextStyle.button.large}>
          Private League
        </Text>
        <View p="$2">
          <PrimarySwitch />
        </View>
      </XStack>
      <Separator w={width} $gtSm={{ maw: "$20" }} boc="$gleam12" />
    </PageContainer>
  );
}
