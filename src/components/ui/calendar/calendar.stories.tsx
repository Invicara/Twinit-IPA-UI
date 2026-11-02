import React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Calendar } from "./calendar"
import { DatePicker, DateRangePicker } from "./date-picker"
import { styleOverridesArgType } from "@storybook/argTypes"

const meta = {
  title: "ui/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  args: { styleOverrides: {} },
  argTypes: { styleOverrides: styleOverridesArgType() },
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

export const Single: Story = {
  render: (args) => <Calendar {...args} mode="single" />,
}

export const LabelCaption: Story = {
  render: (args) => (
    <Calendar {...args} mode="single" captionLayout="label" navLayout={undefined} />
  ),
}

export const Range: Story = {
  render: (args) => <Calendar {...args} mode="range" />,
}

export const DatePickerSingle: StoryObj<typeof DatePicker> = {
  render: (args) => <DatePicker {...args} />,
}

export const DatePickerRange: StoryObj<typeof DateRangePicker> = {
  render: (args) => <DateRangePicker {...args} />,
}

export const DatePickerRangeRelative: StoryObj<typeof DateRangePicker> = {
  args: {
    showToday: true,
    showThisWeek: true,
    showThisMonth: true,
    showThisQuarter: true,
    showThisYear: true,
  },
  render: (args) => <DateRangePicker {...args} />,
}
