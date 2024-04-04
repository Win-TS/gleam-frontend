import { Switch, useTheme } from "tamagui";

export default ({
  checked,
  onCheckedChange,
}: {
  checked?: boolean;
  onCheckedChange?: (_: boolean) => void;
}) => {
  const theme = useTheme();

  return (
    <Switch
      size="$2"
      p="$0"
      backgroundColor={checked ? theme.gleam12.val : theme.color1.val}
      borderWidth="$1"
      borderColor="$gleam12"
      checked={checked}
      onCheckedChange={onCheckedChange}
      unstyled
    >
      <Switch.Thumb
        backgroundColor={checked ? theme.color1.val : theme.gleam12.val}
        animation="quick"
      />
    </Switch>
  );
};
