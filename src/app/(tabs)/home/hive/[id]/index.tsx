import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { atom, useAtom, useSetAtom } from "jotai";
import React, { useMemo, useState } from "react";
import { Pressable } from "react-native";
import {
  Avatar,
  Button,
  Image,
  Popover,
  Sheet,
  Spinner,
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
import GleamContainer from "@/src/components/GleamContainer";
import ImagePicker from "@/src/components/ImagePicker";
import PageContainer from "@/src/components/PageContainer";
import PrimaryBtn from "@/src/components/PrimaryBtn";
import PrimaryInput from "@/src/components/PrimaryInput";
import QueryPlaceholder from "@/src/components/QueryPlaceholder";
import SecondaryBtn from "@/src/components/SecondaryBtn";
import StorybookPortal from "@/src/components/StorybookPortal";
import VerticalList from "@/src/components/VerticalList";
import { TextStyle } from "@/src/constants/TextStyle";
import {
  useEditHiveDescriptionMutation,
  useEditHiveNameMutation,
  useEditHivePhotoMutation,
  useHiveQuery,
  useRequestHiveMutation,
} from "@/src/hooks/hive";
import { useHivePostListInfiniteQuery } from "@/src/hooks/post";
import { HiveWithMemberInfo } from "@/src/schemas/hive";

export const editAtom = atom(false);
export const openLeaveDialogAtom = atom(false);
export const openRequestSheetAtom = atom(false);

const HiveRequestBtn = () => {
  const setOpenRequestSheet = useSetAtom(openRequestSheetAtom);

  return (
    <PrimaryBtn size="$2.5" w="$8" onPress={() => setOpenRequestSheet(true)}>
      <Text col="$color1" {...TextStyle.button.small}>
        JOIN
      </Text>
    </PrimaryBtn>
  );
};

const HiveRequestSheet = ({ hiveId }: { hiveId: number }) => {
  const [openRequestSheet, setOpenRequestSheet] = useAtom(openRequestSheetAtom);

  const requestHiveMutation = useRequestHiveMutation(hiveId);

  const formValidator = {
    description: z.string().min(1),
  };

  const form = useForm({
    defaultValues: {
      description: "",
    },
    validatorAdapter: zodValidator,
    onSubmit: async ({ value }) => {
      try {
        const parsedValue = await z.object(formValidator).parseAsync(value);
        await requestHiveMutation.mutateAsync(parsedValue);
        setOpenRequestSheet(false);
      } catch {}
    },
  });

  return (
    <StorybookPortal>
      <Sheet
        open={openRequestSheet}
        snapPointsMode="fit"
        modal
        onOpenChange={setOpenRequestSheet}
      >
        <Sheet.Frame p="$4" jc="center" ai="center" bc="$gleam12" gap="$3">
          <form.Field
            name="description"
            validators={{ onChange: formValidator.description }}
            children={(field) => (
              <PrimaryInput
                h="$12"
                w="100%"
                boc={
                  form.state.submissionAttempts > 0 &&
                  field.state.meta.errors.length > 0
                    ? "$red10"
                    : undefined
                }
                placeholder="Anything you want to tell the league owner?"
                multiline
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
              />
            )}
          />
          <form.Subscribe
            selector={(state) => [
              state.isDirty,
              state.canSubmit,
              state.isSubmitting,
            ]}
            children={([isDirty, canSubmit, isSubmitting]) =>
              isSubmitting ? (
                <Spinner size="large" color="$color11" />
              ) : (
                <SecondaryBtn
                  w="100%"
                  disabled={!(isDirty && canSubmit)}
                  opacity={isDirty && canSubmit ? 1 : 0.5}
                  onPress={form.handleSubmit}
                >
                  <Text col="$gleam12" {...TextStyle.button.large}>
                    REQUEST
                  </Text>
                </SecondaryBtn>
              )
            }
          />
        </Sheet.Frame>
      </Sheet>
    </StorybookPortal>
  );
};

const HiveHeaderBtn = ({ hive }: { hive: HiveWithMemberInfo }) => {
  if (hive.status === "non-member") return <HiveRequestBtn />;
  if (hive.status === "requested")
    return (
      <SecondaryBtn size="$2.5" w="$12" disabled>
        <Text col="$gleam12" {...TextStyle.button.small}>
          REQUESTED
        </Text>
      </SecondaryBtn>
    );
  if (
    hive.status === "member" ||
    hive.status === "co_leader" ||
    hive.status === "creator"
  )
    return (
      <SecondaryBtn size="$2.5" w="$12" disabled>
        <Text col="$gleam12" {...TextStyle.button.small}>
          JOINED
        </Text>
      </SecondaryBtn>
    );
  return <></>;
};

const HiveLeaveBtn = ({ onPress }: { onPress?: () => void }) => {
  const setOpenDialog = useSetAtom(openLeaveDialogAtom);

  return (
    <PrimaryBtn
      size="$2.5"
      w="100%"
      br="$4"
      onPress={() => {
        onPress?.();
        setOpenDialog(true);
      }}
    >
      <Text col="$color1" {...TextStyle.button.small}>
        Leave
      </Text>
    </PrimaryBtn>
  );
};

const HiveOptionsPopover = ({
  hive,
  setIsEditHive,
}: {
  hive: HiveWithMemberInfo;
  setIsEditHive: (edit: boolean) => void;
}) => {
  const theme = useTheme();
  const router = useRouter();

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
          <View w="100%" gap="$2">
            {hive.status === "member" || hive.status === "co_leader" ? (
              <HiveLeaveBtn
                onPress={() => {
                  setOpenPopover(false);
                }}
              />
            ) : null}
            {hive.status === "creator" || hive.status === "co_leader" ? (
              <>
                <PrimaryBtn
                  size="$2.5"
                  w="100%"
                  br="$4"
                  onPress={() => setIsEditHive(true)}
                >
                  <Text col="$color1" {...TextStyle.button.small}>
                    Edit
                  </Text>
                </PrimaryBtn>
                <PrimaryBtn
                  size="$2.5"
                  w="100%"
                  br="$4"
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/home/hive/[id]/setting",
                      params: {
                        id: hive.group_info.group_id,
                      },
                    })
                  }
                >
                  <Text col="$color1" {...TextStyle.button.small}>
                    Setting
                  </Text>
                </PrimaryBtn>
              </>
            ) : null}
            <DangerBtn
              size="$2.5"
              w="100%"
              br="$4"
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/home/hive/[id]/report",
                  params: {
                    id: hive.group_info.group_id,
                  },
                })
              }
            >
              Report
            </DangerBtn>
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
    </>
  );
};

