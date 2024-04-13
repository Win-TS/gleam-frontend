import { useLocalSearchParams } from "expo-router";
import { Text, View, Separator, XStack, useWindowDimensions } from "tamagui";
import { z } from "zod";

import PageContainer from "@/src/components/PageContainer";
import PrimarySwitch from "@/src/components/PrimarySwitch";
import { useDeleteHiveMutation } from "@/src/hooks/hive";

const params = z.object({
  id: z.coerce.number(),
});

export default function SettingScreen() {
  const { id: hiveId } = params.parse(useLocalSearchParams<{ id: string }>());
  const { width } = useWindowDimensions();

  const deleteHiveMutation = useDeleteHiveMutation(hiveId);

  return (
    <PageContainer justifyContent="flex-start">
      <XStack w="100%" ai="center" gap="$3" p="$3">
        <Text
          f={1}
          col="$red10"
          fos="$5"
          onPress={async () => {
            try {
              await deleteHiveMutation.mutateAsync();
            } catch {}
          }}
        >
          Delete League
        </Text>
      </XStack>
      <Separator w={width} $gtSm={{ maw: "$20" }} boc="$gleam12" />
      <XStack w="100%" ai="center" gap="$3" p="$3">
        <Text f={1} col="$color11" fos="$5">
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
