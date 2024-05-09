import { PortalHost } from "@gorhom/portal";
import type { Meta, StoryObj } from "@storybook/react";
import { View } from "tamagui";

import ImagePicker from "./ImagePicker";

const meta = {
  component: ImagePicker,
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
  args: { size: 128 },
} satisfies Meta<typeof ImagePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
