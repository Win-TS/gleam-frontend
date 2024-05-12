import { FontAwesome } from "@expo/vector-icons";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, YStack, Select, XStack, useTheme } from "tamagui";
import { z } from "zod";

import ImagePicker from "@/src/components/ImagePicker";
import PageContainer from "@/src/components/PageContainer";
import PressableSection from "@/src/components/PressableSection";
import PrimaryBtn from "@/src/components/PrimaryBtn";
import PrimarySwitch from "@/src/components/PrimarySwitch";
import SecondaryInput from "@/src/components/SecondaryInput";
import Section from "@/src/components/Section";
import TagPickerSheet from "@/src/components/TagPickerSheet";
import { TextStyle } from "@/src/constants/TextStyle";
import { useCreateHiveMutation } from "@/src/hooks/hive";

const PlusMinusButton = ({
  handleToggle,
  error,
}: {
  handleToggle: (value: number) => void;
  error?: boolean;
}) => {
  const [value, setValue] = useState<number>(1);

  return (
    <XStack
      h="$1.5"
      px="$2"
      ai="center"
      jc="center"
      br="$8"
      bw="$1"
      boc={error ? "$red10" : "$gleam12"}
      gap="$3"
    >
      <Text
        col="$red10"
        onPress={() => {
          setValue((value) => value - 1);
          handleToggle(value - 1);
        }}
        disabled={value <= 1}
        mr="$3"
      >
        -
      </Text>
      <Text {...TextStyle.button.small}>{value}</Text>
      <Text
        col="$green10"
        onPress={() => {
          setValue((value) => value + 1);
          handleToggle(value + 1);
        }}
        disabled={value >= 25}
        ml="$3"
      >
        +
      </Text>
    </XStack>
  );
};

