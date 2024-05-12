import { Sheet } from "tamagui";

import ProfileHivePicker from "@/src/components/ProfileHivePicker";
import StorybookPortal from "@/src/components/StorybookPortal";
import { Hive } from "@/src/schemas/hive";

export default function ({
  open,
  setOpen,
  userId,
  onPress,
}: {
  open: boolean;
  setOpen?: (open: boolean) => void;
  userId: number;
  onPress?: (hive: Hive) => void;
}) {
  return (
    <StorybookPortal>
      <Sheet snapPoints={[80]} open={open} onOpenChange={setOpen}>
        <Sheet.Overlay />
        <Sheet.Frame p="$4" jc="center" ai="center" gap="$3">
          <ProfileHivePicker
            userId={userId}
            onPress={(hive) => {
              onPress?.(hive);
              setOpen?.(false);
            }}
          />
        </Sheet.Frame>
      </Sheet>
    </StorybookPortal>
  );
}
