import React from "react"
import type { ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Checkbox } from "./checkbox"
import { styleOverridesArgType, uneditableArgType } from "@storybook/argTypes"

type CheckboxStoryArgs = ComponentProps<typeof Checkbox> & {
  label?: string
  mode?: "uncontrolled" | "controlled"
}

const meta = {
  title: "ui/Checkbox",
  component: Checkbox,
  args: {
    styleOverrides: {},
    mode: "uncontrolled",
    disabled: false,
    indeterminate: false,
  },
  argTypes: {
    mode: {
      control: { type: "radio" },
      options: ["uncontrolled", "controlled"],
      description: "Storybook only: which Checkbox API to demonstrate.",
      table: { disable: true },
    },
    checked: {
      if: { arg: "mode", eq: "controlled" },
      control: { type: "select" },
      options: [false, true, "indeterminate"],
      description: "Controlled checked state.",
      table: {
        type: { summary: "boolean | 'indeterminate'" },
        defaultValue: { summary: "false" },
      },
    },
    onCheckedChange: uneditableArgType(
      "(checked: boolean | 'indeterminate') => void",
      "Called when the checked state has changed."
    ),
    defaultChecked: {
      if: { arg: "mode", eq: "uncontrolled" },
      control: { type: "select" },
      options: [false, true, "indeterminate"],
      description:
        "Initial checked state. Omitted + **`indeterminate`** = mixed start + tri-state clicks. Plain on/off when **`indeterminate`** is false.",
      table: {
        type: { summary: "boolean | 'indeterminate' | undefined" },
        defaultValue: { summary: "undefined" },
      },
    },
    indeterminate: {
      if: { arg: "mode", eq: "uncontrolled" },
      control: { type: "boolean" },
      description:
        "When `true`, starts **mixed** if `defaultChecked` is omitted. Tri-state loop: mixed → on → off → mixed.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    value: {
      table: { disable: true },
      control: false,
    },
    label: {
      control: "text",
      description: "Story-only label text beside the checkbox.",
      table: {
        type: { summary: "string | undefined" },
        defaultValue: { summary: "undefined" },
      },
    },
    disabled: {
      control: { type: "boolean" },
      description: "Disable the checkbox.",
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
    label,
    mode = "uncontrolled",
    checked,
    defaultChecked,
    indeterminate,
    ...rest
  }) => {
    const id = React.useId()
    const checkboxProps =
      mode === "controlled"
        ? { ...rest, checked }
        : {
          ...rest,
          indeterminate,
          ...(defaultChecked !== undefined ? { defaultChecked } : {}),
        }

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
          fontSize: 14,
          fontWeight: 500,
          lineHeight: 1.25,
          color: "var(--neutral-9)",
        }}
      >
        <Checkbox id={id} {...checkboxProps} />
        {label != null && (
          <label
            htmlFor={id}
            style={{
              cursor: checkboxProps.disabled ? "not-allowed" : "pointer",
              opacity: checkboxProps.disabled ? 0.7 : 1,
              userSelect: "none",
            }}
          >
            {label}
          </label>
        )}
      </div>
    )
  },
} satisfies Meta<CheckboxStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: "Accept terms and conditions",
  },
}

export const Checked: Story = {
  args: {
    label: "Accept terms and conditions",
    defaultChecked: true,
  },
}

export const Indeterminate: Story = {
  args: {
    label: "Accept terms and conditions",
    indeterminate: true,
  },
}

export const Controlled: Story = {
  args: {
    label: "Accept terms and conditions",
    mode: "controlled",
    checked: true,
  },
}

export const Disabled: Story = {
  args: {
    label: "Accept terms and conditions",
    disabled: true,
  },
}
