import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, useWindowDimensions } from "react-native";
import { Avatar, Input, Separator, View, XStack, YStack, Text } from "tamagui";
import { z } from "zod";

import PageContainer from "@/src/components/PageContainer";
import VerticalList from "@/src/components/VerticalList";
import { TextStyle } from "@/src/constants/TextStyle";
import { useRouteToProfile } from "@/src/hooks/useRouteToProfile";
import { useFriendListInfiniteQuery } from "@/src/hooks/user";

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
        <Text {...TextStyle.button.small}>{name}</Text>
      </XStack>
    </Pressable>
  );
};

const params = z.object({
  id: z.coerce.number(),
});

export default function FriendListScreen() {
  const { width } = useWindowDimensions();

  const { id: userId } = params.parse(useLocalSearchParams());

  const [search, setSearch] = useState("");

  const friendListInfiniteQuery = useFriendListInfiniteQuery(userId);
  const flattenedFriendList = useMemo(
    () => friendListInfiniteQuery.data?.pages.flatMap(({ data }) => data) ?? [],
    [friendListInfiniteQuery.data],
  );

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
