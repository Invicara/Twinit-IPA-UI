import React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command"
import { styleOverridesArgType } from "@storybook/argTypes"

const meta = {
  title: "ui/Command",
  component: Command,
  tags: ["autodocs"],
  args: { styleOverrides: {} },
  argTypes: { styleOverrides: styleOverridesArgType() },
  render: () => (
    <div style={{ width: 320, border: "1px solid var(--neutral-3)", borderRadius: 4 }}>
      <Command>
        <CommandInput placeholder="Search commands..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>Calendar</CommandItem>
            <CommandItem>Search</CommandItem>
            <CommandItem>Settings</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
} satisfies Meta<typeof Command>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
