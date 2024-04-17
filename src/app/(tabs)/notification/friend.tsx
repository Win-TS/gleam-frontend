import { Image as ExpoImage } from "expo-image";
import {
  XStack,
  Separator,
  Avatar,
  Text,
  View,
  useWindowDimensions,
  Button,
} from "tamagui";

import { icons } from "@/assets";
import PageContainer from "@/src/components/PageContainer";
import VerticalList from "@/src/components/VerticalList";
import {
  useAcceptFriendMutation,
  useDeclineFriendMutation,
  useFriendRequestedQuery,
} from "@/src/hooks/user";

const MemberActions = ({ member }: { member: any }) => {
  const acceptFriendMutation = useAcceptFriendMutation(member.id);
  const declineFriendMutation = useDeclineFriendMutation(member.id);
  return (
    <XStack jc="flex-start" ai="center" gap="$1.5">
      <Button
        p="$2"
        chromeless
        onPress={async () => {
          try {
            await acceptFriendMutation.mutateAsync();
          } catch {}
        }}
      >
        <View w="$2.5" h="$2.5" jc="center" ai="center">
          <ExpoImage source={icons.accept} style={{ width: 24, height: 24 }} />
        </View>
      </Button>
      <Button
        p="$2"
        chromeless
        onPress={async () => {
          try {
            // แก้endpoint??
            await declineFriendMutation.mutateAsync();
          } catch {}
        }}
      >
        <View w="$2.5" h="$2.5" jc="center" ai="center">
          <ExpoImage source={icons.reject} style={{ width: 24, height: 24 }} />
        </View>
      </Button>
    </XStack>
  );
};

const FriendRequest = ({ member }: { member: any }) => {
  return (
    <XStack w="100%" p="$2" jc="space-between" ai="center">
      <XStack f={1} fs={1} fd="row" jc="flex-start" ai="center" gap="$3">
        <Avatar f={0} circular size="$4">
          <Avatar.Image src={member.photourl.String} />
          <Avatar.Fallback bc="$color5" />
        </Avatar>
        <Text f={1} fs={1} numberOfLines={1} textOverflow="ellipsis" fos="$3">
          {member.username}
        </Text>
      </XStack>

      <MemberActions member={member} />
    </XStack>
  );
};

export default function FriendNotificationScreen() {
  const { width } = useWindowDimensions();

  const friendRequestedList = useFriendRequestedQuery();

  return (
    <PageContainer>
      <View f={1} w={width - 16} $gtSm={{ maw: 290 }}>
        <VerticalList
          data={friendRequestedList.data?.data}
          numColumns={1}
          ItemSeparatorComponent={() => (
            <Separator w={width} $gtSm={{ maw: "$20" }} boc="$gleam12" />
          )}
          estimatedItemSize={58}
          renderItem={({ item }) => (
            <View w="100%" jc="center" ai="center" $gtSm={{ maw: "$20" }}>
              <FriendRequest member={item} />
            </View>
          )}
        />
      </View>
    </PageContainer>
  );
}
