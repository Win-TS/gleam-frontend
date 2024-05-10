import React, { useState } from "react";
import { Pressable } from "react-native";
import { View, ZStack, Avatar, SizeTokens } from "tamagui";

import { Icon } from "@/assets";
import ImagePickerSheet from "@/src/components/ImagePickerSheet";

export default function ({
  size,
  image,
  setImage,
  error,
}: {
  size?: number | SizeTokens;
  image?: string;
  setImage: (image: string) => void;
  error?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable onPress={() => setOpen(true)}>
        <ZStack pos="relative" w={size} h={size} zi="$0">
          <Avatar
            circular
            size={size}
            boc={error ? "$red10" : "$gleam12"}
            bw="$1"
            zi="$0"
          >
            {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing*/}
            <Avatar.Image src={image || undefined} />
            <Avatar.Fallback bc="$color5" />
          </Avatar>
          <View w={size} h={size} jc="center" ai="center" zi="$1">
            <Icon name="pencil" size="50%" />
          </View>
        </ZStack>
      </Pressable>
      <ImagePickerSheet open={open} setOpen={setOpen} setImage={setImage} />
    </>
  );
}
