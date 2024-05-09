import { PortalHost } from "@gorhom/portal";
import type { Meta, StoryObj } from "@storybook/react";
import { View, Text } from "tamagui";

import HorizontalList from "./HorizontalList";

const meta = {
  component: HorizontalList,
  decorators: [
    (Story) => (
      <View w="100%" h="100%" jc="center" ai="center">
        <PortalHost name="RootPortalHost" />
        <View w="100%" h="$12">
          <Story />
        </View>
      </View>
    ),
  ],
  argTypes: {
    numColumns: {
      type: "number",
    },
  },
  args: {
    data: [...Array(1000).keys()],
    numColumns: 1,
    renderItem: ({ item }) => (
      <View h="$2" w="$2">
        <Text>{item}</Text>
      </View>
    ),
  },
} satisfies Meta<typeof HorizontalList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
