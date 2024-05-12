import { Portal } from "@gorhom/portal";
import { useState } from "react";
import { AlertDialog, XStack } from "tamagui";

import DangerBtn from "@/src/components/DangerBtn";
import PrimaryInput from "@/src/components/PrimaryInput";

export default function ({
  open,
  onOpenChange,
  onAction,
}: {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onAction?: () => void;
}) {
  const [deleteText, setDeleteText] = useState<string>("");
  return (
    <Portal hostName="RootPortalHost">
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay key="overlay" />
          <AlertDialog.Content
            key="content"
            p="$6"
            h="$50"
            w="$50"
            bc="$color1"
            bw="$0"
            jc="center"
            ai="center"
          >
            <AlertDialog.Title key="title" w="$15" fos="$8" lh="$2" ta="center">
              Please confirm your delete
            </AlertDialog.Title>
            <AlertDialog.Description fos="$1">
              *this action cannot be undone*
            </AlertDialog.Description>
            <AlertDialog.Description fos="$3" marginTop="$5">
              Enter the word “DELETE”
            </AlertDialog.Description>
            <PrimaryInput
              w="100%"
              br="$4"
              value={deleteText}
              onChangeText={setDeleteText}
            />
            <XStack w="100%" gap="$3" pt="$4">
              <AlertDialog.Action
                onPress={onAction}
                asChild
                disabled={deleteText.toUpperCase() !== "DELETE"}
              >
                <DangerBtn
                  f={1}
                  opacity={deleteText.toUpperCase() === "DELETE" ? 1 : 0.5}
                  size="$2.5"
                  br="$4"
                >
                  CONFIRM
                </DangerBtn>
              </AlertDialog.Action>
            </XStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    </Portal>
  );
}
