import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button, View, Text, Input, Theme, Select } from "tamagui";

export default function LoginScreen() {
  const [birthDate, setBirthDate] = useState<Date>();
  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);

  const genderItems = ["Male", "Female", "Unspecified"] as const;
  const [gender, setGender] = useState<(typeof genderItems)[number]>();

  const nationalityItems = ["Thai"] as const;
  const [nationality, setNationality] =
    useState<(typeof nationalityItems)[number]>();

  return (
    <View flex={1} p="$4" justifyContent="center" alignItems="center" gap="$3">
      <View
        flex={1}
        w="100%"
        justifyContent="center"
        alignItems="center"
        gap="$3"
      >
        <Input
          size="$3"
          w="100%"
          maxWidth="$20"
          borderWidth="$1"
          borderRadius="$6"
          placeholder="First name"
        />
        <Input
          size="$3"
          w="100%"
          maxWidth="$20"
          borderWidth="$1"
          borderRadius="$6"
          placeholder="Last name"
        />
        <Input
          size="$3"
          w="100%"
          maxWidth="$20"
          borderWidth="$1"
          borderRadius="$6"
          placeholder="Email"
        />
        <View flexDirection="row" w="100%" maxWidth="$20">
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
          />
        </View>
        <View flexDirection="row" w="100%" maxWidth="$20" gap="$3">
          <Button
            flexGrow={1}
            flexBasis={0}
            size="$3"
            borderWidth="$1"
            borderRadius="$6"
            color={birthDate ? "$color12" : "hsl(0, 0%, 56.1%)"}
            onPress={() => setShowBirthDatePicker(true)}
          >
            {showBirthDatePicker ? (
              <DateTimePicker
                value={birthDate ?? new Date()}
                mode="date"
                style={{ position: "absolute", maxWidth: 120 }}
                onChange={(_, date) => {
                  setBirthDate(date);
                  setShowBirthDatePicker(false);
                }}
              />
            ) : birthDate ? (
              [
                birthDate.getDate().toString().padStart(2, "0"),
                (birthDate.getMonth() + 1).toString().padStart(2, "0"),
                birthDate.getFullYear().toString(),
              ].join("/")
            ) : (
              "DD/MM/YYYY"
            )}
          </Button>
          <Select
            onValueChange={(value) =>
              setGender(value as (typeof genderItems)[number])
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
              <View
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                gap="$3"
              >
                <FontAwesome color="hsl(0, 0%, 56.1%)" name="caret-down" />
                <Select.Value
                  color={gender ? "$color12" : "hsl(0, 0%, 56.1%)"}
                  placeholder="Gender"
                />
              </View>
            </Select.Trigger>

            <Select.Adapt platform="touch">
              <Select.Sheet modal>
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
        </View>
        <Select
          onValueChange={(value) =>
            setNationality(value as (typeof nationalityItems)[number])
          }
        >
          <Select.Trigger
            size="$3"
            w="100%"
            maxWidth="$20"
            borderWidth="$1"
            borderRadius="$6"
            borderColor="$color7"
          >
            <View
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
              gap="$3"
            >
              <FontAwesome color="hsl(0, 0%, 56.1%)" name="caret-down" />
              <Select.Value
                color={nationality ? "$color12" : "hsl(0, 0%, 56.1%)"}
                placeholder="Nationality"
              />
            </View>
          </Select.Trigger>

          <Select.Adapt platform="touch">
            <Select.Sheet modal>
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
      </View>
      <View
        h="$11"
        w="100%"
        justifyContent="center"
        alignItems="center"
        gap="$3"
      >
        <Theme name="gleam">
          <Button
            size="$4"
            w="100%"
            maxWidth="$20"
            borderWidth="$1"
            borderRadius="$8"
            backgroundColor="$color12"
            borderColor="$color12"
            color="$color1"
            fontWeight="bold"
          >
            Receive OTP
          </Button>
        </Theme>
        <Text color="#b8ab8c" fontSize="$2" fontWeight="bold">
          Already have an account? Log in
        </Text>
      </View>
    </View>
  );
}
