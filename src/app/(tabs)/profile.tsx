// import { ChevronRight } from "@tamagui/lucide-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  Button,
  Separator,
  Avatar,
  XStack,
  YStack,
  Switch,
  Input,
} from "tamagui";
import type { SizeTokens } from "tamagui";

export default function ProfileScreen() {
  const queryClient = useQueryClient();

  const [isEditProfile, setIsEditProfile] = useState<boolean>(false);
  const [userId, setUserId] = useState(1);
  const [userName, setUserName] = useState<string>();

  const userNameQuery = useQuery<
    AxiosResponse,
    AxiosError<{ message: string }>
  >({
    queryKey: ["userprofile", userId],
    queryFn: async () => {
      return await axios.get("/user_v1/userprofile", {
        baseURL: process.env.EXPO_PUBLIC_USER_API,
        params: { user_id: userId },
      });
    },
  });

  const userNameMutation = useMutation<
    AxiosResponse,
    AxiosError<{ message: string }>,
    { userName: string }
  >({
    mutationFn: async ({ userName: string }) => {
      return await axios.patch(
        "/user_v1/editusername",
        {},
        {
          baseURL: process.env.EXPO_PUBLIC_USER_API,
          params: {
            user_id: userId,
            new_username: userName,
          },
        },
      );
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["userprofile", userId], data);
    },
  });

  const toggleEditProfile = (value: boolean) => {
    if (userNameQuery.data) {
      setUserName(userNameQuery.data.data.username);
      setIsEditProfile(value);
    }
  };

  const SwitchWithLabel = (props: {
    size: SizeTokens;
    defaultChecked?: boolean;
  }) => {
    const id = `switch-${props.size.toString().slice(1)}-${props.defaultChecked ?? ""}}`;
    return (
      <YStack>
        <Switch
          id={id}
          size={props.size}
          defaultChecked={props.defaultChecked}
          backgroundColor={"#FEBE00"}
          borderColor={"#FEBE00"}
          right={-100}
        >
          <Switch.Thumb animation="quick" />
        </Switch>
        <Text color={"#FBC117"} fontSize={9} right={-80}>
          show in profile
        </Text>
      </YStack>
    );
  };

  return (
    <View
      flex={1}
      justifyContent="center"
      alignItems="center"
      backgroundColor={"white"}
      gap={15}
    >
      <View
        borderRadius={"$5"}
        borderColor={"#FEBE00"}
        borderWidth={"5px"}
        backgroundColor={"white"}
        width={`${80}%`}
        height={`${45}%`}
        justifyContent="center"
        alignItems="center"
        gap="16px"
      >
        <Image
          source={{
            uri: "https://placekitten.com/200/300",
            width: 102,
            height: 102,
          }}
          style={{ borderRadius: 50 }}
        />
        <View alignItems="center">
          {isEditProfile ? (
            <Input value={userName} onChangeText={setUserName} />
          ) : (
            <Text fontSize={20} fontWeight={"bold"} color={"#616161"}>
              {userNameQuery.data?.data?.username ?? "loading..."}
            </Text>
          )}

          <Text fontSize={15} fontWeight={"normal"} color={"#616161"}>
            brunomars
          </Text>
        </View>
        {isEditProfile ? (
          <Button
            size="$4"
            w="100%"
            maxWidth={`${50}%`}
            maxHeight={`${10}%`}
            borderRadius="$8"
            backgroundColor="#FEBE00"
            color="#F2F2F2"
            fontWeight="bold"
            onPress={async () => {
              try {
                if (userName) await userNameMutation.mutateAsync({ userName });
              } catch {}
              toggleEditProfile(false);
            }}
          >
            DONE
          </Button>
        ) : (
          <Button
            size="$4"
            w="100%"
            maxWidth={`${60}%`}
            maxHeight={`${10}%`}
            borderRadius="$8"
            backgroundColor="#FEBE00"
            color="#F2F2F2"
            fontWeight="bold"
            onPress={() => {
              toggleEditProfile(true);
            }}
          >
            EDIT PROFILE
          </Button>
        )}
        {!isEditProfile && (
          <View flexDirection="row">
            <View flexDirection="column" alignItems="center">
              <Text color="#616161" fontWeight={"bold"}>
                FRIEND
              </Text>
              <Text color="#616161" fontWeight={"normal"}>
                87
              </Text>
            </View>
            <Separator
              alignSelf="stretch"
              vertical
              marginHorizontal={15}
              borderColor={"#FEBE00"}
            />
            <View flexDirection="column">
              <Text color="#616161" fontWeight={"bold"}>
                LEVEL
              </Text>
              <Text color="#616161" fontWeight={"normal"}>
                130
              </Text>
            </View>
          </View>
        )}
      </View>
      <View
        backgroundColor={"#FEBE00"}
        width={"350px"}
        height={"68px"}
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        gap={"10px"}
        borderRadius="$8"
        paddingHorizontal="$3.5"
      >
        <Text color={"white"} fontSize={16}>
          HIGHEST STREAKS
        </Text>
        <Text color={"white"} fontSize={48}>
          81
        </Text>
        <Text color={"white"} fontSize={16}>
          DAYS
        </Text>
      </View>

      <YStack gap="$2">
        <View flexDirection="row" justifyContent="space-between">
          <Text color={"#616161"} fontSize={15} left={-110}>
            BADGES
          </Text>
          {isEditProfile && <SwitchWithLabel size="$2" />}
        </View>

        <XStack left={-110}>
          <Avatar circular size="$6">
            <Avatar.Fallback bc="grey" />
          </Avatar>
        </XStack>
      </YStack>

      <Separator
        alignSelf="stretch"
        marginHorizontal={15}
        borderColor={"#FEBE00"}
      />
      <View flexDirection="row" justifyContent="space-between" width={"29vw"}>
        <Text color={"#616161"} fontSize={15} left={-100}>
          MY LEAGUE
        </Text>
        {isEditProfile && <SwitchWithLabel size="$2" />}
      </View>
      <Separator
        alignSelf="stretch"
        marginHorizontal={15}
        borderColor={"#FEBE00"}
      />
    </View>
  );
}
