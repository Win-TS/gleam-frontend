import { useMemo } from "react";
import {
  XStack,
  Separator,
  Avatar,
  Text,
  View,
  useWindowDimensions,
  Button,
} from "tamagui";

import { Icon } from "@/assets";
import PageContainer from "@/src/components/PageContainer";
import VerticalList from "@/src/components/VerticalList";
import { TextStyle } from "@/src/constants/TextStyle";
import {
  useAcceptFriendMutation,
  useDeclineFriendMutation,
  useFriendRequestListInfiniteQuery,
} from "@/src/hooks/user";
import { User } from "@/src/schemas/user";

const FriendRequestActions = ({ user }: { user: User }) => {
  const acceptFriendMutation = useAcceptFriendMutation(user.id);
  const declineFriendMutation = useDeclineFriendMutation(user.id);

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
          <Icon name="accept" />
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
          <Icon name="reject" />
        </View>
      </Button>
    </XStack>
  );
};

const FriendRequest = ({ user }: { user: User }) => {
  return (
    <XStack w="100%" p="$2" jc="space-between" ai="center">
      <XStack f={1} fs={1} fd="row" jc="flex-start" ai="center" gap="$3">
        <Avatar f={0} circular size="$4">
          <Avatar.Image src={user.photourl.String || undefined} />
          <Avatar.Fallback bc="$color5" />
        </Avatar>
        <Text
          f={1}
          fs={1}
          numberOfLines={1}
          {...TextStyle.button.small}
          textOverflow="ellipsis"
        >
          {user.username}
        </Text>
      </XStack>

      <FriendRequestActions user={user} />
    </XStack>
  );
};

export default function FriendNotificationScreen() {
  const { width } = useWindowDimensions();

  const friendRequestListInfiniteQuery = useFriendRequestListInfiniteQuery();

  const flattenedFriendRequestList = useMemo(
    () =>
      friendRequestListInfiniteQuery.data?.pages.flatMap(({ data }) => data) ??
      [],
    [friendRequestListInfiniteQuery.data],
  );

  return (
    <PageContainer>
      <View w="100%" h="100%">
        <VerticalList
          data={flattenedFriendRequestList}
          numColumns={1}
          ItemSeparatorComponent={() => (
            <Separator w={width} $gtSm={{ maw: "$20" }} boc="$gleam12" />
          )}
          estimatedItemSize={58}
          onEndReached={friendRequestListInfiniteQuery.fetchNextPage}
          renderItem={({ item }) => (
            <View w="100%" jc="center" ai="center">
              <FriendRequest user={item} />
            </View>
          )}
        />
      </View>
    </PageContainer>
  );
}
