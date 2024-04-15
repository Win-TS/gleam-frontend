import React from "react";

import BackBtn from "@/src/components/BackBtn";
import SettingBtn from "@/src/components/SettingBtn";

export const gleamTitle = {
  withBackBtn: {
    title: "GLEAM",
    headerTitleAlign: "center",
    headerTitleStyle: {
      fontWeight: "bold",
    },
    headerLeft: () => <BackBtn />,
    headerRight: () => <SettingBtn />,
  } as const,
  withoutBackBtn: {
    title: "GLEAM",
    headerTitleAlign: "center",
    headerTitleStyle: {
      fontWeight: "bold",
    },
    headerRight: () => <SettingBtn />,
  } as const,
};
