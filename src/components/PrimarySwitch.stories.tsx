import { PortalHost } from "@gorhom/portal";
import type { Meta, StoryObj } from "@storybook/react";
import { View } from "tamagui";

import PrimarySwitch from "./PrimarySwitch";

const meta = {
  component: PrimarySwitch,
  decorators: [
    (Story) => (
      <View w="100%" h="100%" jc="center" ai="center">
        <PortalHost name="RootPortalHost" />
        <Story />
      </View>
    ),
  ],
  argTypes: {},
  args: { checked: true },
} satisfies Meta<typeof PrimarySwitch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
