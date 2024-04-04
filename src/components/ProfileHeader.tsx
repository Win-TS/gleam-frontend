import { Image, Text, YStack } from "tamagui";

import { Userprofile } from "@/src/schemas/userprofile";

export default ({ userprofile }: { userprofile: Userprofile }) => {
  return (
    <YStack w="100%" justifyContent="center" alignItems="center" gap="$3">
      <Image
        source={{
          uri: userprofile.photo_url,
          width: 144,
          height: 144,
        }}
        br={72}
        borderColor="$gleam12"
        bw="$1"
      />
      <YStack w="100%" justifyContent="center" alignItems="center" gap="$1">
        <Text h="$2.5" fontSize="$7" fontWeight="bold" color="$color11">
          {userprofile.firstname} {userprofile.lastname}
        </Text>
        <Text fontSize="$4" fontWeight="normal" color="$color11">
          {userprofile.username}
        </Text>
      </YStack>
    </YStack>
  );
};
