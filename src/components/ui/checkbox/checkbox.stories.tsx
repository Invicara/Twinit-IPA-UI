import React from "react"
import { StoryFn, Meta } from "@storybook/react"
import { Checkbox } from "./checkbox"

export default {
  title: "ui/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Label text next to the checkbox",
    },
    disabled: {
      control: "boolean",
      description: "Disable the checkbox",
    },
    defaultChecked: {
      control: "select",
      options: [false, true, "indeterminate"],
      description: "Initial checked state (true, false, or indeterminate)",
    },
  },
  parameters: {
    layout: "centered",
  },
} as Meta<typeof Checkbox>

const Template: StoryFn<
  React.ComponentProps<typeof Checkbox> & { label?: string }
> = (args) => {
  const { label = "Accept terms and conditions", ...checkboxProps } = args
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 1.25,
        color: "var(--neutral-9)",
        cursor: checkboxProps.disabled ? "not-allowed" : "pointer",
        opacity: checkboxProps.disabled ? 0.7 : 1,
      }}
    >
      <Checkbox {...checkboxProps} />
      <span>{label}</span>
    </label>
  )
}

export const Default = Template.bind({})
Default.args = {
  label: "Accept terms and conditions",
  disabled: false,
  defaultChecked: false,
}

export const Checked = Template.bind({})
Checked.args = {
  label: "Accept terms and conditions",
  disabled: false,
  defaultChecked: true,
}

export const Indeterminate = Template.bind({})
Indeterminate.args = {
  label: "Accept terms and conditions",
  disabled: false,
  defaultChecked: "indeterminate",
}

export const Disabled = Template.bind({})
Disabled.args = {
  label: "Accept terms and conditions",
  disabled: true,
  defaultChecked: false,
}
