import React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Badge } from "./badge"
import { styleOverridesArgType } from "@storybook/argTypes"

const meta = {
  title: "ui/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: {
    styleOverrides: {},
    variant: "default",
    children: "Badge",
  },
  argTypes: {
    styleOverrides: styleOverridesArgType(),
    variant: {
      control: { type: "radio" },
      options: ["default", "secondary", "outline"],
    },
    className: {
      control: { type: "text" },
      description: "CSS class for the outermost container element.",
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Secondary: Story = {
  args: { variant: "secondary", children: "Secondary" },
}

export const Outline: Story = {
  args: { variant: "outline", children: "Outline" },
}
