import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import {
  XStack,
  Separator,
  Avatar,
  Text,
  View,
  useWindowDimensions,
  Button,
  YStack,
} from "tamagui";
import { z } from "zod";

import { Icon } from "@/assets";
import PageContainer from "@/src/components/PageContainer";
import VerticalList from "@/src/components/VerticalList";
import {
  useAcceptHiveRequestMutation,
  useDeclineHiveRequestMutation,
  useHiveRequestListInfiniteQuery,
} from "@/src/hooks/hive";

const HiveRequestActions = ({ member }: { member: any }) => {
  const { id: hiveId } = params.parse(useLocalSearchParams<{ id: string }>());

  const declineHiveRequestMutation = useDeclineHiveRequestMutation(
    hiveId,
    member.member_id,
  );

  const acceptHiveRequestMutation = useAcceptHiveRequestMutation(
    hiveId,
    member.member_id,
  );

  return (
    <XStack jc="flex-start" ai="center" gap="$1.5">
      <Button
        p="$2"
        chromeless
        onPress={async () => {
          try {
            // test ว่าเพิ่มเพื่อนติดจริงรึป่าว
            await acceptHiveRequestMutation.mutateAsync();
          } catch {}
        }}
      >
        <View w="$2.5" h="$2.5" jc="center" ai="center">
          <Icon name="accept" />
        </View>
      </Button>
      <Button
        p="$2"
        chromeless
        onPress={async () => {
          try {
            // แก้เป็น reject friend แล้วก็ test ว่าrejectเพื่อนติดมั้ย
            await declineHiveRequestMutation.mutateAsync();
          } catch {}
        }}
      >
        <View w="$2.5" h="$2.5" jc="center" ai="center">
          <Icon name="reject" />
        </View>
      </Button>
    </XStack>
  );
};

const HiveRequest = ({ member }: { member: any }) => {
  return (
    <YStack w="100%" gap="$1.5">
      <XStack w="100%" p="$2" jc="space-between" ai="center">
        <XStack f={1} fs={1} fd="row" jc="flex-start" ai="center" gap="$3">
          <Avatar f={0} circular size="$4">
            <Avatar.Image src={member.user_photourl || undefined} />
            <Avatar.Fallback bc="$color5" />
          </Avatar>
          <Text f={1} fs={1} numberOfLines={1} textOverflow="ellipsis" fos="$3">
            {member.username}
          </Text>
        </XStack>
        <HiveRequestActions member={member} />
      </XStack>
      <Text
        p="$3"
        w="80%"
        bc="$gleam1"
        bw="$1.5"
        br="$8"
        boc="$gleam12"
        shac="$gleam12"
        shar="$2"
      >
        {member.description.String}
      </Text>
    </YStack>
  );
};

const params = z.object({
  id: z.coerce.number(),
});

export default function FriendNotificationScreen() {
  const { width } = useWindowDimensions();
  const { id: hiveId } = params.parse(useLocalSearchParams<{ id: string }>());

  const hiveRequestListInfiniteQuery = useHiveRequestListInfiniteQuery(hiveId);

  const flattenedHiveRequestList = useMemo(
    () =>
      hiveRequestListInfiniteQuery.data?.pages.flatMap(({ data }) => data) ??
      [],
    [hiveRequestListInfiniteQuery.data],
  );

  return (
    <PageContainer>
      <View w="100%" h="100%">
        <VerticalList
          data={flattenedHiveRequestList}
          numColumns={1}
          ItemSeparatorComponent={() => (
            <Separator w={width} $gtSm={{ maw: "$20" }} boc="$gleam12" />
          )}
          renderItem={({ item }) => (
            <View w="100%" jc="center" ai="center">
              <HiveRequest member={item} />
            </View>
          )}
        />
      </View>
    </PageContainer>
  );
}
