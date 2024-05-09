import { PortalHost } from "@gorhom/portal";
import type { Meta, StoryObj } from "@storybook/react";
import { View } from "tamagui";

import Post from "./Post";

const meta = {
  component: Post,
  decorators: [
    (Story) => (
      <View w="100%" h="100%" jc="center" ai="center">
        <PortalHost name="RootPortalHost" />
        <View w="$20" h="100%" jc="center" ai="center">
          <Story />
        </View>
      </View>
    ),
  ],
  argTypes: {},
  args: {
    post: {
      post_id: 1,
      member_id: 1,
      group_id: 1,
      photo_url: { String: "https://placehold.co/800", Valid: true },
      description: { String: "description", Valid: true },
      created_at: new Date().toISOString().split("T")[0],
    },
    streak: 1,
  },
} satisfies Meta<typeof Post>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
