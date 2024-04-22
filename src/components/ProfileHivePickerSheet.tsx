import { Sheet } from "tamagui";

import ProfileHivePicker from "@/src/components/ProfileHivePicker";
import { Hive } from "@/src/schemas/hive";
import { Portal } from "@gorhom/portal";

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
    <Portal>
      <Sheet snapPoints={[80]} open={open} onOpenChange={setOpen}>
        <Sheet.Overlay />
        <Sheet.Frame p="$4" jc="center" ai="center" gap="$3">
          <ProfileHivePicker
            userId={userId}
            onPress={(hive) => {
              onPress?.(hive);
              setOpen(false);
            }}
          />
        </Sheet.Frame>
      </Sheet>
    </Portal>
  );
}
