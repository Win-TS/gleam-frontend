import { Image as ExpoImage } from "expo-image";
import { useLocalSearchParams } from "expo-router";
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

import { icons } from "@/assets";
import PageContainer from "@/src/components/PageContainer";
import VerticalList from "@/src/components/VerticalList";
import {
  useAcceptHiveRequestMutation,
  useDeclineHiveRequestMutation,
  useHiveRequestQuery,
} from "@/src/hooks/hive";

const MemberActions = ({ member }: { member: any }) => {
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
          <ExpoImage source={icons.accept} style={{ width: 24, height: 24 }} />
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
          <ExpoImage source={icons.reject} style={{ width: 24, height: 24 }} />
        </View>
      </Button>
    </XStack>
  );
};

const HiveRequest = ({ member }: { member: any }) => {
  return (
    <YStack gap="$1.5">
      <XStack w="100%" p="$2" jc="space-between" ai="center">
        <XStack f={1} fs={1} fd="row" jc="flex-start" ai="center" gap="$3">
          <Avatar f={0} circular size="$4">
            <Avatar.Image src={member.user_photourl} />
            <Avatar.Fallback bc="$color5" />
          </Avatar>
          <Text f={1} fs={1} numberOfLines={1} textOverflow="ellipsis" fos="$3">
            {member.username}
          </Text>
        </XStack>
        <MemberActions member={member} />
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

  const friendRequestedList = useHiveRequestQuery(hiveId);
  return (
    <PageContainer>
      <View f={1} w={width - 16} $gtSm={{ maw: 290 }}>
        <VerticalList
          data={friendRequestedList.data?.data}
          numColumns={1}
          ItemSeparatorComponent={() => (
            <Separator w={width} $gtSm={{ maw: "$20" }} boc="$gleam12" />
          )}
          estimatedItemSize={58}
          renderItem={({ item }) => (
            <View w="100%" jc="center" ai="center" $gtSm={{ maw: "$20" }}>
              <HiveRequest member={item} />
            </View>
          )}
        />
      </View>
    </PageContainer>
  );
}
