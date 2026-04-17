import React from "react"
import { StoryFn, Meta } from "@storybook/react"
import { Pencil } from "lucide-react"
import { Button } from "./button"

export default {
  title: "ui/Button",
  component: Button,
  argTypes: {
    variant: {
      options: ["default", "secondary", "tertiary", "danger"],
      control: { type: "radio" },
    },
    size: {
      options: ["default", "sm", "icon"],
      control: { type: "radio" },
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
  parameters: {
    layout: "centered",
  },
} as Meta<typeof Button>

const Template: StoryFn<React.ComponentProps<typeof Button>> = (args) => (
  <Button {...args} />
)

export const Default = Template.bind({})
Default.args = {
  variant: "default",
  size: "default",
  children: "Default",
}

export const Secondary = Template.bind({})
Secondary.args = {
  variant: "secondary",
  size: "default",
  children: "Secondary",
}

export const Tertiary = Template.bind({})
Tertiary.args = {
  variant: "tertiary",
  size: "default",
  children: "Tertiary",
}

export const Danger = Template.bind({})
Danger.args = {
  variant: "danger",
  size: "default",
  children: "Danger",
}

export const Small = Template.bind({})
Small.args = {
  variant: "default",
  size: "sm",
  children: "Small",
}

export const Icon = Template.bind({})
Icon.args = {
  variant: "default",
  size: "icon",
  children: <Pencil />,
}

export const WithIcon = Template.bind({})
WithIcon.args = {
  variant: "default",
  size: "default",
  children: (
    <>
      <Pencil />
      With icon
    </>
  ),
}

export const Disabled = Template.bind({})
Disabled.args = {
  variant: "default",
  size: "default",
  disabled: true,
  children: "Disabled",
}
