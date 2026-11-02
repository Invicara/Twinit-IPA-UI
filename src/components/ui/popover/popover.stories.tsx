import React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Button } from "../button"
import { styleOverridesArgType, uneditableArgType } from "@storybook/argTypes"

const meta = {
  title: "ui/Popover",
  component: Popover,
  tags: ["autodocs"],
  args: { styleOverrides: {} },
  argTypes: {
    styleOverrides: styleOverridesArgType(),
    open: uneditableArgType("boolean", "Controlled open state."),
    onOpenChange: uneditableArgType("(open: boolean) => void", "Called when open state changes."),
  },
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p style={{ margin: 0 }}>Popover content for filters, pickers, and menus.</p>
      </PopoverContent>
    </Popover>
  ),
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
