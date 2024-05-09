import { PortalHost } from "@gorhom/portal";
import type { Meta, StoryObj } from "@storybook/react";
import { View } from "tamagui";

import SwitchWithLabel from "./SwitchWithLabel";

const meta = {
  component: SwitchWithLabel,
  decorators: [
    (Story) => (
      <View w="100%" h="100%" jc="center" ai="center">
        <PortalHost name="RootPortalHost" />
        <Story />
      </View>
    ),
  ],
  argTypes: {},
  args: { checked: true, label: "label" },
} satisfies Meta<typeof SwitchWithLabel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
