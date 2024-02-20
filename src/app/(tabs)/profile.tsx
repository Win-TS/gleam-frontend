// import { ChevronRight } from "@tamagui/lucide-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import React, { useState } from "react";
import { Dimensions } from "react-native";
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
  useTheme,
} from "tamagui";

const SwitchWithLabel = () => {
  const theme = useTheme();
  const [checked, setChecked] = useState(true);

  return (
    <YStack alignItems="flex-end">
      <View>
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
      </View>
      <Text color="$gleam12" fontSize="$2">
        show in the profile
      </Text>
    </YStack>
  );
};

export default function ProfileScreen() {
  const queryClient = useQueryClient();
  const theme = useTheme();

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
    setUserName(userNameQuery.data?.data?.username ?? "");
    setIsEditProfile(value);
  };

  return (
    <YStack
      flex={1}
      paddingVertical="$4"
      backgroundColor="$color1"
      justifyContent="flex-start"
      alignItems="center"
      overflow="scroll"
      gap="$3"
      $sm={{ paddingHorizontal: "$4" }}
    >
      <YStack
        p="$3"
        w="100%"
        backgroundColor="$gleam1"
        borderWidth="$1.5"
        borderRadius="$8"
        borderColor="$gleam12"
        shadowColor="$gleam12"
        shadowRadius="$2"
        justifyContent="center"
        alignItems="center"
        gap="$3"
        $gtSm={{ maxWidth: "$20" }}
      >
        <Image
          source={{
            uri: "https://placekitten.com/200/300",
            width: 102,
            height: 102,
          }}
          style={{ borderRadius: 50 }}
        />
        <YStack w="100%" justifyContent="center" alignItems="center">
          {isEditProfile ? (
            <Input
              h="$2.5"
              w="100%"
              backgroundColor="$gleam1"
              color="$color11"
              value={userName}
              onChangeText={setUserName}
            />
          ) : (
            <Text h="$2.5" fontSize="$7" fontWeight="bold" color="$color11">
              {userNameQuery.data?.data?.username ?? "loading..."}
            </Text>
          )}

          <Text fontSize="$4" fontWeight="normal" color="$color11">
            @brunomars
          </Text>
        </YStack>
        {isEditProfile ? (
          <Button
            size="$2.5"
            w="$12"
            borderRadius="$8"
            backgroundColor="$gleam12"
            borderColor="$gleam12"
            color="$color1"
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
            size="$2.5"
            w="$12"
            borderRadius="$8"
            backgroundColor="$gleam12"
            borderColor="$gleam12"
            color="$color1"
            fontWeight="bold"
            onPress={() => {
              toggleEditProfile(true);
            }}
          >
            EDIT PROFILE
          </Button>
        )}
        {!isEditProfile && (
          <XStack gap="$3">
            <YStack justifyContent="center" alignItems="center">
              <Text color="$color11" fontWeight="bold">
                FRIEND
              </Text>
              <Text color="$color11" fontWeight="normal">
                87
              </Text>
            </YStack>
            <Separator alignSelf="stretch" vertical borderColor="$gleam12" />
            <YStack justifyContent="center" alignItems="center">
              <Text color="$color11" fontWeight="bold">
                LEVEL
              </Text>
              <Text color="$color11" fontWeight="normal">
                130
              </Text>
            </YStack>
          </XStack>
        )}
      </YStack>
      <XStack
        w="100%"
        borderRadius="$8"
        backgroundColor="$gleam12"
        borderColor="$gleam12"
        justifyContent="center"
        alignItems="center"
        gap="$3"
        $gtSm={{ maxWidth: "$20" }}
      >
        <Text color="$color1" fontSize="$4" fontWeight="bold">
          HIGHEST STREAKS
        </Text>
        <Text color="$color1" fontSize="$10" fontWeight="bold">
          81
        </Text>
        <Text color="$color1" fontSize="$4" fontWeight="bold">
          DAYS
        </Text>
      </XStack>

      <YStack w="100%" gap="$3" $gtSm={{ maxWidth: "$20" }}>
        <XStack>
          <Text flex={1} color="$color11">
            BADGES
          </Text>
          {isEditProfile && <SwitchWithLabel />}
        </XStack>

        <XStack>
          {/* TODO:  */}
          <Avatar circular size="$6">
            <Avatar.Fallback bc="grey" />
          </Avatar>
        </XStack>
      </YStack>

      {isEditProfile ? (
        <XStack w="100%" gap="$3" $gtSm={{ maxWidth: "$20" }}>
          <Text flex={1} color="$color11">
            MY LEAGUE
          </Text>
          <SwitchWithLabel />
        </XStack>
      ) : (
        <>
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
          >
            <Text flex={1} color="$color11">
              MY LEAGUE
            </Text>
            <View p="$2">
              <FontAwesome
                size={14}
                color={theme.gleam12.val}
                name="chevron-right"
              />
            </View>
          </XStack>
          <Separator
            w={Dimensions.get("window").width}
            borderColor="$gleam12"
            $gtSm={{ maxWidth: "$20" }}
          />
        </>
      )}
    </YStack>
  );
}
