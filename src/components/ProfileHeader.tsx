import { Image, Text, YStack } from "tamagui";

import { Userprofile } from "@/src/schemas/userprofile";

export default ({ userprofile }: { userprofile: Userprofile }) => {
  return (
    <YStack w="100%" jc="center" ai="center" gap="$3">
      <Image
        source={{
          uri: userprofile.photo_url,
          width: 144,
          height: 144,
        }}
        br={72}
        bw="$1"
        boc="$gleam12"
      />
      <YStack w="100%" jc="center" ai="center" gap="$1">
        <Text h="$2.5" fos="$7" fow="bold" col="$color11">
          {userprofile.firstname} {userprofile.lastname}
        </Text>
        <Text fos="$4" fow="normal" col="$color11">
          {userprofile.username}
        </Text>
      </YStack>
    </YStack>
  );
};
