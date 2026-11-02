import React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb"
import { styleOverridesArgType } from "@storybook/argTypes"

const meta = {
  title: "ui/Breadcrumb",
  component: Breadcrumb,
  argTypes: {
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
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/components">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
} satisfies Meta<typeof Breadcrumb>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    styleOverrides: {},
  },
}
