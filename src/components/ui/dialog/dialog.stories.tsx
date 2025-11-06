import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Dialog } from './dialog';
import Button from '../button/button';

const meta: Meta<typeof Dialog> = {
  title: 'UI/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    title: {
      control: { type: 'text' },
      description: 'Dialog title',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'default', 'lg', 'xl', 'full'],
      description: 'Dialog size',
    },
    hideOverlay: {
      control: { type: 'boolean' },
      description: 'Hide dark background (non-modal mode)',
    },
    acknowledgment: {
      control: { type: 'boolean' },
      description: 'Show only OK button',
    },
    passive: {
      control: { type: 'boolean' },
      description: 'Hide footer entirely',
    },
    disableClickOutside: {
      control: { type: 'boolean' },
      description: 'Prevent closing by clicking outside',
    },
    disableCloseButton: {
      control: { type: 'boolean' },
      description: 'Hide the X close button',
    },
    disableEscapeKey: {
      control: { type: 'boolean' },
      description: 'Prevent closing with Escape key',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
    classNames: {
      control: { type: 'object' },
      description: 'Custom class names for sub-components (not editable in controls)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Default Dialog',
    size: 'default',
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <Dialog
          {...args as any}
          open={open}
          onOpenChange={setOpen}
          footer={
            <>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="default" onClick={() => setOpen(false)}>
                Confirm
              </Button>
            </>
          }
        >
          <div>
            <p>This is a default modal dialog with Cancel and Confirm buttons.</p>
            <p>Click outside or press Escape to close.</p>
          </div>
        </Dialog>
      </div>
    );
  },
};

export const Acknowledgment: Story = {
  args: {
    title: 'Acknowledgment',
    size: 'default',
    acknowledgment: true,
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <Button onClick={() => setOpen(true)}>Open Acknowledgment</Button>
        <Dialog {...args as any} open={open} onOpenChange={setOpen}>
          <p>This dialog has only an OK button.</p>
          <p>The acknowledgment prop automatically generates it.</p>
        </Dialog>
      </div>
    );
  },
};

export const Passive: Story = {
  args: {
    title: 'Passive Dialog',
    size: 'default',
    passive: true,
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <Button onClick={() => setOpen(true)}>Open Passive</Button>
        <Dialog {...args as any} open={open} onOpenChange={setOpen}>
          <p>This is a passive dialog with no footer.</p>
          <p>Use the X button or click outside to close.</p>
        </Dialog>
      </div>
    );
  },
};

export const NonModal: Story = {
  args: {
    title: 'Non-Modal Dialog',
    size: 'default',
    hideOverlay: false,
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <Button onClick={() => setOpen(true)}>Open Non-Modal</Button>
        <Dialog
          {...args as any}
          open={open}
          onOpenChange={setOpen}
          footer={
            <Button variant="default" onClick={() => setOpen(false)}>
              Close
            </Button>
          }
        >
          <p>This is a non-modal dialog (no dark overlay).</p>
          <p>You can interact with the background content.</p>
        </Dialog>
      </div>
    );
  },
};

export const CustomStyles: Story = {
  args: {
    title: 'Custom Styled Dialog',
    size: 'lg',
    classNames: {
      header: 'bg-brand-1 text-brand-8',
      title: 'text-xl font-bold',
      body: 'bg-neutral-05',
      footer: 'bg-brand-1',
    },
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <Button onClick={() => setOpen(true)}>Open Custom Styled</Button>
        <Dialog
          {...args as any}
          open={open}
          onOpenChange={setOpen}
          footer={
            <Button variant="default" onClick={() => setOpen(false)}>
              Close
            </Button>
          }
        >
          <p>This dialog demonstrates custom classNames prop.</p>
          <p>Each section can be styled independently using the classNames object.</p>
        </Dialog>
      </div>
    );
  },
};

export const Large: Story = {
  args: {
    title: 'Large Dialog',
    size: 'lg',
  },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <Button onClick={() => setOpen(true)}>Open Large</Button>
        <Dialog
          {...args as any}
          open={open}
          onOpenChange={setOpen}
          footer={
            <Button variant="default" onClick={() => setOpen(false)}>
              Close
            </Button>
          }
        >
          <div className="space-y-4">
            <p>This is a large dialog with more content.</p>
            <p>It has a maximum width of 3xl.</p>
            <p>Perfect for forms or detailed information.</p>
          </div>
        </Dialog>
      </div>
    );
  },
};
