import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useMemo } from "react";
import { Dimensions } from "react-native";
import { Button, Input, Text, View, YStack, ZStack, useTheme } from "tamagui";

import HiveBtn from "@/src/components/HiveBtn";
import PageContainer from "@/src/components/PageContainer";
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
      <YStack w="100%">
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
  const theme = useTheme();

  return (
    <PageContainer>
      <Input
        size="$3"
        w="100%"
        borderWidth="$1"
        borderRadius="$6"
        placeholder="What're you looking for?"
      />

      <YStack w="100%">
        <Text>CREATE NEW HIVE</Text>
      </YStack>
      <YStack w="100%">
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
                <FontAwesome name="plus" color={theme.color1.val} size={48} />
              </View>
            </ZStack>
          </Button>
        </Link>
      </YStack>

      <JoinHiveList />
    </PageContainer>
  );
}
