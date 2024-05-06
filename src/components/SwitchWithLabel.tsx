import { Text, View, YStack } from "tamagui";

import PrimarySwitch from "@/src/components/PrimarySwitch";
import { TextStyle } from "@/src/constants/TextStyle";

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
      <Text col="$gleam12" {...TextStyle.description}>
        {label}
      </Text>
    </YStack>
  );
};
