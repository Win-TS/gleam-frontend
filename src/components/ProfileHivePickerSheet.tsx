import { Sheet } from "tamagui";

import ProfileHivePicker from "@/src/components/ProfileHivePicker";
import { Hive } from "@/src/schemas/hive";

export default function ({
  open,
  setOpen,
  userId,
  onPress,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  userId: number;
  onPress?: (hive: Hive) => void;
}) {
  return (
    <Sheet
      forceRemoveScrollEnabled={open}
      snapPoints={[70]}
      modal
      open={open}
      onOpenChange={setOpen}
    >
      <Sheet.Overlay />
      <Sheet.Frame p="$4" justifyContent="center" alignItems="center" gap="$3">
        <ProfileHivePicker
          userId={userId}
          onPress={(hive) => {
            onPress?.(hive);
            setOpen(false);
          }}
        />
      </Sheet.Frame>
    </Sheet>
  );
}
