import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import Dialog from "./dialog";
import Button from "../button/button";

export default {
  title: "ui/Dialog",
  component: Dialog,
  argTypes: {
    size: {
      options: ['default', 'lg'],
      control: { type: 'radio' },
    },
    type: {
      options: ['modal', 'non-modal'],
      control: { type: 'radio' },
    },
    variant: {
      options: ['default', 'acknowledgment', 'passive'],
      control: { type: 'radio' },
    },
    open: {
      control: { type: 'boolean' },
    },
  },
  parameters: {
    layout: 'centered',
  }
} as Meta<typeof Dialog>;

const Template: StoryFn<typeof Dialog> = (args) => {
  const [open, setOpen] = React.useState(args.open || false);

  const actionButtons = (
    <div className="flex gap-2">
      <Button variant="outline" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button variant="default" onClick={() => setOpen(false)}>
        Confirm
      </Button>
    </div>
  );

  return (
    <div>
      <Button onClick={() => setOpen(true)}>
        Open Dialog
      </Button>
      <Dialog
        {...args}
        open={open}
        onOpenChange={setOpen}
        actionButtons={actionButtons}
      />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  title: "Default Dialog",
  bodyContent: (
    <div>
      <p>This is a default dialog with action buttons.</p>
      <p>You can add any content here.</p>
    </div>
  ),
  size: "default",
  type: "modal",
  variant: "default",
  open: false,
};

export const Acknowledgment = Template.bind({});
Acknowledgment.args = {
  title: "Acknowledgment Dialog",
  bodyContent: (
    <div>
      <p>This is an acknowledgment dialog with only an OK button.</p>
    </div>
  ),
  size: "default",
  type: "modal",
  variant: "acknowledgment",
  open: false,
};

export const Passive = Template.bind({});
Passive.args = {
  title: "Passive Dialog",
  bodyContent: (
    <div>
      <p>This is a passive dialog with no action buttons.</p>
    </div>
  ),
  size: "default",
  type: "modal",
  variant: "passive",
  open: false,
};

export const Large = Template.bind({});
Large.args = {
  title: "Large Dialog",
  bodyContent: (
    <div>
      <p>This is a large dialog with more content.</p>
      <p>It has a maximum width of 3xl.</p>
    </div>
  ),
  size: "lg",
  type: "modal",
  variant: "default",
  open: false,
};

export const NonModal = Template.bind({});
NonModal.args = {
  title: "Non-Modal Dialog",
  bodyContent: (
    <div>
      <p>This is a non-modal dialog. You can click outside to interact with the background.</p>
    </div>
  ),
  size: "default",
  type: "non-modal",
  variant: "default",
  open: false,
};