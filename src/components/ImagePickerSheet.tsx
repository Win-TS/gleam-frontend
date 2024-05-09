import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Portal } from "@gorhom/portal";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { XStack, useTheme, Sheet, Text, YStack } from "tamagui";

import PrimaryBtn from "@/src/components/PrimaryBtn";
import { TextStyle } from "@/src/constants/TextStyle";

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
    <Portal hostName="RootPortalHost">
      <Sheet snapPointsMode="fit" open={open} onOpenChange={setOpen}>
        <Sheet.Overlay />
        <Sheet.Frame p="$4" jc="center" ai="center">
          <YStack gap="$1.5" jc="center" ai="center">
            <Text {...TextStyle.button.large}>SELECT AN IMAGE FROM...</Text>
            <XStack gap="$3">
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
                <Text col="$color1" {...TextStyle.button.large}>
                  Photo Library
                </Text>
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
                      cameraStatus.status ===
                      ImagePicker.PermissionStatus.DENIED
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
                <Text col="$color1" {...TextStyle.button.large}>
                  Camera
                </Text>
              </PrimaryBtn>
            </XStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </Portal>
  );
}
