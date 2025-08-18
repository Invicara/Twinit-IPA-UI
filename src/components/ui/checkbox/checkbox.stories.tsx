import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { Checkbox } from "./checkbox"


export default {
  title: "ui/Checkbox",
  component: Checkbox,
  tags: ['autodocs'],
} as Meta<typeof Checkbox>;

const Template: StoryFn<{checkbox: typeof Checkbox, label: string}> = (args) => (<div className="flex items-center space-x-2">
  <Checkbox {...args.checkbox}/>
  <label
    htmlFor="terms"
    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  >
    {args.label}
  </label>
</div>)

export const CheckboxDefault = Template.bind({});
export const CheckboxIndeterminate = Template.bind({});
CheckboxIndeterminate.args = {
  checkbox: {defaultChecked: 'indeterminate'},
  label: "Accept terms and conditions",
};