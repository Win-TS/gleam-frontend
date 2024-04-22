import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated } from "react-native";
import PagerView, {
  PagerViewOnPageScrollEventData,
} from "react-native-pager-view";
import { Circle, Sheet, View, Text, XStack, YStack } from "tamagui";

import PrimaryBtn from "@/src/components/PrimaryBtn";
import VerticalList from "@/src/components/VerticalList";
import { Portal } from "@gorhom/portal";

const TagList = ({
  categoryId,
  isFocused,
  setTag,
}: {
  categoryId: number;
  isFocused: boolean;
  setTag: (tagId: number, tagName: string) => void;
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
              setTag(item.tag_id, item.tag_name);
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

export default function ({
  open,
  setOpen,
  setTag,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  setTag: (tagId: number, tagName: string) => void;
}) {
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
  useEffect(() => {
    animatedPagerViewPageScrollPosition.addListener(({ value }) =>
      setPagerViewPageScrollPosition(value),
    );
    return animatedPagerViewPageScrollPosition.removeAllListeners;
  }, []);

  return (
    <Portal>
      <Sheet snapPoints={[80]} open={open} onOpenChange={setOpen}>
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
                        isFocused={open}
                        setTag={setTag}
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
    </Portal>
  );
}
