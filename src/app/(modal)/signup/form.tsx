import FontAwesome from "@expo/vector-icons/FontAwesome";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  Button,
  View,
  Text,
  Input,
  Select,
  YStack,
  XStack,
  useTheme,
} from "tamagui";

import PrimaryBtn from "@/src/components/PrimaryBtn";

export default function SignupFormScreen() {
  const theme = useTheme();

  const genderItems = ["Male", "Female", "Unspecified"] as const;
  const nationalityItems = ["Thai"] as const;

  type FormFields = {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    birthDate: Date | undefined;
    gender: (typeof genderItems)[number] | undefined;
    nationality: (typeof nationalityItems)[number] | undefined;
    password: string;
  };

  const signupMutation = useMutation<
    AxiosResponse,
    AxiosError<{ message: string }>,
    FormFields
  >({
    mutationFn: async ({
      firstName,
      lastName,
      email,
      phoneNumber,
      birthDate,
      gender,
      nationality,
      password,
    }: FormFields) => {
      return await axios.post(
        "/auth_v1/signup",
        {
          email,
          phone_number: `+66${phoneNumber}`,
          password,
        },
        { baseURL: process.env.EXPO_PUBLIC_AUTH_API },
      );
    },
    onSuccess: (_, { email, password }) => {
      router.replace({
        pathname: "/signup/otp",
        params: {
          email,
          password,
        },
      });
    },
  });

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      birthDate: undefined as Date | undefined,
      gender: undefined as (typeof genderItems)[number] | undefined,
      nationality: undefined as (typeof nationalityItems)[number] | undefined,
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await signupMutation.mutateAsync(value);
      } catch {}
    },
  });
  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);

  return (
    <YStack
      flex={1}
      paddingVertical="$4"
      backgroundColor="$color1"
      justifyContent="center"
      alignItems="center"
      gap="$3"
      $sm={{ paddingHorizontal: "$4" }}
    >
      <form.Provider>
        <YStack
          flex={1}
          w="100%"
          justifyContent="center"
          alignItems="center"
          gap="$3"
        >
          <form.Field
            name="firstName"
            children={(field) => (
              <Input
                size="$3"
                w="100%"
                borderWidth="$1"
                borderRadius="$6"
                placeholder="First name"
                $gtSm={{ maxWidth: "$20" }}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
              />
            )}
          />
          <form.Field
            name="lastName"
            children={(field) => (
              <Input
                size="$3"
                w="100%"
                borderWidth="$1"
                borderRadius="$6"
                placeholder="Last name"
                $gtSm={{ maxWidth: "$20" }}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
              />
            )}
          />
          <form.Field
            name="email"
            children={(field) => (
              <Input
                size="$3"
                w="100%"
                borderWidth="$1"
                borderRadius="$6"
                placeholder="Email"
                $gtSm={{ maxWidth: "$20" }}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
              />
            )}
          />
          <XStack w="100%" $gtSm={{ maxWidth: "$20" }}>
            <Input
              flexGrow={0}
              size="$3"
              w="$5"
              borderWidth="$1"
              borderTopLeftRadius="$6"
              borderBottomLeftRadius="$6"
              borderTopRightRadius="$0"
              borderBottomRightRadius="$0"
              borderRightWidth="$0.5"
              placeholder="+66"
            />
            <form.Field
              name="phoneNumber"
              children={(field) => (
                <Input
                  flexGrow={1}
                  flexBasis={0}
                  size="$3"
                  borderWidth="$1"
                  borderTopRightRadius="$6"
                  borderBottomRightRadius="$6"
                  borderTopLeftRadius="$0"
                  borderBottomLeftRadius="$0"
                  borderLeftWidth="$0.5"
                  placeholder="Phone number"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChangeText={field.handleChange}
                />
              )}
            />
          </XStack>
          <XStack w="100%" gap="$3" $gtSm={{ maxWidth: "$20" }}>
            <form.Field
              name="birthDate"
              children={(field) => (
                <PrimaryBtn
                  flexGrow={1}
                  flexBasis={0}
                  size="$3"
                  fontStyle="normal"
                  onPress={() => setShowBirthDatePicker(true)}
                >
                  {showBirthDatePicker ? (
                    <DateTimePicker
                      value={field.state.value ?? new Date()}
                      mode="date"
                      style={{ position: "absolute", maxWidth: 120 }}
                      onChange={(_, date) => {
                        field.handleChange(date);
                        setShowBirthDatePicker(false);
                      }}
                    />
                  ) : field.state.value ? (
                    [
                      field.state.value.getDate().toString().padStart(2, "0"),
                      (field.state.value.getMonth() + 1)
                        .toString()
                        .padStart(2, "0"),
                      field.state.value.getFullYear().toString(),
                    ].join("/")
                  ) : (
                    "DD/MM/YYYY"
                  )}
                </PrimaryBtn>
              )}
            />
            <form.Field
              name="gender"
              children={(field) => (
                <Select
                  onValueChange={(value) =>
                    field.handleChange(value as (typeof genderItems)[number])
                  }
                >
                  <Select.Trigger
                    flexGrow={1}
                    flexBasis={0}
                    size="$3"
                    borderWidth="$1"
                    borderRadius="$6"
                    borderColor="$color7"
                  >
                    <XStack
                      justifyContent="center"
                      alignItems="center"
                      gap="$3"
                    >
                      <FontAwesome color={theme.color9.val} name="caret-down" />
                      <Select.Value
                        color={
                          field.state.value ? "$color12" : theme.color9.val
                        }
                        size="$3"
                        placeholder="Gender"
                      />
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
                        {genderItems.map((item, i) => {
                          return (
                            <Select.Item index={i} key={item} value={item}>
                              <Select.ItemText>{item}</Select.ItemText>
                              <Select.ItemIndicator marginLeft="auto">
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
          </XStack>
          <form.Field
            name="nationality"
            children={(field) => (
              <Select
                onValueChange={(value) =>
                  field.handleChange(value as (typeof nationalityItems)[number])
                }
              >
                <Select.Trigger
                  size="$3"
                  w="100%"
                  borderWidth="$1"
                  borderRadius="$6"
                  borderColor="$color7"
                  $gtSm={{ maxWidth: "$20" }}
                >
                  <XStack
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="center"
                    gap="$3"
                  >
                    <FontAwesome color={theme.color9.val} name="caret-down" />
                    <Select.Value
                      color={field.state.value ? "$color12" : theme.color9.val}
                      size="$3"
                      placeholder="Nationality"
                    />
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
                      {nationalityItems.map((item, i) => {
                        return (
                          <Select.Item index={i} key={item} value={item}>
                            <Select.ItemText>{item}</Select.ItemText>
                            <Select.ItemIndicator marginLeft="auto">
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
          <View position="relative" w="100%" $gtSm={{ maxWidth: "$20" }}>
            <form.Field
              name="password"
              children={(field) => (
                <Input
                  size="$3"
                  w="100%"
                  borderWidth="$1"
                  borderRadius="$6"
                  placeholder="Password"
                  secureTextEntry
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChangeText={field.handleChange}
                />
              )}
            />
            <View
              position="absolute"
              flex={1}
              right="$0"
              top="$0"
              h="$3"
              justifyContent="center"
              alignItems="center"
            >
              <Button size="$3" borderRadius="$6" chromeless>
                <FontAwesome
                  size={16}
                  color={theme.color9.val}
                  name="eye-slash"
                />
              </Button>
            </View>
          </View>
          <YStack
            position="relative"
            h="$4"
            w="100%"
            $gtSm={{ maxWidth: "$20" }}
          >
            <Text color="#ff0000" fontSize="$2" fontWeight="bold">
              {signupMutation.error?.response?.data?.message ?? ""}
            </Text>
          </YStack>
        </YStack>
        <YStack
          h="$11"
          w="100%"
          justifyContent="center"
          alignItems="center"
          gap="$3"
        >
          <PrimaryBtn
            size="$4"
            w="100%"
            $gtSm={{ maxWidth: "$20" }}
            onPress={form.handleSubmit}
          >
            Receive OTP
          </PrimaryBtn>
          <XStack gap="$3">
            <Text color="#b8ab8c" fontSize="$2" fontWeight="bold">
              Already have an account?
            </Text>
            <Link href="/login" replace>
              <Text
                color="$gleam12"
                fontSize="$2"
                fontWeight="bold"
                textDecorationLine="underline"
              >
                Log in
              </Text>
            </Link>
          </XStack>
        </YStack>
      </form.Provider>
    </YStack>
  );
}
