import { useIsFocused } from "@react-navigation/native";
import { FlashList, FlashListProps } from "@shopify/flash-list";
import defu from "defu";
import { LinearGradient } from "expo-linear-gradient";
import React, {
  ComponentPropsWithoutRef,
  RefAttributes,
  forwardRef,
  useState,
} from "react";
import { NativeScrollEvent } from "react-native";
import { View, useTheme } from "tamagui";

const _Forward = forwardRef<
  FlashList<any>,
  ComponentPropsWithoutRef<typeof FlashList<any>> & { isFocused?: boolean }
>((props, ref) => {
  const theme = useTheme();
  const isScreenFocused = useIsFocused();
  const [scrollEvent, setScrollEvent] = useState<NativeScrollEvent>();

  // TODO:
  const { isFocused, ...defaultedProps } = defu(props, {
    onScroll: ({ nativeEvent }) => {
      setScrollEvent(nativeEvent);
    },
  } satisfies Partial<FlashListProps<any>> & { isFocused?: boolean });

  return isFocused ?? isScreenFocused ? (
    <>
      <FlashList ref={ref} {...defaultedProps}></FlashList>
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
  ) : null;
});

export default <T,>(
  props: ComponentPropsWithoutRef<typeof FlashList<T>> &
    RefAttributes<FlashList<T>> & { isFocused?: boolean },
) => <_Forward {...props} />;
