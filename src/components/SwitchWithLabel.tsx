import { Text, View, YStack, Switch, useTheme } from "tamagui";

export default ({
  checked,
  setChecked,
  label,
}: {
  checked?: boolean;
  setChecked?: (_: boolean) => void;
  label: string;
}) => {
  const theme = useTheme();

  return (
    <YStack alignItems="flex-end">
      <View>
        <Switch
          size="$2"
          p="$0"
          backgroundColor={checked ? theme.gleam12.val : theme.color1.val}
          borderWidth="$1"
          borderColor="$gleam12"
          checked={checked}
          onCheckedChange={setChecked}
          unstyled
        >
          <Switch.Thumb
            backgroundColor={checked ? theme.color1.val : theme.gleam12.val}
            animation="quick"
          />
        </Switch>
      </View>
      <Text color="$gleam12" fontSize="$2">
        {label}
      </Text>
    </YStack>
  );
};
