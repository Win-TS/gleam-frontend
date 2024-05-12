import { Portal } from "@gorhom/portal";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated } from "react-native";
import PagerView, {
  PagerViewOnPageScrollEventData,
} from "react-native-pager-view";
import { Circle, Sheet, View, Text, XStack, YStack } from "tamagui";

import DullBtn from "@/src/components/DullBtn";
import QueryPlaceholder from "@/src/components/QueryPlaceholder";
import VerticalList from "@/src/components/VerticalList";
import { TextStyle } from "@/src/constants/TextStyle";
import { useTagByCategoryQuery } from "@/src/hooks/hive";
import { Tag } from "@/src/schemas/tag";

const TagList = ({
  categoryId,
  isFocused,
  setTag,
}: {
  categoryId: number;
  isFocused: boolean;
  setTag?: (tag: Tag) => void;
}) => {
  const tagByCategoryQuery = useTagByCategoryQuery(categoryId);

  return (
    <QueryPlaceholder
      query={tagByCategoryQuery}
      spinnerSize="large"
      renderData={(data) => (
        <VerticalList
          data={data}
          numColumns={3}
          ItemSeparatorComponent={() => <View h="$1" />}
          estimatedItemSize={46}
          renderItem={({ item }) => (
            <View f={1} mx="$3">
              <DullBtn
                size="$2"
                w="100%"
                onPress={() => {
                  setTag?.(item);
                }}
              >
                <Text col="$color12" {...TextStyle.button.extraSmall}>
                  {item.tag_name}
                </Text>
              </DullBtn>
            </View>
          )}
          isFocused={isFocused}
        />
      )}
    />
  );
};

export default function ({
  open,
  setOpen,
  setTag,
}: {
  open: boolean;
  setOpen?: (open: boolean) => void;
  setTag?: (tag: Tag) => void;
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
    <Portal hostName="RootPortalHost">
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
                  <Text {...TextStyle.button.large}>{title}</Text>
                  <YStack f={1} w="100%" jc="center" ai="center">
                    <View w="100%" h="100%">
                      <TagList
                        categoryId={index}
                        isFocused={open}
                        setTag={(tag) => {
                          setTag?.(tag);
                          setOpen?.(false);
                        }}
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
