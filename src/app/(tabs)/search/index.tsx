import { FontAwesome } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Button,
  Input,
  Text,
  View,
  YStack,
  ZStack,
  useTheme,
  useWindowDimensions,
} from "tamagui";

import HiveBtn from "@/src/components/HiveBtn";
import PageContainer from "@/src/components/PageContainer";
import VerticalList from "@/src/components/VerticalList";
import {
  useHiveListInfiniteQuery,
  useSearchHiveListInfiniteQuery,
} from "@/src/hooks/hive";

const ExploreHiveList = () => {
  const theme = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const hiveListInfiniteQuery = useHiveListInfiniteQuery();

  const flattenedHiveList = useMemo(
    () => hiveListInfiniteQuery.data?.pages.flatMap(({ data }) => data) ?? [],
    [hiveListInfiniteQuery.data],
  );

  return (
    <>
      <YStack w="100%">
        <Text>CREATE NEW HIVE</Text>
      </YStack>
      <YStack w="100%">
        <Link href="/(tabs)/search/create" asChild>
          <Button w="$10" aspectRatio={1} unstyled>
            <ZStack w="100%" aspectRatio={1} jc="center" ai="center">
              <View w="100%" aspectRatio={1} br="$4" bc="#bbbbbb"></View>
              <View w="100%" aspectRatio={1} jc="center" ai="center">
                <FontAwesome name="plus" color={theme.color1.val} size={48} />
              </View>
            </ZStack>
          </Button>
        </Link>
      </YStack>
      <YStack w="100%">
        <Text>EXPLORE</Text>
      </YStack>
      <View f={1} w={width - 16} $gtSm={{ maw: 290 }}>
        <VerticalList
          data={flattenedHiveList}
          numColumns={3}
          ItemSeparatorComponent={() => <View h="$0.75" />}
          estimatedItemSize={Math.min(width - 32, 290) / 3 + 16}
          onEndReached={hiveListInfiniteQuery.fetchNextPage}
          renderItem={({ item }) => (
            <View f={1} px="$1.5">
              <HiveBtn
                hive={item}
                onPress={() =>
                  router.replace({
                    pathname: "/(tabs)/home/hive/[id]/",
                    params: { id: item.group_id },
                  })
                }
              />
            </View>
          )}
        />
      </View>
    </>
  );
};

const SearchHiveList = ({ search }: { search: string }) => {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const searchHiveListInfiniteQuery = useSearchHiveListInfiniteQuery(search);

  const flattenedHiveList = useMemo(
    () =>
      searchHiveListInfiniteQuery.data?.pages.flatMap(({ data }) => data) ?? [],
    [searchHiveListInfiniteQuery.data],
  );

  return (
    <View f={1} w={width - 16} $gtSm={{ maw: 290 }}>
      <VerticalList
        data={flattenedHiveList}
        numColumns={3}
        ItemSeparatorComponent={() => <View h="$0.75" />}
        estimatedItemSize={Math.min(width - 32, 290) / 3 + 16}
        onEndReached={searchHiveListInfiniteQuery.fetchNextPage}
        renderItem={({ item }) => (
          <View f={1} px="$1.5">
            <HiveBtn
              hive={item}
              onPress={() =>
                router.replace({
                  pathname: "/(tabs)/home/hive/[id]/",
                  params: { id: item.group_id },
                })
              }
            />
          </View>
        )}
      />
    </View>
  );
};

export default function SearchScreen() {
  const [search, setSearch] = useState("");

  return (
    <PageContainer>
      <YStack h="$3" w="100%">
        <Input
          size="$3"
          w="100%"
          bw="$1"
          br="$6"
          placeholder="What're you looking for?"
          value={search}
          onChangeText={setSearch}
        />
      </YStack>

      {search ? <SearchHiveList search={search} /> : <ExploreHiveList />}
    </PageContainer>
  );
}
