import type { Meta, StoryObj } from "@storybook/react";
import { Dialog, Button } from "@ui/ui";
import { useState } from "react";

const meta: Meta<typeof Dialog> = {
  title: "Components/Dialog",
  component: Dialog,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Basic: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Create alias"
          description="Create a new hide-my-email address to protect your identity."
        >
          <p>Dialog content here</p>
        </Dialog>
      </>
    );
  },
};

export const Delete: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>Delete account</Button>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title="Delete account?"
          description="This action is permanent. All your data will be lost."
          width={420}
        >
          <Button variant="destructive" onClick={() => setOpen(false)}>
            Yes, delete
          </Button>
        </Dialog>
      </>
    );
  },
};
