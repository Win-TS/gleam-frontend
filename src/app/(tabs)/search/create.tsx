import { FontAwesome } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated } from "react-native";
import PagerView, {
  PagerViewOnPageScrollEventData,
} from "react-native-pager-view";
import {
  Text,
  Input,
  YStack,
  Select,
  Separator,
  XStack,
  useTheme,
  View,
  useWindowDimensions,
  Sheet,
  Circle,
} from "tamagui";

import ImagePicker from "@/src/components/ImagePicker";
import PrimaryBtn from "@/src/components/PrimaryBtn";
import PrimarySwitch from "@/src/components/PrimarySwitch";
import VerticalList from "@/src/components/VerticalList";
import { useUserId } from "@/src/stores/user";

type CreateHive = {
  groupName: string;
  groupCreatorId: number;
  photo: string;
  tagId: number;
  frequency: number;
  maxMember: number;
  groupType: string;
  visibility: boolean;
  description: string;
};

const PlusMinusButton = ({
  handleToggle,
}: {
  handleToggle: (value: number) => void;
}) => {
  const [value, setValue] = useState<number>(1);

  return (
    <XStack
      h="$1.5"
      $gtSm={{ maw: "$2.5" }}
      ai="center"
      jc="center"
      bc="$color1"
      br="$8"
      bw="$1"
      boc="$gleam12"
      gap="$3"
    >
      <Text
        col="$red10"
        onPress={() => {
          setValue((value) => value - 1);
          handleToggle(value - 1);
        }}
        disabled={value <= 1}
        mr="$3"
      >
        -
      </Text>
      <Text>{value}</Text>
      <Text
        col="$green10"
        onPress={() => {
          setValue((value) => value + 1);
          handleToggle(value + 1);
        }}
        disabled={value >= 25}
        ml="$3"
      >
        +
      </Text>
    </XStack>
  );
};

