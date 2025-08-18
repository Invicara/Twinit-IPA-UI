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
      options: ['default', 'secondary', 'outline', 'ghost', 'link', 'destructive'],
      control: { type: 'radio' },
    },
    size: {
      options: ['default', 'sm', 'icon'],
      control: { type: 'radio' },
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
    text = `${capitalizeFirstLetter(args.size)} ${capitalizeFirstLetter(args.variant)}`
  }
  if(children.includes("icon")) {
    icon = <Loader2 className="animate-spin" />
  }

  return <Button {...args}>{text}{icon}</Button>
};

export const ButtonDefault = Template.bind({});
ButtonDefault.args = {
  variant: "default",
  children: "text",
  size: "default"
};