import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable } from "react-native";
import {
  useTheme,
  Button,
  View,
  Text,
  Image,
  Popover,
  XStack,
  YStack,
  Avatar,
  ZStack,
} from "tamagui";

import { ReactionIcon } from "@/assets";
import DangerBtn from "@/src/components/DangerBtn";
import QueryPlaceholder from "@/src/components/QueryPlaceholder";
import { useHiveQuery } from "@/src/hooks/hive";
import {
  useCreatePostReactionMutation,
  useDeletePostReactionMutation,
  usePostQuery,
  usePostReactionCountsQuery,
} from "@/src/hooks/post";
import { BasePost, Post } from "@/src/schemas/post";
import { useUserId } from "@/src/stores/user";

const PostOptionsPopover = ({ post }: { post: BasePost }) => {
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
                  pathname: "/(tabs)/home/hive/[id]/post/[postId]/report",
                  params: {
                    id: post.group_id,
                    postId: post.post_id,
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
  post,
  reaction,
}: {
  post: Post;
  reaction: (typeof REACTIONS)[number];
}) => {
  const deletePostReactionMutation = useDeletePostReactionMutation(
    post.data.post_id,
    reaction,
  );
  const createPostReactionMutation = useCreatePostReactionMutation(
    post.data.post_id,
    reaction,
  );

  return (
    <Button
      chromeless
      w="$2"
      h="$2"
      onPress={async () => {
        try {
          if (post.reaction) await deletePostReactionMutation.mutateAsync();
          await createPostReactionMutation.mutateAsync();
        } catch {}
      }}
    >
      <ReactionIcon variant="default" name={reaction} />
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
      <ReactionIcon variant="selected" name={reaction} />
    </Button>
  );
};

const ReactionList = ({ post }: { post: Post }) => {
  const postReactionCountsQuery = usePostReactionCountsQuery(post.data.post_id);

  return (
    <QueryPlaceholder
      query={postReactionCountsQuery}
      spinnerSize="small"
      renderData={(data) => {
        return (
          <XStack gap="$1.5" jc="flex-start" ai="center">
            {REACTIONS.map((reaction) => {
              return (
                <XStack jc="center" ai="center" gap="$1" key={reaction}>
                  {reaction === post.reaction?.reaction ? (
                    <ReactionSelectedButton
                      postId={post.data.post_id}
                      reaction={reaction}
                    />
                  ) : (
                    <ReactionDefaultButton post={post} reaction={reaction} />
                  )}
                  <Text>{data.data[reaction] ?? 0}</Text>
                </XStack>
              );
            })}
          </XStack>
        );
      }}
    />
  );
};

export default ({ post, streak }: { post: BasePost; streak?: number }) => {
  const router = useRouter();

  const userId = useUserId();
  const postQuery = usePostQuery(post.post_id);
  const hiveQuery = useHiveQuery(post.group_id);

  return (
    <YStack w="100%" p="$2" gap="$3" bc="$color1" br="$3" elevation="$2">
      <Pressable
        onPress={() => {
          if (post.member_id === userId) {
            router.push("/(tabs)/profile");
          } else {
            router.push({
              pathname: "/(tabs)/home/profile/[id]/",
              params: {
                id: post.member_id,
              },
            });
          }
        }}
      >
        <QueryPlaceholder
          query={postQuery}
          renderData={(data) => (
            <XStack ai="center" gap="$1.5">
              <Avatar circular size="$4">
                <Avatar.Image src={data.member.photourl} />
              </Avatar>
              <Text>{data.member.username}</Text>
            </XStack>
          )}
        />
      </Pressable>
      <ZStack pos="relative" w="100%" pt="$2" aspectRatio={1} ai="center">
        <View w="100%" br="$8">
          <Image
            w="100%"
            aspectRatio={1}
            source={{ uri: post.photo_url.String }}
          />
        </View>
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/(tabs)/home/hive/[id]/",
              params: {
                id: post.group_id,
              },
            })
          }
        >
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
            <QueryPlaceholder
              query={hiveQuery}
              renderData={(data) => (
                <Text col="$gleam1">
                  {streak ?? 2} DAYS ON{" "}
                  {data.group_info.group_name.toUpperCase()}
                </Text>
              )}
            />
          </XStack>
        </Pressable>
      </ZStack>
      <QueryPlaceholder
        query={postQuery}
        renderData={(data) => <ReactionList post={data} />}
      />
      <PostOptionsPopover post={post} />
    </YStack>
  );
};
