import { PortalHost } from "@gorhom/portal";
import type { Meta, StoryObj } from "@storybook/react";
import { View } from "tamagui";

import ImagePickerSheet from "./ImagePickerSheet";

const meta = {
  component: ImagePickerSheet,
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
  args: { open: true },
} satisfies Meta<typeof ImagePickerSheet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
