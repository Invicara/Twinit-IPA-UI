import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import Button from "./button";
import { Loader2 } from "lucide-react";
import { capitalizeFirstLetter } from "../../../lib/utils";

export default {
  title: "ui/Button",
  component: Button,
  argTypes: {
    variant: {
      options: ['default', 'secondary', 'tertiary', 'danger'],
      control: { type: 'radio' },
    },
    size: {
      options: ['default', 'sm', 'icon'],
      control: { type: 'radio' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    children: {
      options: ['text', 'icon'],
      control: {type: 'check'}
    }
  },
  parameters: {
    layout: 'centered',
  }
} as Meta<typeof Button>;

const Template: StoryFn<typeof Button> = (args) => {

  console.log("storybook args", args)

  let children = (args.children || "") as string;

  let text;
  let icon;
  
  if(children.includes("text")) {
    text = capitalizeFirstLetter(args.variant);
  }
  if(children.includes("icon")) {
    icon = <Loader2 className="animate-spin" />
  }

  return <Button {...args}>{text}{icon}</Button>
};

export const Default = Template.bind({});

Default.args = {
  variant: "default",
  children: "text",
  size: "default"
};

export const Secondary = Template.bind({});

Secondary.args = {
  variant: "secondary",
  children: "text",
  size: "default"
};

export const Tertiary = Template.bind({});

Tertiary.args = {
  variant: "tertiary",
  children: "text",
  size: "default"
};

export const Danger = Template.bind({});

Danger.args = {
  variant: "danger",
  children: "text",
  size: "default"
};