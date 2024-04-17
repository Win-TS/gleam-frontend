import { useMemo, useState } from "react";
import { Dimensions, useWindowDimensions } from "react-native";
import { Avatar, Input, Separator, View, XStack, Text, YStack } from "tamagui";

import PageContainer from "@/src/components/PageContainer";
import VerticalList from "@/src/components/VerticalList";
import { useFriendListInfiniteQuery } from "@/src/hooks/user";
import { useUserId } from "@/src/stores/user";

const FriendList = ({ name, url }: { name: string; url: string }) => {
  return (
    <XStack w="100%" alignItems="center" gap="$2.5" my="$2" mx="$2.5">
      <Avatar circular size="$4">
        <Avatar.Image src={url} />
        <Avatar.Fallback bc="$color5" />
      </Avatar>
      <Text>{name}</Text>
    </XStack>
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
        renderItem={({ item, index }: { item: any; index: number }) => (
          <View flex={1} paddingHorizontal="$1.5">
            <FriendList
              name={item.username}
              url={item.photourl.String}
              key={index}
            />
          </View>
        )}
      />
    </PageContainer>
  );
}
