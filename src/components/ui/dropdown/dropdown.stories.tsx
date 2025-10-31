import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { SingleSelect, MultiSelect } from './index';

const meta: Meta<typeof SingleSelect> = {
  title: 'UI/Dropdown',
  component: SingleSelect,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text shown when no option is selected',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the dropdown',
    },
    filter: {
      control: { type: 'boolean' },
      description: 'Enable search/filter functionality',
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
    placeholder: 'Select an option',
  },
  render: (args) => {
    const [value, setValue] = useState<string>('');
    return (
      <SingleSelect
        options={args.options}
        placeholder={args.placeholder}
        disabled={args.disabled}
        className={args.className}
        value={value}
        onChange={(val) => setValue(val)}
      />
    );
  },
};

const filterOptions = [
  { value: 'fruit1', label: 'Apple orange kiwi pear' },
  { value: 'fruit2', label: 'Kiwi apple orange' },
  { value: 'fruit3', label: 'Pear orange apple kiwi' },
  { value: 'fruit4', label: 'Orange pear kiwi apple' },
  { value: 'fruit5', label: 'Apple kiwi orange pear' },
  { value: 'fruit6', label: 'Kiwi pear apple orange' },
  { value: 'fruit7', label: 'Orange apple pear kiwi' },
  { value: 'fruit8', label: 'Pear kiwi orange apple' },
  { value: 'ipsum1', label: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod' },
  { value: 'ipsum2', label: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua' },
];

export const Filter: Story = {
  args: {
    options: filterOptions,
    placeholder: 'Type to search...',
    filter: true,
  },
  render: (args) => {
    const [value, setValue] = useState<string>('');
    return (
      <SingleSelect
        options={args.options}
        placeholder={args.placeholder}
        disabled={args.disabled}
        filter={args.filter}
        className={args.className}
        value={value}
        onChange={(val) => setValue(val)}
      />
    );
  },
};

export const Multiselect: Story = {
  args: {
    options: defaultOptions,
    placeholder: 'Select multiple options',
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <MultiSelect
        options={args.options}
        placeholder={args.placeholder}
        disabled={args.disabled}
        className={args.className}
        value={value}
        onChange={(val) => setValue(val)}
      />
    );
  },
};
