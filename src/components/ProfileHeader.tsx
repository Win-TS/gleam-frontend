import { Avatar, Text, YStack } from "tamagui";

import { TextStyle } from "@/src/constants/TextStyle";
import { Userprofile } from "@/src/schemas/userprofile";

export default ({ userprofile }: { userprofile: Userprofile }) => {
  return (
    <YStack w="100%" jc="center" ai="center" gap="$3">
      <Avatar circular size="$12" boc="$gleam12" bw="$1">
        <Avatar.Image src={userprofile.photo_url || undefined} />
        <Avatar.Fallback bc="$color5" />
      </Avatar>
      <YStack w="100%" jc="center" ai="center" gap="$1">
        <Text h="$2.5" col="$color11" {...TextStyle.button.large}>
          {userprofile.firstname} {userprofile.lastname}
        </Text>
        <Text col="$color11" {...TextStyle.description}>
          {userprofile.username}
        </Text>
      </YStack>
    </YStack>
  );
};
