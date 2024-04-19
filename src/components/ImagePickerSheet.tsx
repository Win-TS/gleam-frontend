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

  const [cameraStatus, requestCameraPermission] =
    ImagePicker.useCameraPermissions();

  return (
    <Sheet
      forceRemoveScrollEnabled={open}
      snapPointsMode="fit"
      modal
      open={open}
      onOpenChange={setOpen}
    >
      <Sheet.Overlay />
      <Sheet.Frame p="$4" jc="center" ai="center">
        <YStack gap="$1.5" jc="center" ai="center">
          <Text fow="bold">SELECT AN IMAGE FROM...</Text>
          <XStack gap="$1.5">
            <PrimaryBtn
              f={1}
              fb={0}
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
              <Text col={theme.color1.val}>Photo Library</Text>
            </PrimaryBtn>
            <PrimaryBtn
              f={1}
              fb={0}
              onPress={async () => {
                if (cameraStatus) {
                  if (
                    cameraStatus.status ===
                      ImagePicker.PermissionStatus.UNDETERMINED ||
                    (cameraStatus.status ===
                      ImagePicker.PermissionStatus.DENIED &&
                      cameraStatus.canAskAgain)
                  ) {
                    await requestCameraPermission();
                  }
                  if (
                    cameraStatus.status === ImagePicker.PermissionStatus.DENIED
                  ) {
                    return;
                  }

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
                }
              }}
            >
              <FontAwesome size={36} color={theme.color1.val} name="camera" />
              <Text col={theme.color1.val}>Camera</Text>
            </PrimaryBtn>
          </XStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}
