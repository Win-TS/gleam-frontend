import { AlertDialog, XStack, Text } from "tamagui";

import PrimaryBtn from "@/src/components/PrimaryBtn";
import SecondaryBtn from "@/src/components/SecondaryBtn";
import { TextStyle } from "@/src/constants/TextStyle";

export default function ({
  open,
  title,
  description,
  onOpenChange,
  onAction,
}: {
  open: boolean;
  title: string;
  description: string;
  onOpenChange: (open: boolean) => void;
  onAction?: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay key="overlay" />
        <AlertDialog.Content
          key="content"
          p="$6"
          w="$20"
          bc="$color1"
          bw="$0"
          jc="center"
          ai="center"
        >
          <AlertDialog.Title key="title" w="$14" fos="$7" lh="$2" ta="center">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description fos="$2">
            {description}
          </AlertDialog.Description>
          <XStack w="100%" gap="$3" pt="$4">
            <AlertDialog.Action onPress={onAction} asChild>
              <PrimaryBtn f={1} size="$2.5" br="$4">
                <Text col="$color1" {...TextStyle.button.large}>
                  YES
                </Text>
              </PrimaryBtn>
            </AlertDialog.Action>
            <AlertDialog.Cancel asChild>
              <SecondaryBtn f={1} size="$2.5" br="$4">
                <Text col="$gleam12" {...TextStyle.button.large}>
                  NO
                </Text>
              </SecondaryBtn>
            </AlertDialog.Cancel>
          </XStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}
