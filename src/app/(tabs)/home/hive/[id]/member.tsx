import { FontAwesome6, AntDesign } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { Dimensions, Modal, ModalProps } from "react-native";
import {
  Input,
  XStack,
  YStack,
  Separator,
  Avatar,
  Text,
  View,
  useTheme,
} from "tamagui";

import { editAtom } from ".";

import PrimaryBtn from "@/src/components/PrimaryBtn";
import SecondaryBtn from "@/src/components/SecondaryBtn";
import VerticalList from "@/src/components/VerticalList";

type MODALPROPS = ModalProps & {
  isOpen?: boolean;
  name?: string;
  setValue?: (value: boolean) => void;
  command?: string;
};

type MEMBERLIST = {
  created_at: string;
  group_id: number;
  member_id: number;
  role: string;
};
const MemberModal = ({
  isOpen,
  name,
  setValue,
  command,
  ...rest
}: MODALPROPS) => {
  const content = (
    <View
      backgroundColor="$gleam1"
      justifyContent="center"
      alignItems="center"
      flex={1}
    >
      <YStack gap="$3">
        <View>
          <Text
            fontWeight="bold"
            fontSize="$4"
            textAlign="center"
            textOverflow="ellipsis"
          >
            {command} "{name}"
          </Text>
          <Text fontSize="$2" textAlign="center" textOverflow="ellipsis">
            *this action can't be undone*
          </Text>
        </View>

        <XStack gap="$3">
          <PrimaryBtn size="$2.5" w="$8" onPress={setValue}>
            YES
          </PrimaryBtn>
          <SecondaryBtn size="$2.5" w="$8" onPress={setValue}>
            NO
          </SecondaryBtn>
        </XStack>
      </YStack>
    </View>
  );
  return (
    <Modal
      visible={isOpen}
      animationType="fade"
      statusBarTranslucent
      presentationStyle="pageSheet"
      {...rest}
    >
      {content}
    </Modal>
  );
};

const MemberInList = ({ name, role }: { name: string; role: string }) => {
  const edit = useAtomValue(editAtom);
  const theme = useTheme();
  const [promoteModal, setPromoteModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const rankConversion = role === "member" ? "Promote" : "Demote";

  return (
    <XStack
      w="100%"
      alignItems="center"
      gap="$2.5"
      $gtSm={{ maxWidth: "$20" }}
      marginVertical="$2"
      marginHorizontal="$2.5"
    >
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
          <MemberModal
            isOpen={promoteModal}
            setValue={() => setPromoteModal(false)}
            name={name}
            command={rankConversion}
          ></MemberModal>

          <AntDesign
            name="deleteuser"
            size={25}
            color={theme.gleam12.val}
            onPress={() => setDeleteModal(true)}
          />
          <MemberModal
            isOpen={deleteModal}
            setValue={() => setDeleteModal(false)}
            name={name}
            command="Remove"
          ></MemberModal>
        </XStack>
      )}
    </XStack>
  );
};

export default function MemberScreen() {
  const [groupId, setGroupId] = useState(2);

  const userListQuery = useQuery<
    AxiosResponse,
    AxiosError<{ message: string }>
  >({
    queryKey: ["userList", groupId],
    queryFn: async () => {
      return await axios.get("/group_v1/groupmembers", {
        baseURL: process.env.EXPO_PUBLIC_GROUP_API,
        params: { group_id: groupId },
      });
    },
  });

  return (
    <YStack flex={1} backgroundColor="$gleam1">
      <Input
        size="$3"
        w="100%"
        borderWidth="$1"
        borderRadius="$6"
        placeholder="What're you looking for?"
        $gtSm={{ maxWidth: "$20" }}
      />
      <VerticalList
        data={userListQuery.data?.data ?? [...Array(999)].map((_, i) => i)}
        numColumns={1}
        ItemSeparatorComponent={() => (
          <Separator
            w={Dimensions.get("window").width}
            borderColor="$gleam12"
            $gtSm={{ maxWidth: "$20" }}
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
    </YStack>
  );
}
