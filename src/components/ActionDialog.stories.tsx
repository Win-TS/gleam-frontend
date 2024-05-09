import { PortalHost } from "@gorhom/portal";
import type { Meta, StoryObj } from "@storybook/react";
import { View } from "tamagui";

import ActionDialog from "./ActionDialog";

const meta = {
  component: ActionDialog,
  decorators: [
    (Story) => (
      <View w="100%" h="100%" jc="center" ai="center">
        <PortalHost name="RootPortalHost" />
        <Story />
      </View>
    ),
  ],
  argTypes: {
    title: {
      control: "text",
    },
    description: {
      control: "text",
    },
  },
  args: {
    title: "title",
    description: "description",
    open: true,
  },
} satisfies Meta<typeof ActionDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
