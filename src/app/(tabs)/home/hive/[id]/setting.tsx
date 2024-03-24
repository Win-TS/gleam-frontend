import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";
import { Dimensions } from "react-native";
import { Text, View, Separator, XStack, useTheme, Switch } from "tamagui";

const PrivateSwitch = () => {
  const theme = useTheme();
  const [checked, setChecked] = useState(true);

  return (
    <Switch
      size="$2"
      p="$0"
      backgroundColor={checked ? theme.gleam12.val : theme.color1.val}
      borderWidth="$1"
      borderColor="$gleam12"
      checked={checked}
      onCheckedChange={setChecked}
      unstyled
    >
      <Switch.Thumb
        backgroundColor={checked ? theme.color1.val : theme.gleam12.val}
        animation="quick"
      />
    </Switch>
  );
};

export default function SettingScreen() {
  const [groupId, setGroupId] = useState<string>("1");

  const deleteHiveQuery = useMutation<
    AxiosResponse,
    AxiosError<{ message: string }>,
    { groupId: string }
  >({
    mutationFn: async ({ groupId: string }) => {
      return await axios.delete("/group_v1/group", {
        baseURL: process.env.EXPO_PUBLIC_GROUP_API,
        params: {
          group_id: groupId,
        },
      });
    },
  });

  return (
    <View backgroundColor="$gleam1" flex={1}>
      <XStack
        w="100%"
        alignItems="center"
        gap="$3"
        $gtSm={{ maxWidth: "$20" }}
        padding="$3"
      >
        <Text
          flex={1}
          color="$red10"
          fontSize="$5"
          onPress={() => deleteHiveQuery.mutate({ groupId: "1" })}
        >
          Delete League
        </Text>
      </XStack>
      <Separator
        w={Dimensions.get("window").width}
        borderColor="$gleam12"
        $gtSm={{ maxWidth: "$20" }}
      />
      <XStack
        w="100%"
        alignItems="center"
        gap="$3"
        $gtSm={{ maxWidth: "$20" }}
        padding="$3"
      >
        <Text flex={1} color="$color11" fontSize="$5">
          Private League
        </Text>
        <View p="$2">
          <PrivateSwitch />
        </View>
      </XStack>
      <Separator
        w={Dimensions.get("window").width}
        borderColor="$gleam12"
        $gtSm={{ maxWidth: "$20" }}
      />
    </View>
  );
}
