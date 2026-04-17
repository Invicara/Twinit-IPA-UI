import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { RadioGroup } from "./radio-group";

export default {
  title: "ui/RadioGroup",
  component: RadioGroup,
  argTypes: {
    horizontal: {
      control: { type: "boolean" },
      description: "Layout options in a row",
    },
    label: {
      control: { type: "text" },
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
  parameters: {
    layout: "centered",
  },
} as Meta<typeof RadioGroup>;

const Template: StoryFn<typeof RadioGroup> = (args) => (
  <div style={{ width: 280, display: "flex", justifyContent: "center" }}>
    <RadioGroup {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  label: "Choose Option",
  options: [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ],
  defaultValue: "option1",
  disabled: false,
};
