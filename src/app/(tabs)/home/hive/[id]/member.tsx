import { FontAwesome6, AntDesign } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Dimensions, useWindowDimensions } from "react-native";
import {
  Input,
  XStack,
  Separator,
  Avatar,
  Text,
  View,
  useTheme,
} from "tamagui";
import z from "zod";

import ActionDialog from "@/src/components/ActionDialog";
import PageContainer from "@/src/components/PageContainer";
import VerticalList from "@/src/components/VerticalList";

type MEMBERLIST = {
  created_at: string;
  group_id: number;
  member_id: number;
  role: string;
};

const MemberInList = ({ name, role }: { name: string; role: string }) => {
  const edit = useState(true);
  const theme = useTheme();
  const [promoteModal, setPromoteModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const rankConversion = role === "member" ? "Promote" : "Demote";

  return (
    <XStack w="100%" alignItems="center" gap="$2.5" my="$2" mx="$2.5">
      <Avatar circular size="$4">
        <Avatar.Fallback bc="grey" />
      </Avatar>
      <Text>{name}</Text>

      {/* TODO:  move the icon more to the right & system to determine role of member => demote or promote */}
      {edit && (
        <XStack left="$20" gap="$1.5">
          <FontAwesome6
            name="crown"
            size={25}
            color={theme.gleam12.val}
            onPress={() => setPromoteModal(true)}
          />
          <ActionDialog
            open={promoteModal}
            onOpenChange={setPromoteModal}
            title={`${rankConversion} "${name}"`}
            description="*this action cannot be undone*"
          />

          <AntDesign
            name="deleteuser"
            size={25}
            color={theme.gleam12.val}
            onPress={() => setDeleteModal(true)}
          />
          <ActionDialog
            open={deleteModal}
            onOpenChange={setDeleteModal}
            title={`Remove "${name}"`}
            description="*this action cannot be undone*"
          />
        </XStack>
      )}
    </XStack>
  );
};

const params = z.object({
  id: z.coerce.number(),
});

export default function MemberScreen() {
  const { id: hiveId } = params.parse(useLocalSearchParams<{ id: string }>());

  const { width } = useWindowDimensions();

  const userListQuery = useQuery<
    AxiosResponse,
    AxiosError<{ message: string }>
  >({
    queryKey: ["userList", hiveId],
    queryFn: async () => {
      return await axios.get("/group_v1/groupmembers", {
        baseURL: process.env.EXPO_PUBLIC_GROUP_API,
        params: { group_id: hiveId },
      });
    },
  });

  return (
    <PageContainer>
      <Input
        size="$3"
        w="100%"
        borderWidth="$1"
        borderRadius="$6"
        placeholder="What're you looking for?"
      />
      <View
        flex={1}
        w={Math.min(Dimensions.get("window").width - 16)}
        $gtSm={{ maxWidth: 290 }}
      >
        <VerticalList
          data={userListQuery.data?.data ?? []}
          numColumns={1}
          ItemSeparatorComponent={() => (
            <Separator
              w={width}
              $gtSm={{ maxWidth: "$20" }}
              borderColor="$gleam12"
            />
          )}
          estimatedItemSize={Dimensions.get("window").width}
          renderItem={({
            item,
            index,
          }: {
            item: MEMBERLIST | number;
            index: number;
          }) => (
            <View flex={1} paddingHorizontal="$1.5">
              <MemberInList
                name={
                  typeof item === "number"
                    ? item.toString()
                    : item.member_id.toString()
                }
                role={typeof item === "number" ? "member" : item.role}
                key={index}
              />
            </View>
          )}
        />
      </View>
    </PageContainer>
  );
}
