import FontAwesome from "@expo/vector-icons/FontAwesome";
import defu from "defu";
import React, { ComponentPropsWithoutRef, forwardRef, useState } from "react";
import { Button, Input, View, useProps, useTheme } from "tamagui";

const PasswordInput = forwardRef<Input, ComponentPropsWithoutRef<typeof Input>>(
  (props, ref) => {
    const theme = useTheme();
    const {
      height,
      minHeight,
      maxHeight,
      width,
      minWidth,
      maxWidth,
      ...activeProps
    } = useProps(props);
    const [visible, setVisible] = useState(false);

    return (
      <View
        pos="relative"
        h={height}
        mih={minHeight}
        mah={maxHeight}
        w={width}
        miw={minWidth}
        maw={maxWidth}
      >
        <Input
          ref={ref}
          h="100%"
          w="100%"
          secureTextEntry={!visible}
          {...activeProps}
        />

        <View
          pos="absolute"
          f={1}
          r="$0"
          t="$0"
          h="100%"
          mah="$3"
          jc="center"
          ai="center"
        >
          <Button
            aspectRatio={1}
            h="100%"
            br="$12"
            chromeless
            onPress={() => setVisible(!visible)}
          >
            <FontAwesome size={16} color={theme.color10.val} name="eye-slash" />
          </Button>
        </View>
      </View>
    );
  },
);

export default forwardRef<
  Input,
  ComponentPropsWithoutRef<typeof Input> & { password?: boolean }
>((props, ref) => {
  const { password, ...defaultedProps } = defu(props, {
    password: false,
    size: "$3",
    bc: "$color1",
    bow: "$1",
    br: "$6",
  } as const);

  return password ? (
    <PasswordInput ref={ref} {...defaultedProps} />
  ) : (
    <Input ref={ref} {...defaultedProps} />
  );
});
