import React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Pencil } from "lucide-react"
import { Button } from "./button"
import { styleOverridesArgType, uneditableArgType } from "@storybook/argTypes"

const meta = {
  title: "ui/Button",
  component: Button,
  args: {
    styleOverrides: {},
    asChild: false,
    disabled: false,
  },
  argTypes: {
    onClick: uneditableArgType(
      "(event: MouseEvent<HTMLButtonElement>) => void",
      "Called when the button is clicked."
    ),
    variant: {
      options: ["default", "secondary", "tertiary", "danger"],
      control: { type: "radio" },
      description: "Visual style.",
    },
    size: {
      options: ["default", "sm", "icon"],
      control: { type: "radio" },
      description: "Dimensions; use `icon` for icon-only buttons.",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Blocks clicks and shows disabled styling.",
    },
    asChild: {
      control: { type: "boolean" },
      description: "Apply button styles to the single child (e.g. a link).",
    },
    children: uneditableArgType(
      "ReactNode",
      "Label or content (string or React node)."
    ),
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
  parameters: {
    layout: "centered",
  },
  render: (args) => <Button {...args} />,
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: "default",
    size: "default",
    children: "Default",
    onClick: () => console.log("Default button clicked"),
  },
}

export const Secondary: Story = {
  args: {
    variant: "secondary",
    size: "default",
    children: "Secondary",
  },
}

export const Tertiary: Story = {
  args: {
    variant: "tertiary",
    size: "default",
    children: "Tertiary",
  },
}

export const Danger: Story = {
  args: {
    variant: "danger",
    size: "default",
    children: "Danger",
  },
}

export const Small: Story = {
  args: {
    variant: "default",
    size: "sm",
    children: "Small",
  },
}

export const Icon: Story = {
  args: {
    variant: "default",
    size: "icon",
    children: <Pencil />,
  },
}

export const WithIcon: Story = {
  args: {
    variant: "default",
    size: "default",
    children: (
      <>
        <Pencil />
        With icon
      </>
    ),
  },
}

export const Disabled: Story = {
  args: {
    variant: "default",
    size: "default",
    disabled: true,
    children: "Disabled",
  },
}

/** Toggle `asChild` and inspect DOM: `false` → `<button>`, `true` → `<a>` with same styles. */
export const AsChildEnabled: Story = {
  args: {
    variant: "default",
    size: "default",
    asChild: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Toggle **asChild** and open DevTools: off → `<button>`; on → `<a>` (Radix Slot). Link uses `preventDefault` only here. For icon + label with `asChild`, wrap in one `<span>`.",
      },
    },
  },
  render: ({ asChild = true, ...buttonArgs }) =>
    asChild ? (
      <Button {...buttonArgs} asChild>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          style={{ textDecoration: "none", color: "#fff" }}
        >
          Inspect to see root element change
        </a>
      </Button>
    ) : (
      <Button {...buttonArgs}>
        <span style={{ color: "#fff" }}>Open dashboard</span>
      </Button>
    ),
}
