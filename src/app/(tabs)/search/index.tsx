import { FontAwesome } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable } from "react-native";
import PagerView, {
  PagerViewOnPageScrollEventData,
} from "react-native-pager-view";
import {
  Button,
  Circle,
  Input,
  Sheet,
  Text,
  View,
  XStack,
  YStack,
  ZStack,
  useTheme,
  useWindowDimensions,
} from "tamagui";

import HiveBtn from "@/src/components/HiveBtn";
import HiveByTagBtn from "@/src/components/HiveByTagBtn";
import PageContainer from "@/src/components/PageContainer";
import PrimaryBtn from "@/src/components/PrimaryBtn";
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

const SearchHiveByTag = ({ tagId }: { tagId: number }) => {
  const theme = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const useGroupByTagQuery = (tagId: number) => {
    return useQuery<any, AxiosError<{ message: string }>>({
      queryKey: ["group", tagId],
      queryFn: async () => {
        return await axios.get("/tag_v1/groupswithtag", {
          baseURL: process.env.EXPO_PUBLIC_GROUP_API,
          params: { tag_id: tagId },
        });
      },
    });
  };
  const groupByTag = useGroupByTagQuery(tagId);

  return (
    <>
      <YStack w="100%">
        <Text>CREATE NEW HIVE</Text>
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
        <Text>EXPLORE</Text>
      </YStack>
      <View f={1} w={width - 16} $gtSm={{ maw: 290 }}>
        <VerticalList
          data={groupByTag.data?.data}
          numColumns={3}
          ItemSeparatorComponent={() => <View h="$0.75" />}
          estimatedItemSize={Math.min(width - 32, 290) / 3 + 16}
          renderItem={({ item }: { item: any }) => (
            <View f={1} px="$1.5">
              <HiveByTagBtn
                group_name={item.group_name}
                hiveImg={item.photo_url.String}
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
const TagList = ({
  categoryId,
  isFocused,
  handlePress,
}: {
  categoryId: number;
  isFocused: boolean;
  handlePress: (tagId: number, tagName: string) => void;
}) => {
  const useTagByCatQuery = (categoryId: number) => {
    return useQuery<any, AxiosError<{ message: string }>>({
      queryKey: ["tag", "category", categoryId],
      queryFn: async () => {
        return await axios.get("/tag_v1/tagbycategory", {
          baseURL: process.env.EXPO_PUBLIC_GROUP_API,
          params: { category_id: categoryId },
        });
      },
    });
  };
  const tagFromCat = useTagByCatQuery(categoryId);

  return (
    <VerticalList
      data={tagFromCat.data?.data}
      numColumns={3}
      ItemSeparatorComponent={() => <View h="$1" />}
      estimatedItemSize={46}
      renderItem={({ item }: { item: any }) => (
        <View f={1} px="$3">
          <PrimaryBtn
            size="$2"
            w="100%"
            onPress={() => {
              handlePress(item.tag_id, item.tag_name);
            }}
          >
            {item.tag_name}
          </PrimaryBtn>
        </View>
      )}
      isFocused={isFocused}
    />
  );
};

export default function SearchScreen() {
  const [search, setSearch] = useState("");
  const [tagSheet, setTagSheet] = useState<boolean>(false);
  const [searchTagBtn, setSearchTagBtn] = useState("Search by tag");
  const [tagId, setTagId] = useState<number>(-1);
  const tagCategories = [
    "Sports and Fitness",
    "Learning and Development",
    "Health and Wellness",
    "Entertainment and Media",
    "Hobbies and Leisure",
    "Others",
  ];

  const pagerViewRef = useRef<PagerView>(null);
  const [pagerViewPageScrollPosition, setPagerViewPageScrollPosition] =
    useState(0);
  const animatedPagerViewPageScrollPosition = useRef(
    new Animated.Value(0),
  ).current;
  const onPagerViewPageScroll = useMemo(
    () =>
      Animated.event<PagerViewOnPageScrollEventData>([
        {
          nativeEvent: {
            position: animatedPagerViewPageScrollPosition,
          },
        },
      ]),
    [],
  );

  const handleSetTagId = (tagId: number, tagName: string) => {
    setTagId(tagId);
    setSearchTagBtn(tagName);
    setTagSheet(false);
  };

  const handleSearch = (input: string) => {
    setTagId(-1);
    setSearch(input);
  };

  useEffect(() => {
    animatedPagerViewPageScrollPosition.addListener(({ value }) =>
      setPagerViewPageScrollPosition(value),
    );
    return animatedPagerViewPageScrollPosition.removeAllListeners;
  }, []);

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
      <Sheet
        forceRemoveScrollEnabled={tagSheet}
        snapPoints={[80]}
        modal
        open={tagSheet}
        onOpenChange={setTagSheet}
      >
        <Sheet.Overlay />
        <Sheet.Frame p="$4" jc="center" ai="center" bc="$color1" gap="$3">
          <YStack f={1} w="100%">
            <PagerView
              ref={pagerViewRef}
              style={{ width: "100%", height: "100%" }}
              initialPage={0}
              onPageScroll={onPagerViewPageScroll}
            >
              {tagCategories.map((title, index) => (
                <YStack
                  f={1}
                  w="100%"
                  jc="center"
                  ai="center"
                  gap="$3"
                  key={index}
                >
                  <Text>{title}</Text>
                  <YStack f={1} w="100%" jc="center" ai="center">
                    <View w="100%" h="100%">
                      <TagList
                        categoryId={index}
                        isFocused={tagSheet}
                        handlePress={handleSetTagId}
                      />
                    </View>
                  </YStack>
                </YStack>
              ))}
            </PagerView>
          </YStack>
          <XStack gap="$2.5">
            {tagCategories.map((_, index) => (
              <Circle
                size="$1"
                bc={
                  index === pagerViewPageScrollPosition ? "$gleam12" : "$color4"
                }
                key={index}
                onPress={() => pagerViewRef.current?.setPage(index)}
              />
            ))}
          </XStack>
        </Sheet.Frame>
      </Sheet>
    </PageContainer>
  );
}
