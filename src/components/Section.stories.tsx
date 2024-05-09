import { PortalHost } from "@gorhom/portal";
import type { Meta, StoryObj } from "@storybook/react";
import { View, Text } from "tamagui";

import Section from "./Section";

const meta = {
  component: Section,
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
  render: ({ children, ...args }) => (
    <Section {...args}>
      <View w="100%" p="$3">
        <Text>{children}</Text>
      </View>
    </Section>
  ),
  argTypes: {},
  args: {
    children: "children",
  },
} satisfies Meta<typeof Section>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
