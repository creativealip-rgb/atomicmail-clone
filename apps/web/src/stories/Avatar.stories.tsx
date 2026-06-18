import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "@ui/ui";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    size: { control: { type: "range", min: 16, max: 96, step: 4 } },
    name: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = { args: { name: "alipdev@chainmail.app", size: 40 } };
export const Small: Story = { args: { name: "support@chainmail.app", size: 24 } };
export const Large: Story = { args: { name: "no-reply@chainmail.app", size: 64 } };
export const Single: Story = { args: { name: "?", size: 32 } };

export const Grid: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      {[
        "alice@chainmail.app",
        "bob@chainmail.app",
        "carol@chainmail.app",
        "dave@chainmail.app",
        "eve@chainmail.app",
        "frank@chainmail.app",
      ].map((n) => (
        <Avatar key={n} name={n} size={40} />
      ))}
    </div>
  ),
};
