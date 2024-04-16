import React from "react";
import { Pressable } from "react-native";

import Section from "@/src/components/Section";

export default function ({
  onPress,
  children,
}: {
  onPress?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Section>
      <Pressable style={{ width: "100%" }} onPress={onPress}>
        {children}
      </Pressable>
    </Section>
  );
}
