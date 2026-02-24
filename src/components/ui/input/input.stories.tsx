import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { Bell, Mail } from "lucide-react";
import Input from "./input";

// Helper function to capitalize first letter
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export default {
  title: "ui/Input",
  component: Input,
  argTypes: {
    state: {
      options: ['default', 'error', 'success', 'warning', 'readonly'],
      control: { type: 'select' },
      description: 'Visual state of the input. Use tab or click to test focus state with pink border.'
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text (auto-updates based on state if not manually set)'
    },
    label: {
      control: { type: 'text' },
      defaultValue: 'Label'
    },
    helperText: {
      control: { type: 'text' },
      defaultValue: 'Status Label'
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the input'
    },
    password: {
      control: { type: 'boolean' },
      description: 'Enable password mode with eye icon toggle'
    },
    textarea: {
      control: { type: 'boolean' },
      description: 'Render as expandable textarea instead of input'
    },
  },
  parameters: {
    layout: 'centered',
  }
} as Meta<typeof Input>;

const Template: StoryFn<typeof Input> = (args) => {
  // Auto-set placeholder based on state if not explicitly provided
  const placeholder = args.placeholder || capitalize(args.state || 'default');
  
  return (
    <div className="w-[224px]">
      <Input {...args} placeholder={placeholder} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  label: "Label",
  helperText: "Status Label",
  state: "default"
};

export const WithIcon: StoryFn<typeof Input> = (args) => (
  <div className="w-[224px]">
    <Input {...args} icon={Bell} placeholder="Notifications" />
  </div>
);
WithIcon.args = {
  label: "With Icon",
  helperText: "Icon appears on the left"
};

export const Password: StoryFn<typeof Input> = (args) => (
  <div className="w-[224px]">
    <Input {...args} password placeholder="Enter password" />
  </div>
);
Password.args = {
  label: "Password",
  helperText: "Click eye icon to toggle visibility"
};

export const TextArea: StoryFn<typeof Input> = (args) => (
  <div className="w-[272px]">
    <Input {...args} textarea placeholder="Enter your message" />
  </div>
);
TextArea.args = {
  label: "Message",
  helperText: "Drag bottom-right corner to resize"
};

export const PasswordWithIcon: StoryFn<typeof Input> = (args) => (
  <div className="w-[224px]">
    <Input {...args} password icon={Mail} placeholder="Email password" />
  </div>
);
PasswordWithIcon.args = {
  label: "Email Password",
  helperText: "Both icon and password toggle"
};
