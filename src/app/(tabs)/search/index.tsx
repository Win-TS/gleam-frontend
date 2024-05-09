import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable } from "react-native";
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
import QueryPlaceholder from "@/src/components/QueryPlaceholder";
import TagPickerSheet from "@/src/components/TagPickerSheet";
import VerticalList from "@/src/components/VerticalList";
import { TextStyle } from "@/src/constants/TextStyle";
import {
  useHiveByTagQuery,
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

const SearchHiveByTag = ({ tagId }: { tagId: number }) => {
  const theme = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const hiveByTagQuery = useHiveByTagQuery(tagId);

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
        )}
      />
    </>
  );
};

export default function SearchScreen() {
  const [search, setSearch] = useState("");
  const [tagSheet, setTagSheet] = useState<boolean>(false);
  const [searchTagBtn, setSearchTagBtn] = useState("Search by tag");
  const [tagId, setTagId] = useState<number>(-1);

  const handleSearch = (input: string) => {
    setTagId(-1);
    setSearch(input);
  };

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
          onChangeText={(newValue) => handleSearch(newValue)}
        />
      </YStack>
      <Button
        borderWidth="$1"
        borderRadius="$5"
        backgroundColor="$gleam12"
        borderColor="$gleam12"
        color="$color1"
        fontWeight="bold"
        w="100%"
        onPress={() => setTagSheet(true)}
      >
        {searchTagBtn}
      </Button>
      {tagId !== -1 ? (
        <SearchHiveByTag tagId={tagId} />
      ) : search ? (
        <SearchHiveList search={search} />
      ) : (
        <ExploreHiveList />
      )}
      <TagPickerSheet
        open={tagSheet}
        setOpen={setTagSheet}
        setTag={(tagId, tagName) => {
          setTagId(tagId);
          setSearchTagBtn(tagName);
          setTagSheet(false);
        }}
      />
    </PageContainer>
  );
}
