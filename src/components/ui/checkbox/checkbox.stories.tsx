import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { Checkbox } from "./checkbox"


export default {
  title: "ui/Checkbox",
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text next to the checkbox',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the checkbox',
    },
    defaultChecked: {
      control: 'select',
      options: [false, true, 'indeterminate'],
      description: 'Initial checked state (true, false, or indeterminate)',
    },
  },
} as Meta<typeof Checkbox>;

const Template: StoryFn<React.ComponentProps<typeof Checkbox> & { label: string }> = (args) => {
  const { label, ...checkboxProps } = args;
  return (
    <div className="flex items-center space-x-2">
      <Checkbox {...checkboxProps} />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </div>
  );
};

export const CheckboxDefault = Template.bind({});
CheckboxDefault.args = {
  label: "Accept terms and conditions",
  disabled: false,
  defaultChecked: false,
};

export const CheckboxIndeterminate = Template.bind({});
CheckboxIndeterminate.args = {
  label: "Accept terms and conditions",
  disabled: false,
  defaultChecked: 'indeterminate',
};