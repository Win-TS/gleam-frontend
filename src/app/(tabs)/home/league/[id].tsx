import FontAwesome from "@expo/vector-icons/FontAwesome";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { NativeScrollEvent } from "react-native";
import { Button, Popover, Text, Theme, View, useTheme } from "tamagui";

const LeagueScrollArea = () => {
  const theme = useTheme();
  const [scrollEvent, setScrollEvent] = useState<NativeScrollEvent>();
  return (
    <>
      <FlashList
        data={[...Array(999)]}
        estimatedItemSize={97}
        numColumns={3}
        renderItem={({ item }) => (
          <View flex={1} p="$2" justifyContent="center" alignItems="center">
            <View
              w="$8"
              h="$8"
              borderRadius="$4"
              backgroundColor="#bbbbbb"
            ></View>
          </View>
        )}
        onScroll={({ nativeEvent }) => {
          setScrollEvent(nativeEvent);
        }}
      />
      {(scrollEvent?.contentOffset.y ?? 0) > 0 ? (
        <View position="absolute" h="$2" w="100%" top="$0">
          <LinearGradient
            colors={[theme.color1.val, "transparent"]}
            start={{ x: 0.5, y: 0.0 }}
            end={{ x: 0.5, y: 1.0 }}
            style={{ height: "100%", width: "100%" }}
          />
        </View>
      ) : null}
      {(scrollEvent?.contentOffset.y ?? 0) +
        (scrollEvent?.layoutMeasurement.height ?? 0) <
      (scrollEvent?.contentSize.height ?? 1) ? (
        <View position="absolute" h="$2" w="100%" bottom="$0">
          <LinearGradient
            colors={[theme.color1.val, "transparent"]}
            start={{ x: 0.5, y: 1.0 }}
            end={{ x: 0.5, y: 0.0 }}
            style={{ height: "100%", width: "100%" }}
          />
        </View>
      ) : null}
    </>
  );
};

export default function LeagueScreen() {
  const theme = useTheme();

  return (
    <View
      flex={1}
      backgroundColor="$color1"
      justifyContent="center"
      alignItems="center"
      gap="$3"
      paddingVertical="$3"
    >
      <Theme name="gleam">
        <View
          position="relative"
          w="100%"
          maxWidth="$20"
          backgroundColor="$gleam1"
          borderWidth="$1.5"
          borderRadius="$8"
          borderColor="$color12"
          shadowColor="$color12"
          shadowRadius="$2"
        >
          <View p="$4" justifyContent="center" alignItems="center" gap="$3">
            <Theme inverse>
              <View
                w="$8"
                h="$8"
                backgroundColor="#bbbbbb"
                borderRadius="$12"
              ></View>
              <View justifyContent="center" alignItems="center">
                <Text
                  color="$color1"
                  fontWeight="bold"
                  textAlign="center"
                  textOverflow="ellipsis"
                >
                  NO SHOWER
                </Text>
                <Text
                  color="$color1"
                  fontSize="$2"
                  textAlign="center"
                  textOverflow="ellipsis"
                >
                  if you are planning for long time of no shower, come join us
                </Text>
              </View>
            </Theme>
            <Button
              size="$2.5"
              w="$8"
              borderWidth="$1"
              borderRadius="$8"
              backgroundColor="$color12"
              borderColor="$color12"
              color="$color1"
              fontWeight="bold"
            >
              JOIN
            </Button>
          </View>
          <Theme reset>
            <Popover placement="bottom-end" allowFlip offset={4}>
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
                  <Theme name="gleam">
                    <Button
                      size="$2.5"
                      w="100%"
                      borderWidth="$1"
                      borderRadius="$4"
                      backgroundColor="$color12"
                      borderColor="$color12"
                      color="$color1"
                      fontWeight="bold"
                    >
                      Leave
                    </Button>
                    <Button
                      size="$2.5"
                      w="100%"
                      borderWidth="$1"
                      borderRadius="$4"
                      backgroundColor="#ff0000"
                      borderColor="#ff0000"
                      color="$color1"
                      fontWeight="bold"
                    >
                      Report
                    </Button>
                  </Theme>
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
          </Theme>
        </View>
        <Button
          size="$2.5"
          w="100%"
          maxWidth="$20"
          borderRadius="$4"
          backgroundColor="$color12"
          borderColor="$color12"
          color="$color1"
          fontWeight="bold"
        >
          37 members
        </Button>
        <View flex={1} w="100%" maxWidth="$20">
          <LeagueScrollArea />
        </View>
      </Theme>
    </View>
  );
}
