import React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Separator } from "./separator"
import { styleOverridesArgType } from "@storybook/argTypes"

const meta = {
  title: "ui/Separator",
  component: Separator,
  tags: ["autodocs"],
  args: { styleOverrides: {} },
  argTypes: {
    styleOverrides: styleOverridesArgType(),
    orientation: {
      control: { type: "radio" },
      options: ["horizontal", "vertical"],
    },
    className: {
      control: { type: "text" },
      description: "CSS class for the outermost container element.",
    },
  },
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: (args) => (
    <div style={{ width: 320 }}>
      <p>Above</p>
      <Separator {...args} />
      <p>Below</p>
    </div>
  ),
}

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, height: 48 }}>
      <span>Left</span>
      <Separator {...args} />
      <span>Right</span>
    </div>
  ),
}
