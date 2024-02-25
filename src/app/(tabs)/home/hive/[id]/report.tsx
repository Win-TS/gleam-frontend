import { Input, Text, YStack } from "tamagui";

import DangerBtn from "@/src/components/DangerBtn";

export default function ReportScreen() {
  return (
    <YStack
      flex={1}
      paddingVertical="$4"
      backgroundColor="$color1"
      justifyContent="flex-start"
      alignItems="center"
      overflow="scroll"
      gap="$3"
      $sm={{ paddingHorizontal: "$4" }}
    >
      <Text w="100%" $gtSm={{ maxWidth: "$20" }}>
        What do you want to report?
      </Text>
      <Input
        w="100%"
        $gtSm={{ maxWidth: "$20" }}
        placeholder="Enter your issue"
      />
      <Text w="100%" $gtSm={{ maxWidth: "$20" }}>
        Give us some details
      </Text>
      <Input
        h="$12"
        w="100%"
        $gtSm={{ maxWidth: "$20" }}
        placeholder="Describe the issue"
        multiline
      />
      <DangerBtn> Report </DangerBtn>
    </YStack>
  );
}
