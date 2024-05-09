import { PortalHost } from "@gorhom/portal";
import type { Meta, StoryObj } from "@storybook/react";
import { View } from "tamagui";

import GleamContainer from "./GleamContainer";

const meta = {
  component: GleamContainer,
  decorators: [
    (Story) => (
      <View w="100%" h="100%" jc="center" ai="center">
        <PortalHost name="RootPortalHost" />
        <Story />
      </View>
    ),
  ],
  argTypes: {},
  args: { children: "content" },
} satisfies Meta<typeof GleamContainer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
