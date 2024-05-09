import { PortalHost } from "@gorhom/portal";
import type { Meta, StoryObj } from "@storybook/react";
import { View } from "tamagui";

import SecondaryBtn from "./SecondaryBtn";

const meta = {
  component: SecondaryBtn,
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
} satisfies Meta<typeof SecondaryBtn>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
