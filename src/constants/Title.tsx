import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import defu from "defu";
import React from "react";

import BackBtn from "@/src/components/BackBtn";
import SettingBtn from "@/src/components/SettingBtn";

export const titleStyle = {
  fontFamily: "AcuminProBlack",
  fontWeight: "normal",
  fontSize: 29,
} as const;

export const BaseTitle = {
  withBackBtn: {
    headerTitleAlign: "center",
    headerTitleStyle: titleStyle,
    headerLeft: () => <BackBtn />,
    headerRight: () => <SettingBtn />,
  } as const satisfies NativeStackNavigationOptions,
  withoutBackBtn: {
    headerTitleAlign: "center",
    headerTitleStyle: titleStyle,
    headerRight: () => <SettingBtn />,
  } as const satisfies NativeStackNavigationOptions,
};

export const GleamTitle = {
  withBackBtn: defu({ title: "GLEAM" }, BaseTitle.withBackBtn),
  withoutBackBtn: defu({ title: "GLEAM" }, BaseTitle.withoutBackBtn),
};