const HiveHeader = ({
  hive,
  setIsEditHive,
}: {
  hive: HiveWithMemberInfo;
  setIsEditHive: (edit: boolean) => void;
}) => {
  return (
    <>
      <View w="100%" jc="center" ai="center" gap="$3">
        <Avatar circular size="$8">
          <Avatar.Image src={hive.group_info.photo_url.String || undefined} />
          <Avatar.Fallback bc="$color5" />
        </Avatar>
        <View w="100%" jc="center" ai="center">
          <View w="100%" jc="center" ai="center" gap="$1">
            <Text
              {...TextStyle.button.extraSmall}
              ta="center"
              textOverflow="ellipsis"
            >
              {hive.group_info.tag_name}
            </Text>
            <Text
              {...TextStyle.button.large}
              ta="center"
              textOverflow="ellipsis"
            >
              {hive.group_info.group_name}
            </Text>
            <Text
              {...TextStyle.description}
              ta="center"
              textOverflow="ellipsis"
            >
              {hive.group_info.description.String}
            </Text>
          </View>
        </View>
        <HiveHeaderBtn hive={hive} />
      </View>
      <HiveOptionsPopover hive={hive} setIsEditHive={setIsEditHive} />
    </>
  );
};

const HiveFormHeader = ({
  hive,
  setIsEditHive,
}: {
  hive: HiveWithMemberInfo;
  setIsEditHive: (edit: boolean) => void;
}) => {
  const hiveNameMutation = useEditHiveNameMutation(hive.group_info.group_id);
  const hiveDescriptionMutation = useEditHiveDescriptionMutation(
    hive.group_info.group_id,
  );
  const hivePhotoMutation = useEditHivePhotoMutation(hive.group_info.group_id);

  const formValidator = {
    name: z.string().min(1),
    description: z.string().min(1),
    photo: z.optional(z.string()),
  };

  const form = useForm({
    defaultValues: {
      name: hive.group_info.group_name,
      description: hive.group_info.description.String,
      photo: undefined as string | undefined,
    },
    validatorAdapter: zodValidator,
    onSubmit: async ({ value }) => {
      try {
        const { name, description, photo } = await z
          .object(formValidator)
          .parseAsync(value);
        await Promise.all(
          [
            hiveNameMutation.mutateAsync({ name }),
            hiveDescriptionMutation.mutateAsync({ description }),
            photo ? hivePhotoMutation.mutateAsync({ photo }) : undefined,
          ].filter(Boolean),
        );
        setIsEditHive(false);
      } catch {}
    },
  });

  return (
    <>
      <form.Field
        name="photo"
        validators={{ onChange: formValidator.photo }}
        children={(field) => (
          <ImagePicker
            size="$8"
            image={field.state.value ?? hive.group_info.photo_url.String}
            setImage={field.handleChange}
            error={
              form.state.submissionAttempts > 0 &&
              field.state.meta.errors.length > 0
            }
          />
        )}
      />
      <View w="100%" jc="center" ai="center">
        <View w="100%" jc="center" ai="center" gap="$1">
          <form.Field
            name="name"
            validators={{ onChange: formValidator.name }}
            children={(field) => (
              <PrimaryInput
                value={field.state.value}
                py="$1"
                w="100%"
                boc={
                  form.state.submissionAttempts > 0 &&
                  field.state.meta.errors.length > 0
                    ? "$red10"
                    : undefined
                }
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
              />
            )}
          />
          <form.Field
            name="description"
            validators={{ onChange: formValidator.description }}
            children={(field) => (
              <PrimaryInput
                value={field.state.value}
                h="$8"
                w="100%"
                py="$1"
                boc={
                  form.state.submissionAttempts > 0 &&
                  field.state.meta.errors.length > 0
                    ? "$red10"
                    : undefined
                }
                multiline
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
              />
            )}
          />
        </View>
      </View>
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) =>
          isSubmitting ? (
            <Spinner size="large" color="$color11" />
          ) : (
            <PrimaryBtn
              size="$2.5"
              w="$8"
              opacity={canSubmit ? 1 : 0.5}
              onPress={form.handleSubmit}
            >
              <Text col="$color1" {...TextStyle.button.small}>
                DONE
              </Text>
            </PrimaryBtn>
          )
        }
      />
    </>
  );
};

