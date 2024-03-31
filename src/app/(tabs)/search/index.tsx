import { Link } from "expo-router";
import React, { useMemo } from "react";
import { Dimensions } from "react-native";
import { Button, Input, Text, View, YStack, ZStack } from "tamagui";

import HiveBtn from "@/src/components/HiveBtn";
import VerticalList from "@/src/components/VerticalList";
import { useHiveListInfiniteQuery } from "@/src/hooks/hive";

const JoinHiveList = () => {
  const hiveListInfiniteQuery = useHiveListInfiniteQuery();

  const flattenedHiveList = useMemo(
    () => hiveListInfiniteQuery.data?.pages.flatMap(({ data }) => data) ?? [],
    [hiveListInfiniteQuery.data],
  );

  return (
    <>
      <YStack w="100%" $gtSm={{ maxWidth: "$20" }}>
        <Text>EXPLORE</Text>
      </YStack>
      <View
        flex={1}
        w={Math.min(Dimensions.get("window").width - 16)}
        $gtSm={{ maxWidth: 290 }}
      >
        <VerticalList
          data={flattenedHiveList}
          numColumns={3}
          ItemSeparatorComponent={() => <View h="$0.75" />}
          estimatedItemSize={
            Math.min(Dimensions.get("window").width - 32, 290) / 3 + 16
          }
          onEndReached={hiveListInfiniteQuery.fetchNextPage}
          renderItem={({ item }) => (
            <View flex={1} paddingHorizontal="$1.5">
              <HiveBtn hive={item} />
            </View>
          )}
        />
      </View>
    </>
  );
};

export default function SearchScreen() {
  return (
    <View
      flex={1}
      paddingVertical="$4"
      backgroundColor="$color1"
      justifyContent="flex-start"
      alignItems="center"
      overflow="scroll"
      gap="$3"
      $sm={{ paddingHorizontal: "$4" }}
    >
      <Input
        size="$3"
        w="100%"
        borderWidth="$1"
        borderRadius="$6"
        placeholder="What're you looking for?"
        $gtSm={{ maxWidth: "$20" }}
      />

      <YStack w="100%" $gtSm={{ maxWidth: "$20" }}>
        <Text>CREATE NEW HIVE</Text>
        <Link href="/(tabs)/search/create" asChild>
          <Button w="$10" aspectRatio={1} unstyled>
            <ZStack
              w="100%"
              aspectRatio={1}
              justifyContent="center"
              alignItems="center"
            >
              <View
                w="100%"
                aspectRatio={1}
                borderRadius="$4"
                backgroundColor="#bbbbbb"
              ></View>
              <View
                w="100%"
                aspectRatio={1}
                justifyContent="center"
                alignItems="center"
              >
                <Text>+</Text>
              </View>
            </ZStack>
          </Button>
        </Link>
      </YStack>

      <JoinHiveList />
    </View>
  );
}
