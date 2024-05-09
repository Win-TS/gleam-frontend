import { PortalHost } from "@gorhom/portal";
import type { Meta, StoryObj } from "@storybook/react";
import { View } from "tamagui";

import ProfileHivePickerSheet from "./ProfileHivePickerSheet";

const meta = {
  component: ProfileHivePickerSheet,
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
  args: { open: true, userId: 1 },
} satisfies Meta<typeof ProfileHivePickerSheet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
