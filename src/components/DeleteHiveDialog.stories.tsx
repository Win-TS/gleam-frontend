import { PortalHost } from "@gorhom/portal";
import type { Meta, StoryObj } from "@storybook/react";
import { View } from "tamagui";

import DeleteHiveDialog from "./DeleteHiveDialog";

const meta = {
  component: DeleteHiveDialog,
  decorators: [
    (Story) => (
      <View w="100%" h="100%" jc="center" ai="center">
        <PortalHost name="RootPortalHost" />
        <Story />
      </View>
    ),
  ],
  argTypes: {},
  args: { open: true },
} satisfies Meta<typeof DeleteHiveDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
