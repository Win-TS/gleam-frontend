import defu from "defu";
import React, { ComponentPropsWithoutRef, forwardRef } from "react";
import { Button, TamaguiElement } from "tamagui";

export default forwardRef<
  TamaguiElement,
  ComponentPropsWithoutRef<typeof Button>
>((props, ref) => {
  const defaultedProps = defu(props, {
    borderWidth: "$1",
    borderRadius: "$12",
    backgroundColor: "$color1",
    borderColor: "$gleam12",
    color: "$gleam12",
    fontWeight: "bold",
  } as const);

  return <Button ref={ref} {...defaultedProps}></Button>;
});
