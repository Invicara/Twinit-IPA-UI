import React from "react"
import type { ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { RadioGroup } from "./radio-group"
import { styleOverridesArgType, uneditableArgType } from "@storybook/argTypes"

type RadioOption = {
  value: string
  label: string
  disabled?: boolean
}

const defaultOptions: RadioOption[] = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
]

function normalizeOptions(options: unknown): RadioOption[] {
  if (!Array.isArray(options) || options.length === 0) {
    return defaultOptions
  }

  const normalized = options
    .filter(
      (item): item is RadioOption =>
        item != null &&
        typeof item === "object" &&
        typeof (item as RadioOption).value === "string" &&
        typeof (item as RadioOption).label === "string"
    )
    .map((item) => ({
      value: item.value,
      label: item.label,
      ...(item.disabled === true ? { disabled: true } : {}),
    }))

  return normalized.length > 0 ? normalized : defaultOptions
}

function clampToOptionValue(
  selected: string | null | undefined,
  optionValues: string[]
): string | undefined {
  if (optionValues.length === 0) return undefined
  if (selected != null && optionValues.includes(selected)) return selected
  return optionValues[0]
}

type RadioGroupStoryArgs = ComponentProps<typeof RadioGroup> & {
  mode?: "uncontrolled" | "controlled"
}

const meta = {
  title: "ui/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  args: {
    styleOverrides: {},
    mode: "uncontrolled",
    label: "Choose Option",
    options: defaultOptions,
    defaultValue: "option3",
    disabled: false,
    horizontal: false,
  },
  argTypes: {
    mode: {
      control: { type: "radio" },
      options: ["uncontrolled", "controlled"],
      description: "Storybook only: uncontrolled (`defaultValue`) vs controlled (`value`).",
      table: { disable: true },
    },
    value: {
      if: { arg: "mode", eq: "controlled" },
      control: { type: "text" },
      description: "Controlled selected value; must match an option `value`.",
      table: {
        type: { summary: "string | undefined" },
        defaultValue: { summary: "undefined" },
      },
    },
    onValueChange: uneditableArgType(
      "(value: string) => void",
      "Called when the selected value has changed."
    ),
    defaultValue: {
      if: { arg: "mode", eq: "uncontrolled" },
      control: { type: "text" },
      description: "Initial selected value; must match an option `value`.",
      table: {
        type: { summary: "string | undefined" },
        defaultValue: { summary: "undefined" },
      },
    },
    options: {
      control: { type: "object" },
      description: "Array of radio items to choose from.",
      table: {
        type: {
          summary: "Array<{ value: string; label: string; disabled?: boolean }>",
        },
        defaultValue: { summary: "[]" },
      },
    },
    horizontal: {
      control: { type: "boolean" },
      description: "Layout options in a row.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    label: {
      control: { type: "text" },
      description: "Text above the radio group.",
      table: {
        type: { summary: "string | undefined" },
        defaultValue: { summary: "undefined" },
      },
    },
    disabled: {
      control: { type: "boolean" },
      description: "Disable the entire group.",
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
  parameters: {
    layout: "centered",
  },
  render: ({
    mode = "uncontrolled",
    value,
    defaultValue,
    options: rawOptions,
    ...rest
  }) => {
    const options = normalizeOptions(rawOptions)
    const optionValues = options.map((option) => option.value)
    const groupProps =
      mode === "controlled"
        ? {
          ...rest,
          options,
          value: clampToOptionValue(value, optionValues),
        }
        : {
          ...rest,
          options,
          defaultValue: clampToOptionValue(defaultValue, optionValues),
        }

    return (
      <div style={{ width: 280, display: "flex", justifyContent: "center" }}>
        <RadioGroup {...groupProps} />
      </div>
    )
  },
} satisfies Meta<RadioGroupStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Horizontal: Story = {
  args: {
    horizontal: true,
  },
}

export const Controlled: Story = {
  args: {
    mode: "controlled",
    value: "option2",
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
