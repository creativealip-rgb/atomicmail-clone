import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "@ui/ui";

const meta: Meta<typeof Spinner> = {
  title: "Components/Spinner",
  component: Spinner,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = { args: { size: 20 } };
export const Small: Story = { args: { size: 12 } };
export const Large: Story = { args: { size: 48 } };
export const Fullscreen: Story = { args: { fullscreen: true } };
