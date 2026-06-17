import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "@ui/ui";

const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Off: Story = { args: { checked: false, "aria-label": "Toggle" } };
export const On: Story = { args: { checked: true, "aria-label": "Toggle" } };
export const Disabled: Story = { args: { disabled: true, "aria-label": "Toggle" } };
