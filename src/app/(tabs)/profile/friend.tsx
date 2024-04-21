import { useMemo, useState } from "react";
import { Dimensions, Pressable, useWindowDimensions } from "react-native";
import { Avatar, Input, Separator, View, XStack, Text, YStack } from "tamagui";

import PageContainer from "@/src/components/PageContainer";
import VerticalList from "@/src/components/VerticalList";
import { useRouteToProfile } from "@/src/hooks/useRouteToProfile";
import { useFriendListInfiniteQuery } from "@/src/hooks/user";
import { useUserId } from "@/src/stores/user";

const FriendList = ({
  name,
  url,
  userId,
}: {
  name: string;
  url: string;
  userId: number;
}) => {
  const routeToProfile = useRouteToProfile(userId);

  return (
    <Pressable onPress={routeToProfile}>
      <XStack w="100%" alignItems="center" gap="$2.5" my="$2" mx="$2.5">
        <Avatar circular size="$4">
          <Avatar.Image src={url || undefined} />
          <Avatar.Fallback bc="$color5" />
        </Avatar>
        <Text>{name}</Text>
      </XStack>
    </Pressable>
  );
};

export default function FriendListScreen() {
  const { width } = useWindowDimensions();
  const userId = useUserId();

  const friendListInfiniteQuery = useFriendListInfiniteQuery(userId);
  const flattenedFriendList = useMemo(
    () => friendListInfiniteQuery.data?.pages.flatMap(({ data }) => data) ?? [],
    [friendListInfiniteQuery.data],
  );

  const [search, setSearch] = useState("");

  return (
    <PageContainer>
      <YStack h="$3" w="100%">
        <Input
          size="$3"
          w="100%"
          borderWidth="$1"
          borderRadius="$6"
          placeholder="What're you looking for?"
          value={search}
          onChangeText={setSearch}
        />
      </YStack>
      <YStack f={1} w="100%">
        <VerticalList
          data={flattenedFriendList}
          numColumns={1}
          ItemSeparatorComponent={() => (
            <Separator
              w={width}
              $gtSm={{ maxWidth: "$20" }}
              borderColor="$gleam12"
            />
          )}
          estimatedItemSize={Dimensions.get("window").width}
          onEndReached={friendListInfiniteQuery.fetchNextPage}
          renderItem={({ item }) => (
            <View flex={1} paddingHorizontal="$1.5">
              <FriendList
                name={item.username}
                url={item.photourl.String}
                userId={item.id}
              />
            </View>
          )}
        />
      </YStack>
    </PageContainer>
  );
}
