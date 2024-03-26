import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useMemo } from "react";
import { Dimensions } from "react-native";
import { Input, Text, View, YStack } from "tamagui";
import * as z from "zod";

import HiveBtn from "@/src/components/HiveBtn";
import VerticalList from "@/src/components/VerticalList";
import { hive_ } from "@/src/schemas/hive";

const JoinHiveList = () => {
  const publicHiveInfiniteQuery = useInfiniteQuery({
    queryKey: ["publichive"],
    queryFn: async ({ pageParam }) => {
      const data = await z.array(hive_).parseAsync(
        (
          await axios.get("/group_v1/listgroups", {
            params: { limit: 12, offset: pageParam },
            baseURL: process.env.EXPO_PUBLIC_GROUP_API,
          })
        ).data,
      );
      const calcPreviousOffset = Math.max(0, pageParam - 12);
      const calcNextOffset = pageParam + data.length;
      return {
        data,
        previousOffset:
          calcPreviousOffset !== pageParam ? calcPreviousOffset : undefined,
        nextOffset: calcNextOffset !== pageParam ? calcNextOffset : undefined,
      };
    },
    initialPageParam: 0,
    getPreviousPageParam: (firstPage) => firstPage.previousOffset ?? undefined,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
  });

  const flattenedPublicHives = useMemo(
    () => publicHiveInfiniteQuery.data?.pages.flatMap(({ data }) => data) ?? [],
    [publicHiveInfiniteQuery.data],
  );

  return (
    <>
      <YStack w="100%" $gtSm={{ maxWidth: "$20" }}>
        <Text>JOIN HIVE</Text>
      </YStack>
      <View
        flex={1}
        w={Math.min(Dimensions.get("window").width - 16)}
        $gtSm={{ maxWidth: 290 }}
      >
        <VerticalList
          data={flattenedPublicHives}
          numColumns={3}
          ItemSeparatorComponent={() => <View h="$0.75" />}
          estimatedItemSize={
            Math.min(Dimensions.get("window").width - 32, 290) / 3 + 16
          }
          onEndReached={publicHiveInfiniteQuery.fetchNextPage}
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

      <JoinHiveList />
    </View>
  );
}