const TagList = ({
  categoryId,
  isFocused,
  handlePress,
}: {
  categoryId: number;
  isFocused: boolean;
  handlePress: (tagId: number) => void;
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
              handlePress(item.tag_id);
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

export default function CreateScreen() {
  const { width } = useWindowDimensions();
  const theme = useTheme();
  const [tagSheet, setTagSheet] = useState<boolean>(false);
  const router = useRouter();
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

  const hiveItems = ["Social", "Personal"] as const;
  const groupCreatorId = useUserId();
  const [groupName, setGroupName] = useState<string>("");
  const [photo, setPhoto] = useState<string>("");
  const [tagId, setTagId] = useState<number>(-1);
  const [frequency, setFrequency] = useState<number>(1);
  const [maxMember, setMaxMember] = useState<number>(1);
  const [groupType, setGroupType] = useState<string>("Social");
  const [visibility, setVisibility] = useState<boolean>(true);
  const [description, setDescription] = useState<string>("");

  const handleSetTagId = (tagId: number) => {
    setTagId(tagId);
    setTagSheet(false);
  };

  const createHiveQuery = useMutation<
    AxiosResponse,
    AxiosError<{ message: string }>,
    CreateHive
  >({
    mutationFn: async ({
      groupName,
      groupCreatorId,
      photo,
      tagId,
      frequency,
      maxMember,
      groupType,
      visibility,
      description,
    }: CreateHive) => {
      return await axios.post(
        "/group_v1/group",
        {
          group_name: groupName,
          group_creator_id: groupCreatorId.toString(),
          photo,
          tag_id: tagId.toString(),
          frequency: frequency.toString(),
          max_members: maxMember.toString(),
          group_type: groupType,
          visibility: visibility.toString(),
          description,
        },
        {
          baseURL: process.env.EXPO_PUBLIC_GROUP_API,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
    },
  });

  return (
    <YStack f={1}>
      <YStack
        f={1}
        py="$4"
        bc="$color1"
        jc="flex-start"
        ai="center"
        ov="scroll"
        gap="$3"
        $sm={{ px: "$4" }}
      >
        <ImagePicker size="$10" image={photo} setImage={setPhoto} />
        <Select onValueChange={setGroupType}>
          <Select.Trigger
            fb={0}
            size="$2"
            w="$12"
            bw="$1"
            br="$6"
            boc="$gleam12"
            bc="$color1"
            disabled={tagSheet}
          >
            <XStack jc="center" ai="center" gap="$3">
              <FontAwesome color={theme.color9.val} name="caret-down" />
              <Select.Value
                col="$gleam12"
                size="$3"
                placeholder="Social Hive"
              />
            </XStack>
          </Select.Trigger>

          <Select.Adapt platform="touch">
            <Select.Sheet snapPointsMode="fit" modal>
              <Select.Sheet.Frame>
                <Select.Sheet.ScrollView>
                  <Select.Adapt.Contents />
                </Select.Sheet.ScrollView>
              </Select.Sheet.Frame>
              <Select.Sheet.Overlay />
            </Select.Sheet>
          </Select.Adapt>

          <Select.Content>
            <Select.ScrollUpButton />
            <Select.Viewport>
              <Select.Group>
                {hiveItems.map((item, i) => {
                  return (
                    <Select.Item index={i} key={item} value={item}>
                      <Select.ItemText>{item}</Select.ItemText>
                      <Select.ItemIndicator ml="auto">
                        <FontAwesome name="check" />
                      </Select.ItemIndicator>
                    </Select.Item>
                  );
                })}
              </Select.Group>
            </Select.Viewport>
            <Select.ScrollDownButton />
          </Select.Content>
        </Select>
        <Input
          w="100%"
          $gtSm={{ maw: "$20" }}
          placeholder="NAME YOUR HIVE"
          bc="$gleam1"
          onChangeText={setGroupName}
        />
        <Input
          h="$12"
          w="100%"
          $gtSm={{ maw: "$20" }}
          placeholder="Enter short description..."
          bc="$gleam1"
          multiline
          onChangeText={setDescription}
        />
        <Separator w={width} boc="$gleam12" $gtSm={{ maxWidth: "$20" }} />
        <YStack w="100%" jc="center" gap="$1" $gtSm={{ maw: "$20" }}>
          <Text f={1} col="$color12" fos="$5" onPress={() => setTagSheet(true)}>
            TAG
          </Text>
          <Text f={1} col="$color11" fos="$2">
            Select a tag
          </Text>
        </YStack>
        <Separator w={width} boc="$gleam12" $gtSm={{ maw: "$20" }} />
        <XStack w="100%" ai="center" gap="$3" $gtSm={{ maw: "$20" }}>
          <Text f={1} col="$color12" fos="$5">
            VISIBILITY
          </Text>
          <PrimarySwitch checked={visibility} onCheckedChange={setVisibility} />
        </XStack>
        <Separator w={width} boc="$gleam12" $gtSm={{ maw: "$20" }} />
        <XStack w="100%" ai="center" gap="$3" $gtSm={{ maw: "$20" }}>
          <Text f={1} col="$color12" fos="$5">
            STREAK FREQUENCY
          </Text>
          <PlusMinusButton handleToggle={setFrequency} />
        </XStack>
        <Separator w={width} boc="$gleam12" $gtSm={{ maw: "$20" }} />
        <XStack w="100%" ai="center" gap="$3" $gtSm={{ maw: "$20" }}>
          <Text f={1} col="$color12" fos="$5">
            MAXIMUM MEMBER
          </Text>
          <PlusMinusButton handleToggle={setMaxMember} />
        </XStack>
        <Separator w={width} boc="$gleam12" $gtSm={{ maw: "$20" }} />
        <PrimaryBtn
          size="$5"
          w="$20"
          mt="$8"
          onPress={() => {
            createHiveQuery.mutate({
              groupName,
              groupCreatorId,
              photo,
              tagId,
              frequency,
              maxMember,
              groupType,
              visibility,
              description,
            });
            router.push("/(tabs)/search");
          }}
        >
          DONE
        </PrimaryBtn>
      </YStack>
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
    </YStack>
  );
}
