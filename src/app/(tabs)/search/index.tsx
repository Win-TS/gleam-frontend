import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable } from "react-native";
import {
  Text,
  View,
  XStack,
  YStack,
  ZStack,
  useTheme,
  useWindowDimensions,
} from "tamagui";

import { Icon } from "@/assets";
import HiveBtn from "@/src/components/HiveBtn";
import PageContainer from "@/src/components/PageContainer";
import PrimaryBtn from "@/src/components/PrimaryBtn";
import QueryPlaceholder from "@/src/components/QueryPlaceholder";
import SecondaryBtn from "@/src/components/SecondaryBtn";
import SecondaryInput from "@/src/components/SecondaryInput";
import TagPickerSheet from "@/src/components/TagPickerSheet";
import VerticalList from "@/src/components/VerticalList";
import { TextStyle } from "@/src/constants/TextStyle";
import {
  useHiveByTagQuery,
  useHiveListInfiniteQuery,
  useSearchHiveListInfiniteQuery,
} from "@/src/hooks/hive";
import { Tag } from "@/src/schemas/tag";

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
        <Text {...TextStyle.button.large}>CREATE NEW HIVE</Text>
      </YStack>
      <YStack w="100%">
        <Pressable onPress={() => router.push("/(tabs)/search/create")}>
          <ZStack w="$10" aspectRatio={1} jc="center" ai="center">
            <View w="100%" aspectRatio={1} br="$4" bc="#bbbbbb"></View>
            <View w="100%" aspectRatio={1} jc="center" ai="center">
              <FontAwesome name="plus" color={theme.color1.val} size={48} />
            </View>
          </ZStack>
        </Pressable>
      </YStack>
      <YStack w="100%">
        <Text {...TextStyle.button.large}>EXPLORE</Text>
      </YStack>
      <View f={1} w={width} $gtSm={{ maw: "$20" }}>
        <VerticalList
          data={flattenedHiveList}
          numColumns={3}
          ItemSeparatorComponent={() => <View h="$0.75" />}
          estimatedItemSize={143}
          onEndReached={hiveListInfiniteQuery.fetchNextPage}
          renderItem={({ item }) => (
            <View f={1} mx="$1.5">
              <HiveBtn
                hive={item}
                onPress={() =>
                  router.push({
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
    <View f={1} w={width} $gtSm={{ maw: "$20" }}>
      <VerticalList
        data={flattenedHiveList}
        numColumns={3}
        ItemSeparatorComponent={() => <View h="$0.75" />}
        estimatedItemSize={143}
        onEndReached={searchHiveListInfiniteQuery.fetchNextPage}
        renderItem={({ item }) => (
          <View f={1} mx="$1.5">
            <HiveBtn
              hive={item}
              onPress={() =>
                router.push({
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

const TagHiveList = ({ tagId }: { tagId: number }) => {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const hiveByTagQuery = useHiveByTagQuery(tagId);

  return (
    <QueryPlaceholder
      query={hiveByTagQuery}
      spinnerSize="large"
      renderData={(data) => (
        <View f={1} w={width} $gtSm={{ maw: "$20" }}>
          <VerticalList
            data={data}
            numColumns={3}
            ItemSeparatorComponent={() => <View h="$0.75" />}
            estimatedItemSize={143}
            renderItem={({ item }) => (
              <View f={1} mx="$1.5">
                <HiveBtn
                  hive={item}
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/home/hive/[id]/",
                      params: { id: item.group_id },
                    })
                  }
                />
              </View>
            )}
          />
        </View>
      )}
    />
  );
};

export default function SearchScreen() {
  const [search, setSearch] = useState("");
  const [tagSheet, setTagSheet] = useState<boolean>(false);
  const [tag, setTag] = useState<Tag>();

  return (
    <PageContainer justifyContent="flex-start">
      <SecondaryInput
        w="100%"
        placeholder="What're you looking for?"
        value={search}
        onChangeText={(value) => {
          setTag(undefined);
          setSearch(value);
        }}
      />
      <XStack w="100%" gap="$3">
        <PrimaryBtn f={1} br="$4" onPress={() => setTagSheet(true)}>
          <Text col="$color1" {...TextStyle.button.small}>
            {tag ? tag.tag_name : "Search by tag"}
          </Text>
        </PrimaryBtn>
        {tag ? (
          <SecondaryBtn br="$4" px="$3" onPress={() => setTag(undefined)}>
            <Icon name="reject"></Icon>
          </SecondaryBtn>
        ) : undefined}
      </XStack>
      {tag ? (
        <TagHiveList tagId={tag.tag_id} />
      ) : search ? (
        <SearchHiveList search={search} />
      ) : (
        <ExploreHiveList />
      )}
      <TagPickerSheet
        open={tagSheet}
        setOpen={setTagSheet}
        setTag={(tag) => {
          setSearch("");
          setTag(tag);
        }}
      />
    </PageContainer>
  );
}
