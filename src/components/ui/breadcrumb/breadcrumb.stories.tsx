import React from "react"
import { StoryFn, Meta } from "@storybook/react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb"

export default {
  title: "ui/Breadcrumb",
  component: Breadcrumb,
  argTypes: {
    className: {
      control: "text",
      description: "Additional CSS classes for the nav",
    },
  },
  parameters: {
    layout: "centered",
  },
} as Meta<typeof Breadcrumb>

const Template: StoryFn<React.ComponentProps<typeof Breadcrumb>> = (args) => (
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
)

export const Default = Template.bind({})
Default.args = {}
