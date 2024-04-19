import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Text, View, YStack, useWindowDimensions } from "tamagui";
import * as z from "zod";

import HiveBtn from "@/src/components/HiveBtn";
import SecondaryInput from "@/src/components/SecondaryInput";
import VerticalList from "@/src/components/VerticalList";
import { hive_ } from "@/src/schemas/hive";

const JoinHiveList = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();

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
    gcTime: 5,
  });

  const flattenedPublicHives = useMemo(
    () => publicHiveInfiniteQuery.data?.pages.flatMap(({ data }) => data) ?? [],
    [publicHiveInfiniteQuery.data],
  );

  return (
    <>
      <YStack w="100%">
        <Text>JOIN HIVE</Text>
      </YStack>
      <View f={1} w={width - 16} $gtSm={{ maw: 290 }}>
        <VerticalList
          data={flattenedPublicHives}
          numColumns={3}
          ItemSeparatorComponent={() => <View h="$0.75" />}
          estimatedItemSize={Math.min(width - 32, 290) / 3 + 16}
          onEndReached={publicHiveInfiniteQuery.fetchNextPage}
          renderItem={({ item }) => (
            <View f={1} px="$1.5">
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

export default function SearchScreen() {
  return (
    <View
      f={1}
      py="$4"
      bc="$color1"
      jc="flex-start"
      ai="center"
      ov="scroll"
      gap="$3"
      $sm={{ px: "$4" }}
    >
      <SecondaryInput w="100%" placeholder="What're you looking for?" />

      <JoinHiveList />
    </View>
  );
}
