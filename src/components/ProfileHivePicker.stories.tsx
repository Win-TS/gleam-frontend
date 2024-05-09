import { PortalHost } from "@gorhom/portal";
import type { Meta, StoryObj } from "@storybook/react";
import { View } from "tamagui";

import ProfileHivePicker from "./ProfileHivePicker";

const meta = {
  component: ProfileHivePicker,
  decorators: [
    (Story) => (
      <View w="100%" h="100%" jc="center" ai="center">
        <PortalHost name="RootPortalHost" />
        <View w="100%" h="100%" jc="center" ai="center">
          <Story />
        </View>
      </View>
    ),
  ],
  argTypes: {},
  args: { userId: 1 },
} satisfies Meta<typeof ProfileHivePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
