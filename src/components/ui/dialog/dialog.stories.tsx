import React, { useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Dialog } from "./dialog"
import { Button } from "../button"
import customStyles from "./dialog.custom-styles.module.css"
import { styleOverridesArgType, uneditableArgType } from "@storybook/argTypes"

type DialogStoryArgs = Omit<
  React.ComponentProps<typeof Dialog>,
  "children" | "footer" | "open" | "onOpenChange"
> & {
  children?: React.ReactNode
  footer?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

type DialogStoryRenderArgs = Omit<
  DialogStoryArgs,
  "children" | "footer" | "open" | "onOpenChange"
>

function DialogStoryDemo({
  args: rawArgs,
  triggerLabel = "Open Dialog",
  children,
  footer,
}: {
  args: DialogStoryArgs
  triggerLabel?: string
  children: React.ReactNode
  footer?: React.ReactNode | ((close: () => void) => React.ReactNode)
}) {
  const {
    open: _open,
    onOpenChange: _onOpenChange,
    children: _children,
    footer: _footer,
    ...args
  } = rawArgs
  const dialogArgs = args as DialogStoryRenderArgs
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  const defaultFooter =
    !dialogArgs.acknowledgment && !dialogArgs.passive
      ? (
          <>
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>
            <Button variant="default" onClick={close}>
              Confirm
            </Button>
          </>
        )
      : undefined

  const resolvedFooter =
    footer === undefined
      ? defaultFooter
      : typeof footer === "function"
        ? footer(close)
        : footer

  return (
    <div>
      <Button onClick={() => setOpen(true)}>{triggerLabel}</Button>
      <Dialog
        {...dialogArgs}
        open={open}
        onOpenChange={setOpen}
        footer={resolvedFooter}
      >
        {children}
      </Dialog>
    </div>
  )
}

const meta: Meta<DialogStoryArgs> = {
  title: "ui/Dialog",
  component: Dialog,
  args: {
    styleOverrides: {},
    size: "default",
    hideOverlay: false,
    acknowledgment: false,
    passive: false,
    disableClickOutside: false,
    disableCloseButton: false,
    disableEscapeKey: false,
  },
  parameters: {
    layout: "centered",
  },
  argTypes: {
    open: uneditableArgType(
      "boolean | undefined",
      "Controlled visibility; stories use local state and a trigger button."
    ),
    onOpenChange: uneditableArgType(
      "(open: boolean) => void",
      "Called when the open state has changed."
    ),
    children: uneditableArgType(
      "ReactNode",
      "Dialog body content; set in story source."
    ),
    footer: uneditableArgType(
      "ReactNode | undefined",
      "Footer actions; omitted when acknowledgment or passive applies."
    ),
    container: {
      table: { disable: true },
      control: false,
    },
    title: {
      control: { type: "text" },
      description: "Dialog title.",
      table: { type: { summary: "string" } },
    },
    size: {
      options: ["sm", "default", "lg", "xl", "full"],
      control: { type: "radio" },
      description: "Dialog width preset.",
      table: {
        type: { summary: "'sm' | 'default' | 'lg' | 'xl' | 'full'" },
        defaultValue: { summary: "default" },
      },
    },
    hideOverlay: {
      control: { type: "boolean" },
      description: "Hide dark background overlay (non-modal mode).",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    acknowledgment: {
      control: { type: "boolean" },
      description: "Show only an OK button in the footer.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    passive: {
      control: { type: "boolean" },
      description: "Hide the footer entirely.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    disableClickOutside: {
      control: { type: "boolean" },
      description: "Prevent closing by clicking outside the dialog.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    disableCloseButton: {
      control: { type: "boolean" },
      description: "Hide the header close (X) button.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    disableEscapeKey: {
      control: { type: "boolean" },
      description: "Prevent closing with the Escape key.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    className: {
      control: { type: "text" },
      description: "CSS class for the outermost container of the component.",
      table: {
        type: { summary: "string | undefined" },
        defaultValue: { summary: "undefined" },
      },
    },
    styleOverrides: styleOverridesArgType(),
  },
  render: (args) => (
    <DialogStoryDemo args={args as DialogStoryArgs}>
      <div>
        <p>This is a default modal dialog with Cancel and Confirm buttons.</p>
        <p>Click outside or press Escape to close.</p>
      </div>
    </DialogStoryDemo>
  ),
}

export default meta

type Story = StoryObj<Meta<DialogStoryArgs>>

export const Default: Story = {
  args: {
    title: "Default Dialog",
  },
}

export const Acknowledgment: Story = {
  args: {
    title: "Acknowledgment",
    acknowledgment: true,
  },
  render: (args) => (
    <DialogStoryDemo args={args as DialogStoryArgs} triggerLabel="Open Acknowledgment">
      <p>This dialog has only an OK button.</p>
      <p>The acknowledgment prop automatically generates it.</p>
    </DialogStoryDemo>
  ),
}

export const Passive: Story = {
  args: {
    title: "Passive Dialog",
    passive: true,
  },
  render: (args) => (
    <DialogStoryDemo args={args as DialogStoryArgs} triggerLabel="Open Passive">
      <p>
        With <strong>passive</strong> on, the footer is hidden. Turn it off in
        Controls to show Cancel and Confirm.
      </p>
      <p>Use the X button or click outside to close.</p>
    </DialogStoryDemo>
  ),
}

export const NonModal: Story = {
  args: {
    title: "Non-Modal Dialog",
    hideOverlay: true,
  },
  render: (args) => (
    <DialogStoryDemo
      args={args as DialogStoryArgs}
      triggerLabel="Open Non-Modal"
      footer={(close) => (
        <Button variant="default" onClick={close}>
          Close
        </Button>
      )}
    >
      <p>This is a non-modal dialog (no dark overlay).</p>
      <p>You can interact with the background content.</p>
    </DialogStoryDemo>
  ),
}

export const Large: Story = {
  args: {
    title: "Large Dialog",
    size: "lg",
  },
  render: (args) => (
    <DialogStoryDemo
      args={args as DialogStoryArgs}
      triggerLabel="Open Large"
      footer={(close) => (
        <Button variant="default" onClick={close}>
          Close
        </Button>
      )}
    >
      <div className="space-y-4">
        <p>This is a large dialog with more content.</p>
        <p>It has a maximum width of 3xl.</p>
        <p>Perfect for forms or detailed information.</p>
      </div>
    </DialogStoryDemo>
  ),
}

export const CustomStyles: Story = {
  args: {
    title: "Custom Styled Dialog",
    size: "lg",
    styleOverrides: customStyles,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pre-filled **styleOverrides** from `dialog.custom-styles.module.css` (cyan demo). Edit keys in Controls or reset to `{}`.",
      },
    },
  },
  render: (args) => (
    <DialogStoryDemo
      args={args as DialogStoryArgs}
      triggerLabel="Open Custom Styled"
      footer={(close) => (
        <Button variant="default" onClick={close}>
          Close
        </Button>
      )}
    >
      <p>This dialog uses a CSS module for customisation.</p>
      <p>
        Header: dark cyan; body: light cyan, monospace; footer: medium cyan.
        Close button uses cyan shades for hover, focus ring and pressed state.
      </p>
    </DialogStoryDemo>
  ),
}
