import { useState } from "react";
import { Switch, useTheme } from "tamagui";

export default ({
  checked,
  onCheckedChange,
}: {
  checked?: boolean;
  onCheckedChange?: (_: boolean) => void;
}) => {
  const theme = useTheme();

  const [localChecked, setLocalChecked] = useState(false);

  const computedChecked = checked ?? localChecked;

  const setComputedChecked = (checked: boolean) => {
    onCheckedChange?.(checked);
    setLocalChecked(checked);
  };

  return (
    <Switch
      size="$2"
      p="$0"
      br="$12"
      bc={computedChecked ? theme.gleam12.val : theme.color1.val}
      bw="$1"
      boc="$gleam12"
      checked={computedChecked}
      onCheckedChange={setComputedChecked}
      unstyled
    >
      <Switch.Thumb
        br="$12"
        bc={computedChecked ? theme.color1.val : theme.gleam12.val}
        animation="quick"
      />
    </Switch>
  );
};
