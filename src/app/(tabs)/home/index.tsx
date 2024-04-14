import { FontAwesome } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import { useRouter } from "expo-router";
import { countBy, filter } from "lodash";
import React, { useMemo, useState } from "react";
import {
  Avatar,
  Button,
  Image,
  Popover,
  Text,
  View,
  XStack,
  YStack,
  ZStack,
  useTheme,
  useWindowDimensions,
} from "tamagui";

import { reactions } from "@/assets";
import DangerBtn from "@/src/components/DangerBtn";
import PageContainer from "@/src/components/PageContainer";
import PrimaryBtn from "@/src/components/PrimaryBtn";
import QueryPlaceholder from "@/src/components/QueryPlaceholder";
import SecondaryBtn from "@/src/components/SecondaryBtn";
import VerticalList from "@/src/components/VerticalList";
import {
  useOngoingPostListInfiniteQuery,
  useFollowingPostListInfiniteQuery,
  usePostReactionsQuery,
  useCreatePostReactionMutation,
  useDeletePostReactionMutation,
} from "@/src/hooks/post";
import { FeedPost } from "@/src/schemas/post";
import { useUserId } from "@/src/stores/user";

const PostOptionsPopover = ({ postId }: { postId: number }) => {
  const theme = useTheme();
  const router = useRouter();

  const [openPopover, setOpenPopover] = useState(false);

  return (
    <>
      <Popover
        open={openPopover}
        onOpenChange={setOpenPopover}
        placement="bottom-end"
        allowFlip
        offset={4}
      >
        <Popover.Trigger asChild>
          <Button pos="absolute" size="$3" br="$8" t="$0" r="$0" bc="$color1">
            <FontAwesome
              name="ellipsis-h"
              color={theme.gleam12.val}
              size={24}
            />
          </Button>
        </Popover.Trigger>
        <Popover.Content p="$2" w="$12" bc="$color1" bw="$1" boc="$color4">
          <View w="100%" gap="$2">
            <DangerBtn
              size="$2.5"
              w="100%"
              br="$4"
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/home/post/[id]/report",
                  params: {
                    id: postId,
                  },
                })
              }
            >
              Report
            </DangerBtn>
          </View>
        </Popover.Content>

        <Popover.Adapt platform="touch">
          <Popover.Sheet snapPointsMode="fit" modal>
            <Popover.Sheet.Frame>
              <Popover.Sheet.ScrollView p="$4">
                <Popover.Adapt.Contents />
              </Popover.Sheet.ScrollView>
            </Popover.Sheet.Frame>
            <Popover.Sheet.Overlay />
          </Popover.Sheet>
        </Popover.Adapt>
      </Popover>
    </>
  );
};

const REACTIONS = ["heart", "sob", "angry", "joy"] as const;

const ReactionDefaultButton = ({
  postId,
  reaction,
}: {
  postId: number;
  reaction: (typeof REACTIONS)[number];
}) => {
  const createPostReactionMutation = useCreatePostReactionMutation(
    postId,
    reaction,
  );
  return (
    <Button
      chromeless
      w="$2"
      h="$2"
      onPress={async () => {
        try {
          await createPostReactionMutation.mutateAsync();
        } catch {}
      }}
    >
      <ExpoImage
        source={reactions["default"][reaction]}
        style={{ width: 24, height: 24 }}
      />
    </Button>
  );
};

const ReactionSelectedButton = ({
  postId,
  reaction,
}: {
  postId: number;
  reaction: (typeof REACTIONS)[number];
}) => {
  const deletePostReactionMutation = useDeletePostReactionMutation(
    postId,
    reaction,
  );
  return (
    <Button
      chromeless
      w="$2"
      h="$2"
      onPress={async () => {
        try {
          await deletePostReactionMutation.mutateAsync();
        } catch {}
      }}
    >
      <ExpoImage
        source={reactions["selected"][reaction]}
        style={{ width: 24, height: 24 }}
      />
    </Button>
  );
};

const ReactionList = ({ postId }: { postId: number }) => {
  const userId = useUserId();
  const postReactionsQuery = usePostReactionsQuery(postId);

  return (
    <QueryPlaceholder
      query={postReactionsQuery}
      spinnerSize="small"
      renderData={(data) => {
        const postReactionsCount = useMemo(
          () => countBy(data, (item) => item.reaction),
          [data],
        );
        const postUserReactionsCount = useMemo(
          () =>
            countBy(
              filter(data, (item) => item.member_id === userId),
              (item) => item.reaction,
            ),
          [data],
        );

        return (
          <XStack gap="$1.5" jc="flex-start" ai="center">
            {REACTIONS.map((reaction) => {
              return (
                <XStack jc="center" ai="center" gap="$1" key={reaction}>
                  {(postUserReactionsCount[reaction] ?? 0) > 0 ? (
                    <ReactionSelectedButton
                      postId={postId}
                      reaction={reaction}
                    />
                  ) : (
                    <ReactionDefaultButton
                      postId={postId}
                      reaction={reaction}
                    />
                  )}
                  <Text>{postReactionsCount[reaction] ?? 0}</Text>
                </XStack>
              );
            })}
          </XStack>
        );
      }}
    />
  );
};

const FeedPostComponent = ({ post }: { post: FeedPost }) => {
  return (
    <YStack w="100%" p="$2" gap="$3" br="$3" elevation="$4">
      <XStack ai="center" gap="$1.5">
        <Avatar circular size="$4">
          <Avatar.Image src={post.poster_photo_url} />
        </Avatar>
        <Text>{post.poster_username}</Text>
      </XStack>
      <ZStack pos="relative" w="100%" pt="$2" aspectRatio={1} ai="center">
        <View w="100%" br="$8">
          <Image
            w="100%"
            aspectRatio={1}
            source={{ uri: post.photo_url.String }}
          />
        </View>
        <XStack
          pos="absolute"
          t="$-2"
          h="$3"
          px="$3"
          bw="$1"
          br="$12"
          bc="$gleam12"
          boc="$gleam12"
          als="flex-start"
          ai="center"
          gap="$2"
        >
          <Text col="$gleam1">?? DAYS ON {post.group_name.toUpperCase()}</Text>
        </XStack>
      </ZStack>
      <ReactionList postId={post.post_id} />
      <PostOptionsPopover postId={post.post_id} />
    </YStack>
  );
};

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
          <FeedPostComponent post={item} />
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
      <View h="$0.5" />
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
