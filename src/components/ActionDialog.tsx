import { AlertDialog, XStack } from "tamagui";

import PrimaryBtn from "@/src/components/PrimaryBtn";
import SecondaryBtn from "@/src/components/SecondaryBtn";

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
          backgroundColor="$color1"
          borderWidth="$0"
          justifyContent="center"
          alignItems="center"
        >
          <AlertDialog.Title
            key="title"
            w="$14"
            fontSize="$7"
            lineHeight="$2"
            textAlign="center"
          >
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description fontSize="$2">
            {description}
          </AlertDialog.Description>
          <XStack w="100%" gap="$3" pt="$4">
            <AlertDialog.Action onPress={onAction} asChild>
              <PrimaryBtn flex={1} size="$2.5" borderRadius="$4">
                YES
              </PrimaryBtn>
            </AlertDialog.Action>
            <AlertDialog.Cancel asChild>
              <SecondaryBtn flex={1} size="$2.5" borderRadius="$4">
                NO
              </SecondaryBtn>
            </AlertDialog.Cancel>
          </XStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}
