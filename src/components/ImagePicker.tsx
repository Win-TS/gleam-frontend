import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import { Pressable } from "react-native";
import { View, ZStack, XStack, useTheme, Image, Circle } from "tamagui";

export default function ({
  image,
  setImage,
}: {
  image?: string;
  setImage: (image: string) => void;
}) {
  const theme = useTheme();
  return (
    <ZStack w="$12" h="$12">
      {image && URL.canParse(image) ? (
        <Image
          source={{ width: 144, height: 144, uri: image }}
          br={72}
          borderColor="$gleam12"
          bw="$1"
        />
      ) : (
        <Circle w="$12" h="$12" bc="$color5" borderColor="$gleam12" bw="$1" />
      )}
      <View w="$12" h="$12" justifyContent="center" alignItems="center">
        <XStack gap="$1.5">
          <Pressable
            onPress={async () => {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
              });

              if (!result.canceled) {
                setImage(result.assets[0].uri);
              }
            }}
          >
            <ZStack
              w="$6"
              h="$6"
              borderColor="$gleam12"
              borderRadius="$12"
              bw="$1"
            >
              <View
                w="100%"
                h="100%"
                borderRadius="$12"
                backgroundColor="$color1"
                opacity={0.5}
              />
              <View
                w="100%"
                h="100%"
                borderRadius="$12"
                justifyContent="center"
                alignItems="center"
              >
                <FontAwesome size={36} color={theme.gleam12.val} name="photo" />
              </View>
            </ZStack>
          </Pressable>
          <Pressable
            onPress={async () => {
              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
              });

              if (!result.canceled) {
                setImage(result.assets[0].uri);
              }
            }}
          >
            <ZStack
              w="$6"
              h="$6"
              borderColor="$gleam12"
              borderRadius="$12"
              bw="$1"
            >
              <View
                w="100%"
                h="100%"
                borderRadius="$12"
                backgroundColor="$color1"
                opacity={0.5}
              />
              <View
                w="100%"
                h="100%"
                borderRadius="$12"
                justifyContent="center"
                alignItems="center"
              >
                <FontAwesome
                  size={36}
                  color={theme.gleam12.val}
                  name="camera"
                />
              </View>
            </ZStack>
          </Pressable>
        </XStack>
      </View>
    </ZStack>
  );
}
