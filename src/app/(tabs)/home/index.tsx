import React, { useMemo, useState } from "react";
import { View, XStack, useWindowDimensions } from "tamagui";

import PageContainer from "@/src/components/PageContainer";
import Post from "@/src/components/Post";
import PrimaryBtn from "@/src/components/PrimaryBtn";
import QueryPlaceholder from "@/src/components/QueryPlaceholder";
import SecondaryBtn from "@/src/components/SecondaryBtn";
import VerticalList from "@/src/components/VerticalList";
import {
  useOngoingPostListInfiniteQuery,
  useFollowingPostListInfiniteQuery,
} from "@/src/hooks/post";
import { FeedPost } from "@/src/schemas/post";

const Feed = ({
  postList,
  onEndReached,
}: {
  postList: FeedPost[];
  onEndReached?: () => void;
}) => {
  return (
    <VerticalList
      data={postList}
      numColumns={1}
      ItemSeparatorComponent={() => <View h="$1" />}
      estimatedItemSize={366}
      onEndReached={() => onEndReached?.()}
      renderItem={({ item }) => (
        <View px="$4">
          <Post post={item} />
        </View>
      )}
    />
  );
};

const FollowingFeed = () => {
  const { width } = useWindowDimensions();

  const postListInfiniteQuery = useFollowingPostListInfiniteQuery();

  const flattenedPostList = useMemo(
    () => postListInfiniteQuery.data?.pages.flatMap(({ data }) => data) ?? [],
    [postListInfiniteQuery.data],
  );

  return (
    <View f={1} w={width - 16} $gtSm={{ maw: 320 }}>
      <QueryPlaceholder
        query={postListInfiniteQuery}
        spinnerSize="large"
        renderData={() => (
          <Feed
            postList={flattenedPostList}
            onEndReached={postListInfiniteQuery.fetchNextPage}
          />
        )}
      />
    </View>
  );
};

const OngoingFeed = () => {
  const { width } = useWindowDimensions();

  const postListInfiniteQuery = useOngoingPostListInfiniteQuery();

  const flattenedPostList = useMemo(
    () => postListInfiniteQuery.data?.pages.flatMap(({ data }) => data) ?? [],
    [postListInfiniteQuery.data],
  );

  return (
    <View f={1} w={width - 16} $gtSm={{ maw: 320 }}>
      <QueryPlaceholder
        query={postListInfiniteQuery}
        spinnerSize="large"
        renderData={() => (
          <Feed
            postList={flattenedPostList}
            onEndReached={postListInfiniteQuery.fetchNextPage}
          />
        )}
      />
    </View>
  );
};

type Mode = "following" | "ongoing";

const ModeButton = ({
  mode,
  currentMode,
  setCurrentMode,
  children,
}: {
  mode: Mode;
  currentMode: Mode;
  setCurrentMode: (mode: Mode) => void;
  children: React.ReactNode;
}) => {
  return currentMode === mode ? (
    <PrimaryBtn
      h="$2"
      f={1}
      fb={0}
      bw="$0"
      onPress={() => setCurrentMode(mode)}
    >
      {children}
    </PrimaryBtn>
  ) : (
    <SecondaryBtn
      h="$2"
      f={1}
      fb={0}
      bw="$0"
      onPress={() => setCurrentMode(mode)}
    >
      {children}
    </SecondaryBtn>
  );
};

export default function HomeScreen() {
  const [mode, setMode] = useState<Mode>("following");

  return (
    <PageContainer>
      <XStack w="100%" bw="$1" br="$12" boc="$gleam12">
        <ModeButton
          mode="following"
          currentMode={mode}
          setCurrentMode={setMode}
        >
          Friend
        </ModeButton>
        <ModeButton mode="ongoing" currentMode={mode} setCurrentMode={setMode}>
          My Hive
        </ModeButton>
      </XStack>
      {{ following: <FollowingFeed />, ongoing: <OngoingFeed /> }[mode]}
    </PageContainer>
  );
}
