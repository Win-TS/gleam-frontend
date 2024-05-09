import { PortalHost } from "@gorhom/portal";
import type { Meta, StoryObj } from "@storybook/react";
import { View } from "tamagui";

import DangerBtn from "./DangerBtn";

const meta = {
  component: DangerBtn,
  decorators: [
    (Story) => (
      <View w="100%" h="100%" jc="center" ai="center">
        <PortalHost name="RootPortalHost" />
        <Story />
      </View>
    ),
  ],
  argTypes: {},
  args: { children: "button" },
} satisfies Meta<typeof DangerBtn>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
