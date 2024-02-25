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
    backgroundColor: "$red10",
    borderColor: "$red10",
    color: "$color1",
    fontWeight: "bold",
  } as const);

  return <Button ref={ref} {...defaultedProps}></Button>;
});
