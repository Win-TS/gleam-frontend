import { PortalHost } from "@gorhom/portal";
import type { Meta, StoryObj } from "@storybook/react";
import { View } from "tamagui";

import ProfileHeader from "./ProfileHeader";

const meta = {
  component: ProfileHeader,
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
    userprofile: {
      username: "username",
      firstname: "firstname",
      lastname: "lastname",
      friends_count: 10,
      photo_url: "https://placehold.co/400",
      max_streak: 20,
    },
  },
} satisfies Meta<typeof ProfileHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
