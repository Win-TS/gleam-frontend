import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, useLocalSearchParams } from "expo-router";
import { atom, useAtom, useAtomValue } from "jotai";
import React, { useState } from "react";
import { Dimensions } from "react-native";
import {
  Avatar,
  Button,
  Input,
  Popover,
  PortalProvider,
  Sheet,
  Text,
  View,
  YStack,
  useTheme,
} from "tamagui";
import z from "zod";

import ActionDialog from "@/src/components/ActionDialog";
import DangerBtn from "@/src/components/DangerBtn";
import PrimaryBtn from "@/src/components/PrimaryBtn";
import SecondaryBtn from "@/src/components/SecondaryBtn";
import VerticalList from "@/src/components/VerticalList";
import { useHiveQuery } from "@/src/hooks/hive";

export const editAtom = atom(false);

const HiveDescription = ({ hiveId }: { hiveId: number }) => {
  const edit = useAtomValue(editAtom);

  const hiveQuery = useHiveQuery(hiveId);

  return (
    <View w="100%" justifyContent="center" alignItems="center" gap="$1">
      {edit ? (
        <>
          <Input
            value={hiveQuery.data?.group_name}
            paddingVertical="$1"
            w="100%"
            borderWidth="$1"
            borderColor="$gleam12"
            fontWeight="bold"
          />
          <Input
            value={hiveQuery.data?.description?.String}
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
          <Text fontWeight="bold" textAlign="center" textOverflow="ellipsis">
            {hiveQuery.data?.group_name}
          </Text>
          <Text fontSize="$2" textAlign="center" textOverflow="ellipsis">
            {hiveQuery.data?.description?.String}
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
            $gtSm={{ maxWidth: "$20" }}
            placeholder="Anything you want to tell the league owner?"
            multiline
          />
          <SecondaryBtn w="100%" $gtSm={{ maxWidth: "$20" }}>
            REQUEST
          </SecondaryBtn>
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
                  hiveQuery.data?.photo_url.Valid
                    ? hiveQuery.data?.photo_url.String
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
            37 members
          </PrimaryBtn>
        </Link>
      </YStack>
    </YStack>
  );
};

const params = z.object({
  id: z.coerce.number(),
});

export default function HiveScreen() {
  const { id: hiveId } = params.parse(useLocalSearchParams<{ id: string }>());

  return (
    <PortalProvider>
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
        <View
          flex={1}
          w={Math.min(Dimensions.get("window").width - 16)}
          $gtSm={{ maxWidth: 290 }}
        >
          <VerticalList
            data={[...Array(999)].map((_, i) => i)}
            numColumns={3}
            ItemSeparatorComponent={() => <View h="$0.75" />}
            ListHeaderComponent={() => (
              <View w="100%" paddingBottom="$3">
                <HiveHeader hiveId={hiveId} />
              </View>
            )}
            estimatedItemSize={
              Math.min(Dimensions.get("window").width - 32, 290) / 3
            }
            renderItem={({ item }) => (
              <View flex={1} paddingHorizontal="$1.5">
                <View
                  aspectRatio={1}
                  borderRadius="$4"
                  backgroundColor="#bbbbbb"
                ></View>
              </View>
            )}
          />
        </View>
      </YStack>
    </PortalProvider>
  );
}
