import React, { useState } from "react";
import { Pressable } from "react-native";
import { View, ZStack, useTheme, Avatar } from "tamagui";

import Pencil from "@/assets/icons/pencil.svg";
import ImagePickerSheet from "@/src/components/ImagePickerSheet";

export default function ({
  image,
  setImage,
}: {
  image?: string;
  setImage: (image: string) => void;
}) {
  const theme = useTheme();

  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable onPress={() => setOpen(true)}>
        <ZStack pos="relative" w="$12" h="$12" zi="$0">
          <Avatar circular size="$12" boc="$gleam12" bw="$1" zi="$0">
            <Avatar.Image source={{ uri: image ?? "" }} />
            <Avatar.Fallback bc="$color5" />
          </Avatar>
          <View w="$12" h="$12" jc="center" ai="center" zi="$1">
            <Pencil fill={theme.gleam12.val} />
          </View>
        </ZStack>
      </Pressable>
      <ImagePickerSheet open={open} setOpen={setOpen} setImage={setImage} />
    </>
  );
}
