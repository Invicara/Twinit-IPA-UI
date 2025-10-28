import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Dropdown } from './dropdown';

const meta: Meta<typeof Dropdown> = {
  title: 'UI/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['single', 'multiselect'],
      description: 'Dropdown variant - single select or multiselect',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text shown when no option is selected',
    },
    maxDisplayBadges: {
      control: { type: 'number' },
      description: 'Maximum number of badges to display before showing +N',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the dropdown',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4' },
  { value: 'option5', label: 'Option 5' },
  { value: 'option6', label: 'Option 6' },
  { value: 'option7', label: 'Option 7' },
  { value: 'option8', label: 'Option 8' },
  { value: 'option9', label: 'Option 9 - Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod' },
  { value: 'option10', label: 'Option 10 - Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua' },
];

export const Default: Story = {
  args: {
    options: defaultOptions,
    variant: 'single',
    placeholder: 'Select an option',
  },
  render: (args) => {
    const [value, setValue] = useState<string>('');
    return (
      <Dropdown
        options={args.options}
        variant={args.variant}
        placeholder={args.placeholder}
        disabled={args.disabled}
        className={args.className}
        value={value}
        onChange={(val) => setValue(val as string)}
      />
    );
  },
};

export const Multiselect: Story = {
  args: {
    options: defaultOptions,
    variant: 'multiselect',
    placeholder: 'Select multiple options',
    maxDisplayBadges: 2,
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <Dropdown
        options={args.options}
        variant={args.variant}
        placeholder={args.placeholder}
        maxDisplayBadges={args.maxDisplayBadges}
        disabled={args.disabled}
        className={args.className}
        value={value}
        onChange={(val) => setValue(val as string[])}
      />
    );
  },
};