const HiveMemberBtn = ({ hiveId }: { hiveId: number }) => {
  const router = useRouter();

  const hiveQuery = useHiveQuery(hiveId);

  return (
    <PrimaryBtn
      size="$2.5"
      w="100%"
      br="$4"
      jc="center"
      ai="center"
      onPress={() =>
        router.push({
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
            <Text col="$color1" {...TextStyle.button.small}>
              {data.group_info.total_member}
            </Text>
          )}
        ></QueryPlaceholder>
        <Text col="$color1" {...TextStyle.button.small}>
          members
        </Text>
      </XStack>
    </PrimaryBtn>
  );
};

const HiveBody = ({ hiveId }: { hiveId: number }) => {
  const theme = useTheme();

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
          <YStack w="100%" jc="center" ai="center" py="$8">
            <Text col="$color10" {...TextStyle.button.large} ta="center">
              This hive is only visible to its member
            </Text>
            <FontAwesome size={64} color={theme.color10.val} name="eye-slash" />
          </YStack>
        ) : (
          <VerticalList
            data={flattenedHivePostList}
            numColumns={3}
            ItemSeparatorComponent={() => <View h="$0.75" />}
            estimatedItemSize={96}
            onEndReached={hivePostListInfiniteQuery.fetchNextPage}
            renderItem={({ item }) => (
              <View f={1} mx="$1.5">
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/home/hive/[id]/post/[postId]/",
                      params: { id: hiveId, postId: item.post_id },
                    })
                  }
                >
                  <Image
                    source={{ uri: item.photo_url.String }}
                    w="100%"
                    aspectRatio={1}
                    br="$4"
                  />
                </Pressable>
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

  const hiveQuery = useHiveQuery(hiveId);

  const [isEditHive, setIsEditHive] = useState(false);
  const [openLeaveDialog, setOpenLeaveDialog] = useAtom(openLeaveDialogAtom);

  return (
    <>
      <PageContainer>
        <GleamContainer>
          <QueryPlaceholder
            query={hiveQuery}
            spinnerSize="large"
            renderData={(data) =>
              isEditHive ? (
                <HiveFormHeader hive={data} setIsEditHive={setIsEditHive} />
              ) : (
                <HiveHeader hive={data} setIsEditHive={setIsEditHive} />
              )
            }
          />
        </GleamContainer>
        <HiveMemberBtn hiveId={hiveId} />
        <View f={1} w={width} $gtSm={{ maw: "$20" }}>
          <HiveBody hiveId={hiveId} />
        </View>
        <ActionDialog
          open={openLeaveDialog}
          onOpenChange={setOpenLeaveDialog}
          title="Are you sure you want to leave?"
          description="*this action cannot be undone*"
        />
      </PageContainer>
      <HiveRequestSheet hiveId={hiveId} />
    </>
  );
}
