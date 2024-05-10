import { PortalHost } from "@gorhom/portal";
import type { Meta, StoryObj } from "@storybook/react";
import { View } from "tamagui";

import SecondaryInput from "./SecondaryInput";

const meta = {
  component: SecondaryInput,
  decorators: [
    (Story) => (
      <View w="100%" h="100%" jc="center" ai="center">
        <PortalHost name="RootPortalHost" />
        <Story />
      </View>
    ),
  ],
  argTypes: {},
  args: {},
} satisfies Meta<typeof SecondaryInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
