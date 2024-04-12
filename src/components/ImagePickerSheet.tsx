import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import { XStack, useTheme, Sheet, Text, YStack } from "tamagui";

import PrimaryBtn from "@/src/components/PrimaryBtn";

export default function ({
  open,
  setOpen,
  setImage,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  setImage: (image: string) => void;
}) {
  const theme = useTheme();

  return (
    <Sheet
      forceRemoveScrollEnabled={open}
      snapPointsMode="fit"
      modal
      open={open}
      onOpenChange={setOpen}
    >
      <Sheet.Overlay />
      <Sheet.Frame p="$4" justifyContent="center" alignItems="center">
        <YStack gap="$1.5" justifyContent="center" alignItems="center">
          <Text fow="bold">SELECT AN IMAGE FROM...</Text>
          <XStack gap="$1.5">
            <PrimaryBtn
              flex={1}
              flexBasis={0}
              onPress={async () => {
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: true,
                  aspect: [1, 1],
                  quality: 1,
                });

                if (!result.canceled) {
                  setImage(result.assets[0].uri);
                  setOpen(false);
                }
              }}
            >
              <FontAwesome size={36} color={theme.color1.val} name="photo" />
              <Text color={theme.color1.val}>Photo Library</Text>
            </PrimaryBtn>
            <PrimaryBtn
              flex={1}
              flexBasis={0}
              onPress={async () => {
                const result = await ImagePicker.launchCameraAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: true,
                  aspect: [1, 1],
                  quality: 1,
                });

                if (!result.canceled) {
                  setImage(result.assets[0].uri);
                  setOpen(false);
                }
              }}
            >
              <FontAwesome size={36} color={theme.color1.val} name="camera" />
              <Text color={theme.color1.val}>Camera</Text>
            </PrimaryBtn>
          </XStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}
