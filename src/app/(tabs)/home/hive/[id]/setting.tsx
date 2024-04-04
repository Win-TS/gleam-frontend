import { useLocalSearchParams } from "expo-router";
import { useWindowDimensions } from "react-native";
import { Text, View, Separator, XStack } from "tamagui";
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
      <XStack w="100%" alignItems="center" gap="$3" padding="$3">
        <Text
          flex={1}
          color="$red10"
          fontSize="$5"
          onPress={async () => {
            try {
              await deleteHiveMutation.mutateAsync();
            } catch {}
          }}
        >
          Delete League
        </Text>
      </XStack>
      <Separator w={width} $gtSm={{ maw: "$20" }} borderColor="$gleam12" />
      <XStack w="100%" alignItems="center" gap="$3" padding="$3">
        <Text flex={1} color="$color11" fontSize="$5">
          Private League
        </Text>
        <View p="$2">
          <PrimarySwitch />
        </View>
      </XStack>
      <Separator w={width} $gtSm={{ maw: "$20" }} borderColor="$gleam12" />
    </PageContainer>
  );
}
