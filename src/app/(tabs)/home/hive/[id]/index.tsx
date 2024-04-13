import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useLocalSearchParams, useRouter } from "expo-router";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import React, { useMemo, useState } from "react";
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
  useWindowDimensions,
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
export const openLeaveDialogAtom = atom(false);

const HiveDescription = ({ hiveId }: { hiveId: number }) => {
  const edit = useAtomValue(editAtom);

  const hiveQuery = useHiveQuery(hiveId);

  return (
    <View w="100%" jc="center" ai="center" gap="$1">
      <Text fos="$2" fow="bold" ta="center" textOverflow="ellipsis">
        {hiveQuery.data?.group_info?.tag_name}
      </Text>
      {edit ? (
        <>
          <Input
            value={hiveQuery.data?.group_info?.group_name}
            py="$1"
            w="100%"
            bw="$1"
            boc="$gleam12"
            fos="$6"
            fow="bold"
          />
          <Input
            value={hiveQuery.data?.group_info?.description?.String}
            h="$8"
            w="100%"
            py="$1"
            bw="$1"
            boc="$gleam12"
            fos="$2"
            multiline
          />
        </>
      ) : (
        <>
          <Text fos="$6" fow="bold" ta="center" textOverflow="ellipsis">
            {hiveQuery.data?.group_info?.group_name}
          </Text>
          <Text fos="$2" ta="center" textOverflow="ellipsis">
            {hiveQuery.data?.group_info?.description?.String}
          </Text>
        </>
      )}
    </View>
  );
};

const HiveRequestBtn = ({ hiveId }: { hiveId: number }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <PrimaryBtn size="$2.5" w="$8" onPress={() => setOpen(true)}>
        JOIN
      </PrimaryBtn>
      <Sheet open={open} snapPointsMode="fit" modal onOpenChange={setOpen}>
        <Sheet.Frame p="$4" jc="center" ai="center" bc="$gleam12" gap="$3">
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

const HiveNonMemberBtn = ({ hiveId }: { hiveId: number }) => {
  const [state, setState] = useState<"none" | "requested">("requested");

  return state === "none" ? (
    <HiveRequestBtn hiveId={hiveId} />
  ) : state === "requested" ? (
    <SecondaryBtn size="$2.5" w="$12" disabled>
      REQUESTED
    </SecondaryBtn>
  ) : null;
};

const HiveAdminBtn = () => {
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

const HiveHeaderBtn = ({ hiveId }: { hiveId: number }) => {
  const hiveQuery = useHiveQuery(hiveId);

  return (
    <QueryPlaceholder
      query={hiveQuery}
      renderData={(data) => {
        if (data.status === "non-member")
          return <HiveNonMemberBtn hiveId={hiveId} />;
        if (data.status === "member")
          return (
            <SecondaryBtn size="$2.5" w="$8" disabled>
              JOINED
            </SecondaryBtn>
          );
        if (data.status === "creator" || data.status === "co_leader")
          return <HiveAdminBtn />;
        return <></>;
      }}
    />
  );
};

const HiveLeaveBtn = ({ onPress }: { onPress?: () => void }) => {
  const setOpenDialog = useSetAtom(openLeaveDialogAtom);

  return (
    <>
      <PrimaryBtn
        size="$2.5"
        w="100%"
        br="$4"
        onPress={() => {
          onPress?.();
          setOpenDialog(true);
        }}
      >
        Leave
      </PrimaryBtn>
    </>
  );
};

const HiveOptionsPopover = ({ hiveId }: { hiveId: number }) => {
  const theme = useTheme();
  const router = useRouter();

  const hiveQuery = useHiveQuery(hiveId);

  const [openPopover, setOpenPopover] = useState(false);

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
          <Button pos="absolute" size="$3" br="$8" t="$0" r="$0" bc="$gleam1">
            <FontAwesome
              name="ellipsis-h"
              color={theme.gleam12.val}
              size={24}
            />
          </Button>
        </Popover.Trigger>
        <Popover.Content p="$2" w="$12" bc="$color1" bw="$1" boc="$color4">
          <QueryPlaceholder
            query={hiveQuery}
            renderData={(data) => (
              <View w="100%" gap="$2">
                {data.status === "member" || data.status === "co-leader" ? (
                  <HiveLeaveBtn
                    onPress={() => {
                      setOpenPopover(false);
                    }}
                  />
                ) : null}
                <DangerBtn
                  size="$2.5"
                  w="100%"
                  br="$4"
                  onPress={() =>
                    router.navigate({
                      pathname: "/(tabs)/home/hive/[id]/report",
                      params: {
                        id: hiveId,
                      },
                    })
                  }
                >
                  Report
                </DangerBtn>
              </View>
            )}
          />
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
    </>
  );
};

const HiveHeader = ({ hiveId }: { hiveId: number }) => {
  const router = useRouter();

  const hiveQuery = useHiveQuery(hiveId);

  return (
    <YStack w="100%" px="$1.5" jc="center" ai="center">
      <YStack w="100%" jc="center" ai="center" gap="$3">
        <YStack
          p="$3"
          w="100%"
          bc="$gleam1"
          bw="$1.5"
          br="$8"
          boc="$gleam12"
          shac="$gleam12"
          shar="$2"
          jc="center"
          ai="center"
          gap="$3"
        >
          <View w="100%" jc="center" ai="center" gap="$3">
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
            <View w="100%" jc="center" ai="center">
              <HiveDescription hiveId={hiveId} />
            </View>
            <HiveHeaderBtn hiveId={hiveId} />
          </View>
          <HiveOptionsPopover hiveId={hiveId} />
        </YStack>
        <PrimaryBtn
          size="$2.5"
          w="100%"
          br="$4"
          jc="center"
          ai="center"
          onPress={() =>
            router.navigate({
              pathname: "/(tabs)/home/hive/[id]/member",
              params: {
                id: hiveId,
              },
            })
          }
        >
          <XStack gap="$2">
            <QueryPlaceholder
              query={hiveQuery}
              renderData={(data) => (
                <Text col="$color1" fow="bold">
                  {data.group_info.total_member}
                </Text>
              )}
            ></QueryPlaceholder>
            <Text col="$color1" fow="bold">
              members
            </Text>
          </XStack>
        </PrimaryBtn>
      </YStack>
    </YStack>
  );
};

const HiveBody = ({ hiveId }: { hiveId: number }) => {
  const { width } = useWindowDimensions();
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
        !data.group_info.visibility && data.status === "non-member" ? (
          <Text>This hive is only visible to its member</Text>
        ) : (
          <VerticalList
            data={flattenedHivePostList}
            numColumns={3}
            ItemSeparatorComponent={() => <View h="$0.75" />}
            estimatedItemSize={Math.min(width - 32, 290) / 3}
            renderItem={({ item }) => (
              <View f={1} px="$1.5">
                <Image
                  source={{ uri: item.photo_url.String }}
                  w="100%"
                  aspectRatio={1}
                  br="$4"
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
  const { width } = useWindowDimensions();

  const { id: hiveId } = params.parse(useLocalSearchParams<{ id: string }>());

  const [openDialog, setOpenDialog] = useAtom(openLeaveDialogAtom);

  return (
    <PortalProvider>
      <PageContainer>
        <View w="100%" pb="$3">
          <HiveHeader hiveId={hiveId} />
        </View>
        <View f={1} w={width - 16} $gtSm={{ maw: 290 }}>
          <HiveBody hiveId={hiveId} />
        </View>
        <ActionDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          title="Are you sure you want to leave?"
          description="*this action cannot be undone*"
        />
      </PageContainer>
    </PortalProvider>
  );
}
