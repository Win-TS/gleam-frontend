import FontAwesome from "@expo/vector-icons/FontAwesome";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform } from "react-native";
import { Text, Select, YStack, XStack, useTheme, Separator } from "tamagui";

import ImagePicker from "@/src/components/ImagePicker";
import PageContainer from "@/src/components/PageContainer";
import PrimaryBtn from "@/src/components/PrimaryBtn";
import SecondaryInput from "@/src/components/SecondaryInput";

export default function SignupFormScreen() {
  const theme = useTheme();
  const router = useRouter();

  const genderItems = ["Male", "Female", "Unspecified"] as const;
  const nationalityItems = ["Thai"] as const;

  const [webBirthDateTempState, setWebBirthDateTempState] =
    useState("DD/MM/YYYY");

  type FormFields = {
    photo: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    phoneNumber: string;
    birthDate: Date | undefined;
    gender: (typeof genderItems)[number] | undefined;
    nationality: (typeof nationalityItems)[number] | undefined;
  };

  const signupMutation = useMutation<
    AxiosResponse,
    AxiosError<{ message: string }>,
    FormFields
  >({
    mutationFn: async ({
      photo,
      firstName,
      lastName,
      username,
      email,
      password,
      phoneNumber,
      birthDate,
      gender,
      nationality,
    }: FormFields) => {
      return await axios.post(
        "/user_v1/createuser",
        {
          photo,
          firstname: firstName,
          lastname: lastName,
          username,
          email,
          phone_no: `+66${phoneNumber}`,
          birthday: birthDate?.toISOString(),
          gender,
          nationality,
          password,
        },
        { baseURL: process.env.EXPO_PUBLIC_USER_API },
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
      photo: "",
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      phoneNumber: "",
      birthDate: undefined as Date | undefined,
      gender: undefined as (typeof genderItems)[number] | undefined,
      nationality: undefined as (typeof nationalityItems)[number] | undefined,
    },
    onSubmit: async ({ value }) => {
      try {
        await signupMutation.mutateAsync(value);
      } catch {}
    },
  });
  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);

  return (
    <PageContainer>
      <form.Provider>
        <YStack f={1} w="100%" jc="center" ai="center" gap="$3">
          <form.Field
            name="photo"
            children={(field) => (
              <ImagePicker
                size="$12"
                image={field.state.value}
                setImage={field.handleChange}
              />
            )}
          />
          <form.Field
            name="firstName"
            children={(field) => (
              <SecondaryInput
                w="100%"
                placeholder="First name"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
              />
            )}
          />
          <form.Field
            name="lastName"
            children={(field) => (
              <SecondaryInput
                w="100%"
                placeholder="Last name"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
              />
            )}
          />
          <Separator w="100%" borderColor="$gleam12" />
          <form.Field
            name="username"
            children={(field) => (
              <SecondaryInput
                w="100%"
                placeholder="Username"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
              />
            )}
          />
          <form.Field
            name="email"
            children={(field) => (
              <SecondaryInput
                w="100%"
                placeholder="Email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
              />
            )}
          />
          <form.Field
            name="password"
            children={(field) => (
              <SecondaryInput
                w="100%"
                password
                placeholder="Password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
              />
            )}
          />
          <XStack w="100%">
            <SecondaryInput
              fg={0}
              w="$5"
              btlr="$6"
              bblr="$6"
              btrr="$0"
              bbrr="$0"
              brw="$0.5"
              placeholder="+66"
            />
            <form.Field
              name="phoneNumber"
              children={(field) => (
                <SecondaryInput
                  fg={1}
                  fb={0}
                  btrr="$6"
                  bbrr="$6"
                  btlr="$0"
                  bblr="$0"
                  blw="$0.5"
                  placeholder="Phone number"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChangeText={field.handleChange}
                />
              )}
            />
          </XStack>
          <Separator w="100%" boc="$gleam12" />
          <XStack w="100%" gap="$3">
            <YStack fg={1} fb={0} jc="center" ai="center">
              <Text fos="$2">Date of Birth</Text>
              <form.Field
                name="birthDate"
                children={(field) =>
                  Platform.OS === "web" ? (
                    <SecondaryInput
                      textContentType="birthdate"
                      w="100%"
                      value={webBirthDateTempState}
                      onBlur={() => {
                        field.handleBlur();
                        const parts = webBirthDateTempState.split("/");
                        const date = new Date(
                          +parts[2],
                          +parts[1] - 1,
                          +parts[0],
                        );
                        if (isNaN(date.valueOf())) {
                          setWebBirthDateTempState("DD/MM/YYYY");
                        } else {
                          field.handleChange(date);
                        }
                      }}
                      onChangeText={setWebBirthDateTempState}
                    />
                  ) : (
                    <PrimaryBtn
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
                          field.state.value
                            .getDate()
                            .toString()
                            .padStart(2, "0"),
                          (field.state.value.getMonth() + 1)
                            .toString()
                            .padStart(2, "0"),
                          field.state.value.getFullYear().toString(),
                        ].join("/")
                      ) : (
                        "DD/MM/YYYY"
                      )}
                    </PrimaryBtn>
                  )
                }
              />
            </YStack>
            <form.Field
              name="gender"
              children={(field) => (
                <Select
                  onValueChange={(value) =>
                    field.handleChange(value as (typeof genderItems)[number])
                  }
                >
                  <Select.Trigger
                    fg={1}
                    fb={0}
                    h="$3"
                    size="$3"
                    bw="$1"
                    br="$6"
                    boc="$color7"
                    bc="$color3"
                    als="flex-end"
                  >
                    <XStack jc="center" ai="center" gap="$3">
                      <FontAwesome
                        color={theme.color10.val}
                        name="caret-down"
                      />
                      <Select.Value
                        col={field.state.value ? "$color12" : theme.color10.val}
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
                  bw="$1"
                  br="$6"
                  boc="$color7"
                  bc="$color3"
                >
                  <XStack fd="row" jc="center" ai="center" gap="$3">
                    <FontAwesome color={theme.color10.val} name="caret-down" />
                    <Select.Value
                      col={field.state.value ? "$color12" : theme.color10.val}
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
          <YStack pos="relative" h="$4" w="100%">
            <Text col="#ff0000" fos="$2" fow="bold">
              {signupMutation.error?.response?.data?.message ?? ""}
            </Text>
          </YStack>
        </YStack>
        <YStack h="$11" w="100%" jc="center" ai="center" gap="$3">
          <PrimaryBtn size="$4" w="100%" onPress={form.handleSubmit}>
            Receive OTP
          </PrimaryBtn>
          <XStack gap="$3">
            <Text col="#b8ab8c" fos="$2" fow="bold">
              Already have an account?
            </Text>
            <Text
              col="$gleam12"
              fos="$2"
              fow="bold"
              textDecorationLine="underline"
              onPress={() => router.replace("/login")}
            >
              Log in
            </Text>
          </XStack>
        </YStack>
      </form.Provider>
    </PageContainer>
  );
}
