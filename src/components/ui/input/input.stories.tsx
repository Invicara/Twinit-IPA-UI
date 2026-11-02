import React from "react"
import type { ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"
import { Bell, Mail } from "lucide-react"
import { Input } from "./input"
import { styleOverridesArgType, uneditableArgType } from "@storybook/argTypes"

const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1)

type InputStoryArgs = ComponentProps<typeof Input> & {
  mode?: "uncontrolled" | "controlled"
}

const meta = {
  title: "ui/Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    styleOverrides: {},
    mode: "uncontrolled",
    onChange: fn(),
    state: "default",
    disabled: false,
    password: false,
    textarea: false,
    clearable: false,
    fitContent: false,
  },
  argTypes: {
    mode: {
      control: { type: "radio" },
      options: ["uncontrolled", "controlled"],
      description: "Storybook only: uncontrolled (type on canvas) vs controlled (`value` from Controls).",
      table: { disable: true },
    },
    value: {
      if: { arg: "mode", eq: "controlled" },
      control: { type: "text" },
      description: "Controlled input value.",
      table: {
        type: { summary: "string | undefined" },
        defaultValue: { summary: "undefined" },
      },
    },
    onChange: uneditableArgType(
      "(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void",
      "Called when the input value has changed."
    ),
    state: {
      options: ["default", "error", "success", "warning", "readonly"],
      control: { type: "select" },
      description:
        "Visual state. Tab or click to test focus styling.",
      table: {
        type: {
          summary: '"default" | "error" | "success" | "warning" | "readonly"',
        },
        defaultValue: { summary: "default" },
      },
    },
    size: {
      options: ["default", "sm", "lg"],
      control: { type: "radio" },
      description: "Field size. `sm` = 32px height, `lg` = 40px height.",
      table: {
        type: { summary: '"default" | "sm" | "lg"' },
        defaultValue: { summary: "default" },
      },
    },
    fitContent: {
      control: { type: "boolean" },
      description: "Shrink outer wrapper to fit content width.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    placeholder: {
      control: { type: "text" },
      description:
        "Light placeholder text shown when the input is empty.",
      table: {
        type: { summary: "string | undefined" },
        defaultValue: { summary: "undefined" },
      },
    },
    label: {
      control: { type: "text" },
      description: "Text over the input.",
      table: {
        type: { summary: "string | undefined" },
        defaultValue: { summary: "undefined" },
      },
    },
    helperText: {
      control: { type: "text" },
      description: "Text under the input.",
      table: {
        type: { summary: "string | undefined" },
        defaultValue: { summary: "undefined" },
      },
    },
    disabled: {
      control: { type: "boolean" },
      description: "Disable the input.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    password: {
      if: { arg: "textarea", eq: false },
      control: { type: "boolean" },
      description: "Password mode with eye-icon toggle.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    textarea: {
      if: { arg: "password", eq: false },
      control: { type: "boolean" },
      description: "Render as expandable textarea instead of input.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    icon: uneditableArgType(
      "ReactNode",
      "Leading icon; set in story source (e.g. With Icon)."
    ),
    clearable: {
      if: { arg: "textarea", eq: false },
      control: { type: "boolean" },
      description: "Show an X icon inside the field to clear the current value.",
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
  render: ({ mode = "uncontrolled", value, ...rest }) => {
    const placeholder =
      rest.placeholder !== undefined
        ? rest.placeholder
        : capitalize(rest.state ?? "default")
    const inputProps =
      mode === "controlled" ? { ...rest, value } : rest

    return (
      <div style={{ width: rest.textarea ? 272 : 224 }}>
        <Input {...inputProps} placeholder={placeholder} />
      </div>
    )
  },
} satisfies Meta<InputStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: "Label",
    helperText: "Status Label",
    size: "default",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Type in the input and check the **Actions** tab for logged `onChange` events from the `fn()` spy.",
      },
    },
  },
}

export const Controlled: Story = {
  args: {
    label: "Label",
    helperText: "Value driven from Controls",
    mode: "controlled",
    value: "Controlled value",
  },
}

export const WithIcon: Story = {
  args: {
    label: "With Icon",
    helperText: "Icon appears on the left",
    placeholder: "Notifications",
  },
  render: (args) => (
    <div style={{ width: 224 }}>
      <Input {...args} icon={<Bell />} />
    </div>
  ),
}

export const Password: Story = {
  args: {
    label: "Password",
    helperText: "Click eye icon to toggle visibility",
    password: true,
    placeholder: "Enter password",
  },
}

export const Clearable: Story = {
  args: {
    label: "Search",
    helperText: "Click X to clear the field",
    clearable: true,
    placeholder: "Clearable",
    defaultValue: "xyz",
  },
}

export const TextArea: Story = {
  args: {
    label: "Message",
    helperText: "Drag bottom-right corner to resize",
    textarea: true,
    placeholder: "Enter your message",
  },
}

export const PasswordWithIcon: Story = {
  args: {
    label: "Email Password",
    helperText: "Both icon and password toggle",
    password: true,
    placeholder: "Email password",
  },
  render: (args) => (
    <div style={{ width: 224 }}>
      <Input {...args} icon={<Mail />} />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 280 }}>
      <Input label="Default (36px)" size="default" placeholder="Default size" />
      <Input label="Small (32px)" size="sm" placeholder="Small size" />
      <Input label="Large (40px)" size="lg" placeholder="Large size" />
      <Input fitContent size="sm" placeholder="Inline sm filter" />
    </div>
  ),
}