export default function CreateScreen() {
  const theme = useTheme();
  const [tagSheet, setTagSheet] = useState<boolean>(false);
  const router = useRouter();

  const hiveItems = ["Social", "Personal"] as const;

  const createHiveMutation = useCreateHiveMutation();

  const formValidator = {
    name: z.string().min(1),
    photo: z.string().min(1),
    tagId: z.coerce.number(),
    frequency: z.coerce.number(),
    maxMember: z.coerce.number(),
    type: z.string().min(1),
    visibility: z.coerce.boolean(),
    description: z.string().min(1),
  };

  const form = useForm({
    defaultValues: {
      name: "",
      photo: "",
      tagId: undefined as number | undefined,
      frequency: 1,
      maxMember: 1,
      type: "Social" as (typeof hiveItems)[number],
      visibility: true,
      description: "",
    },
    validatorAdapter: zodValidator,
    onSubmit: async ({ value }) => {
      try {
        const parsedValue = await z.object(formValidator).parseAsync(value);
        await createHiveMutation.mutateAsync(parsedValue);
        router.push("/(tabs)/search");
      } catch {}
    },
  });

  return (
    <PageContainer>
      <Section>
        <YStack w="100%" jc="center" ai="center" gap="$3">
          <form.Field
            name="photo"
            children={(field) => (
              <ImagePicker
                size="$10"
                image={field.state.value}
                setImage={field.handleChange}
                error={
                  form.state.submissionAttempts > 0 &&
                  field.state.meta.errors.length > 0
                }
              />
            )}
          />
          <form.Field
            name="type"
            children={(field) => (
              <Select
                onValueChange={(value) =>
                  field.handleChange(value as (typeof hiveItems)[number])
                }
              >
                <Select.Trigger
                  fb={0}
                  size="$2"
                  w="$12"
                  bw="$1"
                  br="$6"
                  boc={
                    form.state.submissionAttempts > 0 &&
                    field.state.meta.errors.length > 0
                      ? "$red10"
                      : "$gleam12"
                  }
                  bc="$color1"
                  disabled={tagSheet}
                >
                  <XStack jc="center" ai="center" gap="$3">
                    <FontAwesome color={theme.color9.val} name="caret-down" />
                    <Select.Value col="$gleam12" size="$3" />
                  </XStack>
                </Select.Trigger>

                <Select.Adapt platform="touch">
                  <Select.Sheet snapPointsMode="fit" modal>
                    <Select.Sheet.Frame>
                      <Select.Sheet.ScrollView>
                        <Select.Adapt.Contents />
                      </Select.Sheet.ScrollView>
                    </Select.Sheet.Frame>
                    <Select.Sheet.Overlay />
                  </Select.Sheet>
                </Select.Adapt>

                <Select.Content>
                  <Select.ScrollUpButton />
                  <Select.Viewport>
                    <Select.Group>
                      {hiveItems.map((item, i) => {
                        return (
                          <Select.Item index={i} key={item} value={item}>
                            <Select.ItemText>{item}</Select.ItemText>
                            <Select.ItemIndicator ml="auto">
                              <FontAwesome name="check" />
                            </Select.ItemIndicator>
                          </Select.Item>
                        );
                      })}
                    </Select.Group>
                  </Select.Viewport>
                  <Select.ScrollDownButton />
                </Select.Content>
              </Select>
            )}
          />
          <form.Field
            name="name"
            children={(field) => (
              <SecondaryInput
                w="100%"
                br="$4"
                boc={
                  (form.state.submissionAttempts > 0 ||
                    field.state.meta.isDirty) &&
                  field.state.meta.errors.length > 0
                    ? "$red10"
                    : undefined
                }
                placeholder="NAME YOUR HIVE"
                value={field.state.value}
                onChangeText={field.handleChange}
              />
            )}
          />
          <form.Field
            name="description"
            children={(field) => (
              <SecondaryInput
                h="$12"
                w="100%"
                br="$4"
                boc={
                  (form.state.submissionAttempts > 0 ||
                    field.state.meta.isDirty) &&
                  field.state.meta.errors.length > 0
                    ? "$red10"
                    : undefined
                }
                placeholder="Enter short description..."
                multiline
                value={field.state.value}
                onChangeText={field.handleChange}
              />
            )}
          />
        </YStack>
      </Section>
      <form.Field
        name="tagId"
        children={(field) => (
          <PressableSection onPress={() => setTagSheet(true)}>
            <YStack w="100%" jc="center" gap="$1">
              <Text
                f={1}
                col={
                  form.state.submissionAttempts > 0 &&
                  field.state.meta.errors.length > 0
                    ? "$red10"
                    : "$color12"
                }
                {...TextStyle.button.small}
              >
                TAG
              </Text>
              <Text f={1} col="$color11" {...TextStyle.description}>
                Select a tag
              </Text>
              <TagPickerSheet
                open={tagSheet}
                setOpen={setTagSheet}
                setTag={(tag) => {
                  field.handleChange(tag.tag_id);
                }}
              />
            </YStack>
          </PressableSection>
        )}
      />
      <form.Field
        name="visibility"
        children={(field) => (
          <Section>
            <XStack w="100%" ai="center" gap="$3">
              <YStack f={1}>
                <Text
                  col={
                    form.state.submissionAttempts > 0 &&
                    field.state.meta.errors.length > 0
                      ? "$red10"
                      : "$color12"
                  }
                  {...TextStyle.button.small}
                >
                  VISIBILITY
                </Text>
                <Text f={1} col="$color11" {...TextStyle.description}>
                  Whether non-member users is able to see hive activities
                </Text>
              </YStack>
              <PrimarySwitch
                checked={field.state.value}
                onCheckedChange={field.handleChange}
              />
            </XStack>
          </Section>
        )}
      />
      <form.Field
        name="frequency"
        children={(field) => (
          <Section>
            <XStack w="100%" ai="center" gap="$3">
              <Text
                f={1}
                col={
                  form.state.submissionAttempts > 0 &&
                  field.state.meta.errors.length > 0
                    ? "$red10"
                    : "$color12"
                }
                {...TextStyle.button.small}
              >
                STREAK FREQUENCY
              </Text>
              <PlusMinusButton
                handleToggle={field.handleChange}
                error={
                  form.state.submissionAttempts > 0 &&
                  field.state.meta.errors.length > 0
                }
              />
            </XStack>
          </Section>
        )}
      />
      <form.Field
        name="maxMember"
        children={(field) => (
          <Section>
            <XStack w="100%" ai="center" gap="$3">
              <Text
                f={1}
                col={
                  form.state.submissionAttempts > 0 &&
                  field.state.meta.errors.length > 0
                    ? "$red10"
                    : "$color12"
                }
                {...TextStyle.button.small}
              >
                MAXIMUM MEMBER
              </Text>
              <PlusMinusButton
                handleToggle={field.handleChange}
                error={
                  form.state.submissionAttempts > 0 &&
                  field.state.meta.errors.length > 0
                }
              />
            </XStack>
          </Section>
        )}
      />
      <PrimaryBtn size="$5" w="$20" mt="$8" onPress={form.handleSubmit}>
        <Text col="$color1" {...TextStyle.button.large}>
          DONE
        </Text>
      </PrimaryBtn>
    </PageContainer>
  );
}
