import React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Pencil } from "lucide-react"
import { Link } from "./link"
import { styleOverridesArgType, uneditableArgType } from "@storybook/argTypes"

const meta = {
  title: "ui/Link",
  component: Link,
  tags: ["autodocs"],
  args: {
    styleOverrides: {},
    href: "#",
    inline: false,
    disabled: false,
  },
  argTypes: {
    onClick: uneditableArgType(
      "(event: MouseEvent<HTMLAnchorElement>) => void",
      "Called when the link is clicked."
    ),
    inline: {
      control: { type: "boolean" },
      description: "Underline style for inline text.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    disabled: {
      control: { type: "boolean" },
      description: "Disabled when `true` or when `href` is omitted.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    href: {
      control: { type: "text" },
      description: "Link destination.",
      table: {
        type: { summary: "string | undefined" },
        defaultValue: { summary: "undefined" },
      },
    },
    children: {
      control: { type: "text" },
      description: "Link label.",
      table: {
        type: { summary: "ReactNode" },
        defaultValue: { summary: "undefined" },
      },
    },
    icon: uneditableArgType(
      "ReactNode",
      "Leading icon; set in story source (e.g. With Icon)."
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
  render: (args) => <Link {...args} />,
} satisfies Meta<typeof Link>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: "Click This Link",
  },
}

export const WithIcon: Story = {
  args: {
    children: "Click This Link",
  },
  render: (args) => <Link {...args} icon={<Pencil />} />,
}

export const Inline: Story = {
  args: {
    children: "Edit",
    inline: true,
  },
  decorators: [
    (Story) => (
      <div
        style={{
          maxWidth: 480,
          fontFamily: "'Inter', sans-serif",
          fontSize: 14,
          lineHeight: 1.5,
          color: "var(--neutral-9)",
        }}
      >
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea{" "}
          <Story />
          {" "}
          commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
          velit esse cillum dolore eu fugiat nulla pariatur.
        </p>
      </div>
    ),
  ],
}
