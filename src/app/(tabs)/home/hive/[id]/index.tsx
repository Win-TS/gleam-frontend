import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, useLocalSearchParams } from "expo-router";
import { atom, useAtom, useAtomValue } from "jotai";
import React, { useMemo, useState } from "react";
import { Dimensions } from "react-native";
import {
  Avatar,
  Button,
  Image,
  Input,
  Popover,
  PortalProvider,
  Sheet,
  Text,
  View,
  XStack,
  YStack,
  useTheme,
} from "tamagui";
import z from "zod";

import ActionDialog from "@/src/components/ActionDialog";
import DangerBtn from "@/src/components/DangerBtn";
import PageContainer from "@/src/components/PageContainer";
import PrimaryBtn from "@/src/components/PrimaryBtn";
import QueryPlaceholder from "@/src/components/QueryPlaceholder";
import SecondaryBtn from "@/src/components/SecondaryBtn";
import VerticalList from "@/src/components/VerticalList";
import { useHiveQuery } from "@/src/hooks/hive";
import { useHivePostListInfiniteQuery } from "@/src/hooks/post";

export const editAtom = atom(false);

const HiveDescription = ({ hiveId }: { hiveId: number }) => {
  const edit = useAtomValue(editAtom);

  const hiveQuery = useHiveQuery(hiveId);

  return (
    <View w="100%" justifyContent="center" alignItems="center" gap="$1">
      <Text
        fontSize="$2"
        fontWeight="bold"
        textAlign="center"
        textOverflow="ellipsis"
      >
        {hiveQuery.data?.group_info?.tag_name}
      </Text>
      {edit ? (
        <>
          <Input
            value={hiveQuery.data?.group_info?.group_name}
            paddingVertical="$1"
            w="100%"
            borderWidth="$1"
            borderColor="$gleam12"
            fontSize="$6"
            fontWeight="bold"
          />
          <Input
            value={hiveQuery.data?.group_info?.description?.String}
            h="$8"
            w="100%"
            paddingVertical="$1"
            borderWidth="$1"
            borderColor="$gleam12"
            fontSize="$2"
            multiline
          />
        </>
      ) : (
        <>
          <Text
            fontSize="$6"
            fontWeight="bold"
            textAlign="center"
            textOverflow="ellipsis"
          >
            {hiveQuery.data?.group_info?.group_name}
          </Text>
          <Text fontSize="$2" textAlign="center" textOverflow="ellipsis">
            {hiveQuery.data?.group_info?.description?.String}
          </Text>
        </>
      )}
    </View>
  );
};

const HiveJoinBtn = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <PrimaryBtn size="$2.5" w="$8" onPress={() => setOpen(true)}>
        JOIN
      </PrimaryBtn>
      <Sheet open={open} snapPointsMode="fit" modal onOpenChange={setOpen}>
        <Sheet.Frame
          padding="$4"
          justifyContent="center"
          alignItems="center"
          backgroundColor="$gleam12"
          gap="$3"
        >
          <Input
            h="$12"
            w="100%"
            placeholder="Anything you want to tell the league owner?"
            multiline
          />
          <SecondaryBtn w="100%">REQUEST</SecondaryBtn>
        </Sheet.Frame>
      </Sheet>
    </>
  );
};

const HiveOwnerBtn = () => {
  const [edit, setEdit] = useAtom(editAtom);

  return edit ? (
    <PrimaryBtn size="$2.5" w="$8" onPress={() => setEdit(false)}>
      DONE
    </PrimaryBtn>
  ) : (
    <PrimaryBtn size="$2.5" w="$8" onPress={() => setEdit(true)}>
      EDIT
    </PrimaryBtn>
  );
};

const HiveNonOwnerBtn = () => {
  const [state, setState] = useState<"none" | "requested" | "joined">(
    "requested",
  );

  return state === "none" ? (
    <HiveJoinBtn />
  ) : state === "requested" ? (
    <SecondaryBtn size="$2.5" w="$12">
      REQUESTED
    </SecondaryBtn>
  ) : state === "joined" ? (
    <SecondaryBtn size="$2.5" w="$8">
      JOINED
    </SecondaryBtn>
  ) : null;
};

