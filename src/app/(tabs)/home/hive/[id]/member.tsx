import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable } from "react-native";
import {
  Input,
  XStack,
  Separator,
  Avatar,
  Text,
  View,
  useWindowDimensions,
  Button,
} from "tamagui";
import z from "zod";

import { Icon } from "@/assets";
import ActionDialog from "@/src/components/ActionDialog";
import PageContainer from "@/src/components/PageContainer";
import VerticalList from "@/src/components/VerticalList";
import {
  useDeleteHiveMemberMutation,
  useEditMemberRoleMutation,
  useHiveMemberListInfiniteQuery,
  useHiveQuery,
} from "@/src/hooks/hive";
import { HiveMember } from "@/src/schemas/hive";
import { useUserId } from "@/src/stores/user";

const MemberActions = ({ member }: { member: HiveMember }) => {
  const userId = useUserId();
  const hiveQuery = useHiveQuery(member.group_id);

  const editMemberRoleMutation = useEditMemberRoleMutation(
    member.group_id,
    member.member_id,
    member.role === "member" ? "co_leader" : "member",
  );
  const deleteHiveMemberMutation = useDeleteHiveMemberMutation(
    member.group_id,
    member.member_id,
  );

  const [promoteModal, setPromoteModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const rankConversion = member.role === "member" ? "Promote" : "Demote";

  if (member.member_id === userId) return <Text fos="$3">(You)</Text>;
  if (member.role === "creator") return <Text fos="$3">(Creator)</Text>;
  if (
    hiveQuery.data?.status !== "creator" &&
    hiveQuery.data?.status !== "co_leader"
  )
    return <XStack />;
  return (
    <XStack jc="flex-start" ai="center" gap="$1.5">
      <Button p="$2" chromeless onPress={() => setPromoteModal(true)}>
        <View w="$2.5" h="$2.5" jc="center" ai="center">
          <Icon name={member.role === "member" ? "crown_gray" : "crown"} />
        </View>
      </Button>
      <ActionDialog
        open={promoteModal}
        onOpenChange={setPromoteModal}
        onAction={async () => {
          try {
            await editMemberRoleMutation.mutateAsync();
          } catch {}
        }}
        title={`${rankConversion} "${member.username}"`}
        description="*this action cannot be undone*"
      />
      <Button p="$2" chromeless onPress={() => setDeleteModal(true)}>
        <View w="$2.5" h="$2.5" jc="center" ai="center">
          <Icon name="remove_member" />
        </View>
      </Button>
      <ActionDialog
        open={deleteModal}
        onOpenChange={setDeleteModal}
        onAction={async () => {
          try {
            await deleteHiveMemberMutation.mutateAsync();
          } catch {}
        }}
        title={`Remove "${member.username}"`}
        description="*this action cannot be undone*"
      />
    </XStack>
  );
};

const Member = ({ member }: { member: HiveMember }) => {
  const router = useRouter();
  const userId = useUserId();

  return (
    <XStack w="100%" p="$2" jc="space-between" ai="center">
      <Pressable
        onPress={() => {
          if (member.member_id === userId) {
            router.replace("/(tabs)/profile");
          } else {
            router.push({
              pathname: "/(tabs)/home/profile/[id]/",
              params: {
                id: member.member_id,
              },
            });
          }
        }}
        style={{ flex: 1, flexShrink: 1, flexDirection: "row" }}
      >
        <XStack f={1} fs={1} fd="row" jc="flex-start" ai="center" gap="$3">
          <Avatar f={0} circular size="$4">
            <Avatar.Image src={member.user_photourl} />
            <Avatar.Fallback bc="$color5" />
          </Avatar>
          <Text f={1} fs={1} numberOfLines={1} textOverflow="ellipsis" fos="$3">
            {member.username}
          </Text>
        </XStack>
      </Pressable>

      <MemberActions member={member} />
    </XStack>
  );
};

const params = z.object({
  id: z.coerce.number(),
});

export default function MemberScreen() {
  const { id: hiveId } = params.parse(useLocalSearchParams());

  const { width } = useWindowDimensions();

  const hiveMemberListInfiniteQuery = useHiveMemberListInfiniteQuery(hiveId);

  const flattenedHiveMemberList = useMemo(
    () =>
      hiveMemberListInfiniteQuery.data?.pages.flatMap(({ data }) => data) ?? [],
    [hiveMemberListInfiniteQuery.data],
  );

  return (
    <PageContainer>
      <Input
        size="$3"
        w="100%"
        bw="$1"
        br="$6"
        placeholder="What're you looking for?"
      />
      <View f={1} w={width - 16} $gtSm={{ maw: 290 }}>
        <VerticalList
          data={flattenedHiveMemberList}
          numColumns={1}
          ItemSeparatorComponent={() => (
            <Separator w={width} $gtSm={{ maw: "$20" }} boc="$gleam12" />
          )}
          estimatedItemSize={58}
          onEndReached={hiveMemberListInfiniteQuery.fetchNextPage}
          renderItem={({ item }) => (
            <View w="100%" jc="center" ai="center" $gtSm={{ maw: "$20" }}>
              <Member member={item} />
            </View>
          )}
        />
      </View>
    </PageContainer>
  );
}
