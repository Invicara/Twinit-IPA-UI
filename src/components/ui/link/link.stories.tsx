import React from "react"
import { StoryFn, Meta } from "@storybook/react"
import { Pencil } from "lucide-react"
import { Link } from "./link"

export default {
  title: "ui/Link",
  component: Link,
  argTypes: {
    inline: {
      control: { type: "boolean" },
      description: "Underline style for inline text",
    },
    disabled: {
      control: { type: "boolean" },
    },
    href: {
      control: { type: "text" },
    },
  },
  parameters: {
    layout: "centered",
  },
} as Meta<typeof Link>

const Template: StoryFn<typeof Link> = (args) => <Link {...args} />

export const Default = Template.bind({})
Default.args = {
  href: "#",
  children: "Click This Link",
  inline: false,
  disabled: false,
}

export const WithIcon = Template.bind({})
WithIcon.args = {
  href: "#",
  children: "Click This Link",
  inline: false,
  disabled: false,
  icon: <Pencil />,
}

export const Inline = Template.bind({})
Inline.args = {
  href: "#",
  children: "Edit",
  inline: true,
  disabled: false,
}

Inline.decorators = [
  (Story) => (
    <div style={{ maxWidth: 480, fontFamily: "'Inter', sans-serif", fontSize: 14, lineHeight: 1.5, color: "var(--neutral-9)" }}>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea{" "}
        <Story />
        {" "}commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      </p>
    </div>
  ),
]