const HiveOptionsPopover = ({ hiveId }: { hiveId: number }) => {
  const theme = useTheme();

  const [state, setState] = useState<"none" | "requested" | "joined">(
    "requested",
  );
  const [openPopover, setOpenPopover] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

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
          <Button
            position="absolute"
            size="$3"
            borderRadius="$8"
            top="$0"
            right="$0"
            backgroundColor="$gleam1"
          >
            <FontAwesome
              name="ellipsis-h"
              color={theme.gleam12.val}
              size={24}
            />
          </Button>
        </Popover.Trigger>
        <Popover.Content
          p="$2"
          w="$12"
          backgroundColor="$color1"
          borderWidth="$1"
          borderColor="$color4"
        >
          <View w="100%" gap="$2">
            {state !== "none" ? (
              <PrimaryBtn
                size="$2.5"
                w="100%"
                borderRadius="$4"
                onPress={() => {
                  setOpenPopover(false);
                  setOpenDialog(true);
                }}
              >
                Leave
              </PrimaryBtn>
            ) : null}
            <Link
              href={{
                pathname: "/(tabs)/home/hive/[id]/report",
                params: {
                  id: hiveId,
                },
              }}
              asChild
            >
              <DangerBtn size="$2.5" w="100%" borderRadius="$4">
                Report
              </DangerBtn>
            </Link>
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
      <ActionDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        title="Are you sure you want to leave?"
        description="*this action cannot be undone*"
      />
    </>
  );
};

const HiveHeader = ({ hiveId }: { hiveId: number }) => {
  const owner = true;

  const hiveQuery = useHiveQuery(hiveId);

  return (
    <YStack
      w="100%"
      paddingHorizontal="$1.5"
      justifyContent="center"
      alignItems="center"
    >
      <YStack w="100%" justifyContent="center" alignItems="center" gap="$3">
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
        >
          <View w="100%" justifyContent="center" alignItems="center" gap="$3">
            <Avatar circular size="$8">
              <Avatar.Image
                src={
                  hiveQuery.data?.group_info?.photo_url?.Valid
                    ? hiveQuery.data?.group_info?.photo_url?.String
                    : undefined
                }
              />
              <Avatar.Fallback bc="$color5" />
            </Avatar>
            <View w="100%" justifyContent="center" alignItems="center">
              <HiveDescription hiveId={hiveId} />
            </View>
            {owner ? <HiveOwnerBtn /> : <HiveNonOwnerBtn />}
          </View>
          <HiveOptionsPopover hiveId={hiveId} />
        </YStack>
        <Link
          href={{
            pathname: "/(tabs)/home/hive/[id]/member",
            params: {
              id: hiveId,
            },
          }}
          asChild
        >
          <PrimaryBtn
            size="$2.5"
            w="100%"
            borderRadius="$4"
            justifyContent="center"
            alignItems="center"
          >
            <XStack gap="$2">
              <QueryPlaceholder
                query={hiveQuery}
                renderData={(data) => (
                  <Text color="$color1" fontWeight="bold">
                    {data.group_info.total_member}
                  </Text>
                )}
              ></QueryPlaceholder>
              <Text color="$color1" fontWeight="bold">
                members
              </Text>
            </XStack>
          </PrimaryBtn>
        </Link>
      </YStack>
    </YStack>
  );
};

const HiveBody = ({ hiveId }: { hiveId: number }) => {
  const hiveQuery = useHiveQuery(hiveId);
  const hivePostListInfiniteQuery = useHivePostListInfiniteQuery(hiveId);

  const flattenedHivePostList = useMemo(
    () =>
      hivePostListInfiniteQuery.data?.pages.flatMap(({ data }) => data) ?? [],
    [hivePostListInfiniteQuery.data],
  );

  return (
    <QueryPlaceholder
      query={hiveQuery}
      spinnerSize="large"
      renderData={(data) =>
        data.group_info.visibility ? (
          <Text>This hive is only visible to its member</Text>
        ) : (
          <VerticalList
            data={flattenedHivePostList}
            numColumns={3}
            ItemSeparatorComponent={() => <View h="$0.75" />}
            estimatedItemSize={
              Math.min(Dimensions.get("window").width - 32, 290) / 3
            }
            renderItem={({ item }) => (
              <View flex={1} paddingHorizontal="$1.5">
                <Image
                  source={{ uri: item.photo_url.String }}
                  w="100%"
                  aspectRatio={1}
                  borderRadius="$4"
                />
              </View>
            )}
          />
        )
      }
    />
  );
};

const params = z.object({
  id: z.coerce.number(),
});

export default function HiveScreen() {
  const { id: hiveId } = params.parse(useLocalSearchParams<{ id: string }>());

  return (
    <PortalProvider>
      <PageContainer>
        <View w="100%" paddingBottom="$3">
          <HiveHeader hiveId={hiveId} />
        </View>
        <View
          flex={1}
          w={Math.min(Dimensions.get("window").width - 16)}
          $gtSm={{ maxWidth: 290 }}
        >
          <HiveBody hiveId={hiveId} />
        </View>
      </PageContainer>
    </PortalProvider>
  );
}
