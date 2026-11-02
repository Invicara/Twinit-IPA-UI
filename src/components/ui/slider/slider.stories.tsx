import React from "react"
import type { ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Slider } from "./slider"
import { styleOverridesArgType, uneditableArgType } from "@storybook/argTypes"

type SliderStoryArgs = ComponentProps<typeof Slider> & {
  mode?: "uncontrolled" | "controlled"
}

function sliderRemountKey(
  mode: "uncontrolled" | "controlled",
  range: boolean | undefined,
  defaultValue: number[] | undefined,
  value: number[] | undefined
) {
  const positions = mode === "controlled" ? value : defaultValue
  return `${mode}-${range ?? false}-${JSON.stringify(positions ?? null)}`
}

const meta = {
  title: "ui/Slider",
  component: Slider,
  tags: ["autodocs"],
  args: {
    styleOverrides: {},
    mode: "uncontrolled",
    label: "Select Amount",
    minLabel: "0",
    maxLabel: "100",
    range: false,
    disabled: false,
    min: 0,
    max: 100,
    step: 1,
    defaultValue: [50],
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
      control: { type: "object" },
      description: "Controlled thumb positions (`[n]` single, `[n, m]` range).",
      table: {
        type: { summary: "number[] | undefined" },
        defaultValue: { summary: "undefined" },
      },
    },
    onValueChange: uneditableArgType(
      "(value: number[]) => void",
      "Called when the thumb position(s) change."
    ),
    defaultValue: {
      if: { arg: "mode", eq: "uncontrolled" },
      control: { type: "object" },
      description:
        "Initial thumb positions (`[n]` single thumb, `[n, m]` range). Remounts the slider when changed.",
      table: {
        type: { summary: "number[] | undefined" },
        defaultValue: { summary: "undefined" },
      },
    },
    range: {
      control: { type: "boolean" },
      description:
        "When `true`, renders two thumbs and two number inputs for range selection.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    label: {
      control: { type: "text" },
      description: "Accessible label above the slider; linked via `aria-labelledby`.",
      table: {
        type: { summary: "string | undefined" },
        defaultValue: { summary: '"Select Amount"' },
      },
    },
    minLabel: {
      control: { type: "text" },
      description: "Text shown at the left end of the slider row (minimum end).",
      table: {
        type: { summary: "string | undefined" },
        defaultValue: { summary: '"0"' },
      },
    },
    maxLabel: {
      control: { type: "text" },
      description: "Text shown at the right end of the slider row (maximum end).",
      table: {
        type: { summary: "string | undefined" },
        defaultValue: { summary: '"100"' },
      },
    },
    disabled: {
      control: { type: "boolean" },
      description: "Disable the slider, thumbs, and number inputs.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    min: {
      control: { type: "number" },
      description: "Minimum selectable value.",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "0" },
      },
    },
    max: {
      control: { type: "number" },
      description: "Maximum selectable value.",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "100" },
      },
    },
    step: {
      control: { type: "number" },
      description: "Increment between valid values when dragging or typing.",
      table: {
        type: { summary: "number" },
        defaultValue: { summary: "1" },
      },
    },
    className: {
      control: { type: "text" },
      description:
        "CSS class merged onto the Radix slider root (track/thumbs), not the outer layout wrapper.",
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
    range,
    ...rest
  }) => {
    const sliderProps =
      mode === "controlled"
        ? { ...rest, range, value }
        : { ...rest, range, defaultValue }

    return (
      <div style={{ width: 336 }}>
        <Slider
          key={sliderRemountKey(mode, range, defaultValue, value)}
          {...sliderProps}
        />
      </div>
    )
  },
} satisfies Meta<SliderStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Range: Story = {
  args: {
    label: "Select Range",
    range: true,
    defaultValue: [25, 75],
  },
}

export const Controlled: Story = {
  args: {
    mode: "controlled",
    value: [50],
  },
}
