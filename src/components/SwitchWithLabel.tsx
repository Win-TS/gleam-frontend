import { Text, View, YStack } from "tamagui";

import PrimarySwitch from "@/src/components/PrimarySwitch";

export default ({
  checked,
  onCheckedChange,
  label,
}: {
  checked?: boolean;
  onCheckedChange?: (_: boolean) => void;
  label: string;
}) => {
  return (
    <YStack alignItems="flex-end">
      <View>
        <PrimarySwitch checked={checked} onCheckedChange={onCheckedChange} />
      </View>
      <Text color="$gleam12" fontSize="$2">
        {label}
      </Text>
    </YStack>
  );
};
