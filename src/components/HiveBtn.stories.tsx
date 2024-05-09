import { PortalHost } from "@gorhom/portal";
import type { Meta, StoryObj } from "@storybook/react";
import { View } from "tamagui";

import HiveBtn from "./HiveBtn";

const meta = {
  component: HiveBtn,
  decorators: [
    (Story) => (
      <View w="100%" h="100%" jc="center" ai="center">
        <PortalHost name="RootPortalHost" />
        <View w="$8" h="$8">
          <Story />
        </View>
      </View>
    ),
  ],
  argTypes: {},
  args: {
    hive: {
      group_id: 1,
      group_name: "name",
      group_type: "public",
      photo_url: { String: "https://placehold.co/400", Valid: true },
    },
    overlay: "0",
  },
} satisfies Meta<typeof HiveBtn>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
