import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { Slider } from "./slider";

export default {
  title: "ui/Slider",
  component: Slider,
  argTypes: {
    range: {
      control: { type: "boolean" },
      description: "Use two thumbs for range selection",
    },
    label: {
      control: { type: "text" },
    },
    minLabel: {
      control: { type: "text" },
    },
    maxLabel: {
      control: { type: "text" },
    },
    disabled: {
      control: { type: "boolean" },
    },
    min: {
      control: { type: "number" },
    },
    max: {
      control: { type: "number" },
    },
    step: {
      control: { type: "number" },
    },
  },
  parameters: {
    layout: "centered",
  },
} as Meta<typeof Slider>;

const Template: StoryFn<typeof Slider> = (args) => (
  <div style={{ width: 336 }}>
    <Slider {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  label: "Select Amount",
  minLabel: "0",
  maxLabel: "100",
  range: false,
  disabled: false,
  min: 0,
  max: 100,
  step: 1,
  defaultValue: [50],
};

export const Range = Template.bind({});
Range.args = {
  label: "Select Range",
  minLabel: "0",
  maxLabel: "100",
  range: true,
  disabled: false,
  min: 0,
  max: 100,
  step: 1,
  defaultValue: [25, 75],
};
