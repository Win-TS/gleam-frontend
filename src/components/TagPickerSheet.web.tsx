import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import React from "react";
import { Sheet, View, Text, YStack } from "tamagui";

import PrimaryBtn from "@/src/components/PrimaryBtn";
import VerticalList from "@/src/components/VerticalList";

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
  setTag: (tagId: number) => void;
}) {
  const tagCategories = [
    "Sports and Fitness",
    "Learning and Development",
    "Health and Wellness",
    "Entertainment and Media",
    "Hobbies and Leisure",
    "Others",
  ];

  return (
    <Sheet
      forceRemoveScrollEnabled={open}
      snapPoints={[80]}
      modal
      open={open}
      onOpenChange={setOpen}
    >
      <Sheet.Overlay />
      <Sheet.Frame p="$4" jc="center" ai="center" bc="$color1" gap="$3">
        <YStack f={1} w="100%">
          {tagCategories.map((title, index) => (
            <YStack f={1} w="100%" jc="center" ai="center" gap="$3" key={index}>
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
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}
