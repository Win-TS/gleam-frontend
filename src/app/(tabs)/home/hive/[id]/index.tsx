import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useIsFocused } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useLocalSearchParams } from "expo-router";
import { atom, useAtom, useAtomValue } from "jotai";
import React, { useState } from "react";
import { Dimensions, NativeScrollEvent } from "react-native";
import {
  AlertDialog,
  Button,
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

import DangerBtn from "@/src/components/DangerBtn";
import PrimaryBtn from "@/src/components/PrimaryBtn";
import SecondaryBtn from "@/src/components/SecondaryBtn";
import VerticalList from "@/src/components/VerticalList";

const editAtom = atom(false);

const HiveDescription = () => {
  const edit = useAtomValue(editAtom);

  const title = "NO SHOWER";
  const description =
    "if you are planning for long time of no shower, come join us";

  return (
    <View w="100%" justifyContent="center" alignItems="center" gap="$1">
      {edit ? (
        <>
          <Input
            value={title}
            paddingVertical="$1"
            w="100%"
            borderWidth="$1"
            borderColor="$gleam12"
            fontWeight="bold"
          />
          <Input
            value={description}
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
            {title}
          </Text>
          <Text fontSize="$2" textAlign="center" textOverflow="ellipsis">
            {description}
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
  const state: "none" | "requested" | "joined" = "requested";

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

  const state: "none" | "requested" | "joined" = "requested";
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
            <Link href={`/home/hive/${hiveId}/report`} asChild>
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
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay key="overlay" />
          <AlertDialog.Content
            key="content"
            w="$16"
            backgroundColor="$color1"
            borderWidth="$0"
            justifyContent="center"
            alignItems="center"
          >
            <AlertDialog.Title
              key="title"
              w="$14"
              fontSize="$7"
              lineHeight="$2"
              textAlign="center"
            >
              Are you sure you want to leave?
            </AlertDialog.Title>
            <AlertDialog.Description fontSize="$2">
              *this action cannot be undone*
            </AlertDialog.Description>
            <XStack w="100%" gap="$3">
              <AlertDialog.Action asChild>
                <PrimaryBtn flex={1} size="$2.5" borderRadius="$4">
                  YES
                </PrimaryBtn>
              </AlertDialog.Action>
              <AlertDialog.Cancel asChild>
                <SecondaryBtn flex={1} size="$2.5" borderRadius="$4">
                  NO
                </SecondaryBtn>
              </AlertDialog.Cancel>
            </XStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    </>
  );
};

const HiveHeader = ({ hiveId }: { hiveId: number }) => {
  const owner = true;

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
            <View
              w="$8"
              h="$8"
              backgroundColor="#bbbbbb"
              borderRadius="$12"
            ></View>
            <View w="100%" justifyContent="center" alignItems="center">
              <HiveDescription />
            </View>
            {owner ? <HiveOwnerBtn /> : <HiveNonOwnerBtn />}
          </View>
          <HiveOptionsPopover hiveId={hiveId} />
        </YStack>
        <PrimaryBtn
          size="$2.5"
          w="100%"
          borderRadius="$4"
          justifyContent="center"
          alignItems="center"
        >
          37 members
        </PrimaryBtn>
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
