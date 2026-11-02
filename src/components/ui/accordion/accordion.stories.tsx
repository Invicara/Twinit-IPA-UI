import React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion"
import { styleOverridesArgType, uneditableArgType } from "@storybook/argTypes"

const meta = {
  title: "ui/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  argTypes: {
    value: uneditableArgType(
      "string | string[] | undefined",
      "Controlled open item(s); stories use defaultValue."
    ),
    onValueChange: uneditableArgType(
      "(value: string | string[]) => void",
      "Called when the open section(s) change."
    ),
    defaultValue: uneditableArgType(
      "string | string[] | undefined",
      "Initial open item(s); type-dependent (single vs multiple). Set per story, not Controls."
    ),
    type: {
      options: ["single", "multiple"],
      control: { type: "radio" },
      description: "Single: one section open; multiple: several open.",
      table: {
        type: { summary: '"single" | "multiple"' },
        defaultValue: { summary: "single" },
      },
    },
    collapsible: {
      control: { type: "boolean" },
      description:
        'When `false`, the open section cannot be fully closed (`type="single"` only).',
      if: { arg: "type", eq: "single" },
      table: {
        type: { summary: "boolean | undefined" },
        defaultValue: { summary: "true" },
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
  args: {
    styleOverrides: {},
    type: "single",
    collapsible: true,
  },
  parameters: {
    layout: "centered",
  },
  render: (args) => (
    <div style={{ width: 480 }}>
      <Accordion {...args}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it styled?</AccordionTrigger>
          <AccordionContent>
            Yes. It comes with default styles that match the other components&apos;
            aesthetic.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Is it animated?</AccordionTrigger>
          <AccordionContent>
            Yes. It&apos;s animated by default, but you can disable it if you prefer.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
} satisfies Meta<typeof Accordion>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** `type="multiple"`: several sections can be open; Radix has no `collapsible` prop here. */
export const Multiple: Story = {
  args: {
    type: "multiple",
    defaultValue: ["item-1"],
  },
}

/** With `collapsible: false`, one section must stay open (`type="single"` only). */
export const NonCollapsible: Story = {
  args: {
    collapsible: false,
    defaultValue: "item-1",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Toggle sections open, but the open item cannot be fully closed. Requires **`defaultValue`** so one section starts open.",
      },
    },
  },
}
