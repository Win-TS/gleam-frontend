import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { Button, View, Text, Input, Checkbox, Theme } from "tamagui";

export default function LoginScreen() {
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
          placeholder="Email"
        />
        <View position="relative" w="100%" maxWidth="$20">
          <Input
            size="$3"
            w="100%"
            borderWidth="$1"
            borderRadius="$6"
            placeholder="Password"
            secureTextEntry
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
                color="hsl(0, 0%, 56.1%)"
                name="eye-slash"
              />
            </Button>
          </View>
        </View>
        <View h="$1" w="100%" maxWidth="$20">
          <View alignSelf="flex-start" flex={1} flexDirection="row" gap="$2">
            <Checkbox size="$3">
              <Checkbox.Indicator>
                <FontAwesome name="check" />
              </Checkbox.Indicator>
            </Checkbox>
            <Text color="#b8ab8c" fontSize="$3" fontWeight="bold">
              remember me
            </Text>
          </View>
        </View>
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
            LOG IN
          </Button>
          <Button
            size="$4"
            w="100%"
            maxWidth="$20"
            borderWidth="$1"
            borderRadius="$8"
            backgroundColor="$color1"
            borderColor="$color12"
            color="$color12"
            fontWeight="bold"
          >
            SIGN UP
          </Button>
        </Theme>
      </View>
      <Text h="$4" color="#b8ab8c" fontSize="$2" fontWeight="bold">
        Forgot password?
      </Text>
    </View>
  );
}
