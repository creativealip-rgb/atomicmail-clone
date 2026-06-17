import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@ui/ui";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "ghost", "destructive"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { children: "Compose", variant: "primary" } };
export const Secondary: Story = { args: { children: "Cancel", variant: "secondary" } };
export const Ghost: Story = { args: { children: "More", variant: "ghost" } };
export const Destructive: Story = { args: { children: "Delete", variant: "destructive" } };

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const Loading: Story = {
  args: { children: "Sending…", loading: true },
};

export const Disabled: Story = {
  args: { children: "Submit", disabled: true },
};

export const FullWidth: Story = {
  args: { children: "Continue", fullWidth: true, style: { width: 320 } },
};
