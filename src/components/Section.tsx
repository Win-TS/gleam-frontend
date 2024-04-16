import React from "react";
import { Separator, useWindowDimensions } from "tamagui";

export default function ({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  return (
    <>
      {children}
      <Separator w={width} $gtSm={{ maw: "$20" }} boc="$gleam12" />
    </>
  );
}
