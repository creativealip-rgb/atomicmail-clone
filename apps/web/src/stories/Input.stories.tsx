import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@ui/ui";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { label: "Email", placeholder: "you@chainmail.app" },
};
export const WithHelper: Story = {
  args: { label: "Password", type: "password", helper: "Use at least 8 characters" },
};
export const WithError: Story = {
  args: { label: "Email", defaultValue: "invalid", error: "Must be a valid email address" },
};
export const Disabled: Story = {
  args: { label: "Email", disabled: true, defaultValue: "locked@chainmail.app" },
};
