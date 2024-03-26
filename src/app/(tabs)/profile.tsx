// import { ChevronRight } from "@tamagui/lucide-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState } from "react";
import { Dimensions } from "react-native";
import {
  Text,
  View,
  Image,
  Separator,
  Avatar,
  XStack,
  YStack,
  Input,
  useTheme,
} from "tamagui";

import PrimaryBtn from "@/src/components/PrimaryBtn";
import QueryPlaceholder from "@/src/components/QueryPlaceholder";
import SwitchWithLabel from "@/src/components/SwitchWithLabel";
import { useNameMutation, useUserprofileQuery } from "@/src/hooks/user";
import { useUserStore } from "@/src/stores/user";

export default function ProfileScreen() {
  const theme = useTheme();

  const userStore = useUserStore();

  const [isEditProfile, setIsEditProfile] = useState<boolean>(false);
  const [firstname, setFirstname] = useState<string>();
  const [lastname, setLastname] = useState<string>();

  const userprofileQuery = useUserprofileQuery(userStore.user?.id ?? 1);
  const nameMutation = useNameMutation(userStore.user?.id ?? 1);

  const toggleEditProfile = (value: boolean) => {
    setFirstname(userprofileQuery.data?.firstname ?? "");
    setLastname(userprofileQuery.data?.lastname ?? "");
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
        <QueryPlaceholder
          query={userprofileQuery}
          spinnerSize="large"
          renderData={(data) => (
            <Image
              source={{
                uri: data.photo_url,
                width: 102,
                height: 102,
              }}
              style={{ borderRadius: 50 }}
            />
          )}
        />

        <QueryPlaceholder
          query={userprofileQuery}
          spinnerSize="large"
          renderData={(data) => (
            <YStack w="100%" justifyContent="center" alignItems="center">
              {isEditProfile ? (
                <XStack>
                  <Input
                    h="$2.5"
                    w="100%"
                    backgroundColor="$gleam1"
                    color="$color11"
                    value={firstname}
                    onChangeText={setFirstname}
                  />
                  <Input
                    h="$2.5"
                    w="100%"
                    backgroundColor="$gleam1"
                    color="$color11"
                    value={lastname}
                    onChangeText={setLastname}
                  />
                </XStack>
              ) : (
                <Text h="$2.5" fontSize="$7" fontWeight="bold" color="$color11">
                  {data.firstname} {data.lastname}
                </Text>
              )}
              <Text fontSize="$4" fontWeight="normal" color="$color11">
                {data.username}
              </Text>
            </YStack>
          )}
        />

        {isEditProfile ? (
          <PrimaryBtn
            size="$2.5"
            w="$12"
            onPress={async () => {
              try {
                if (firstname && lastname)
                  await nameMutation.mutateAsync({ firstname, lastname });
              } catch {}
              toggleEditProfile(false);
              await userprofileQuery.refetch();
            }}
          >
            DONE
          </PrimaryBtn>
        ) : (
          <PrimaryBtn
            size="$2.5"
            w="$12"
            onPress={() => {
              toggleEditProfile(true);
            }}
          >
            EDIT PROFILE
          </PrimaryBtn>
        )}
        {!isEditProfile && (
          <XStack gap="$3">
            <YStack w="$5" justifyContent="center" alignItems="center">
              <Text color="$color11" fontWeight="bold">
                FRIEND
              </Text>
              <QueryPlaceholder
                query={userprofileQuery}
                spinnerSize="small"
                renderData={(data) => (
                  <Text color="$color11" fontWeight="normal">
                    {data.friends_count}
                  </Text>
                )}
              />
            </YStack>
            <Separator alignSelf="stretch" vertical borderColor="$gleam12" />
            <YStack w="$5" justifyContent="center" alignItems="center">
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
          {isEditProfile && <SwitchWithLabel label="show in profile" />}
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
            MY HIVE
          </Text>
          <SwitchWithLabel label="show in profile" />
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
              MY HIVE
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
