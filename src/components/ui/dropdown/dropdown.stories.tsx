import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { SingleSelect, MultiSelect } from './index';
import { ArrowDownIcon } from '@radix-ui/react-icons';

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
    disableSelectionLooping: {
      control: { type: 'boolean' },
      description: 'Disable looping when navigating with arrow keys (stops at first/last item instead of cycling)',
    },
    hideFooter: {
      control: { type: 'boolean' },
      description: 'Hide the footer (e.g. "No results" / selection count)',
    },
    hideRowHighlight: {
      control: { type: 'boolean' },
      description: 'Hide row highlight on hover/focus',
    },
    hideLongTextEllipsis: {
      control: { type: 'boolean' },
      description: 'Hide ellipsis for long option text',
    },
    hideLongTextTooltip: {
      control: { type: 'boolean' },
      description: 'Hide tooltip for truncated long text',
    },
    popAbove: {
      control: { type: 'boolean' },
      description: 'Open dropdown above the trigger instead of below',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
    icons: {
      control: false,
      description: 'Custom icon components (not editable in controls)',
    },
    classNames: {
      control: false,
      description: 'Custom class names for sub-components (not editable in controls)',
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
    hideFooter: true,
    filter: true,
    disabled: false,
    hideRowHighlight: false,
    hideLongTextEllipsis: true,
    popAbove: false,
      hideLongTextTooltip: false
  },
  render: (args) => {
    const [value, setValue] = useState<string>('');
    return (
      <div className="min-h-[240px] flex items-start">
        <SingleSelect
          options={args.options}
          placeholder={args.placeholder}
          disabled={args.disabled}
          filter={args.filter}
          className={args.className}
          disableSelectionLooping={args.disableSelectionLooping}
          hideFooter={args.hideFooter}
          hideRowHighlight={args.hideRowHighlight}
          hideLongTextEllipsis={args.hideLongTextEllipsis}
          hideLongTextTooltip={args.hideLongTextTooltip}
          popAbove={args.popAbove}
          value={value}
          onChange={(val) => setValue(val)}
        />
      </div>
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
    hideFooter: false,
    hideRowHighlight: false,
    hideLongTextEllipsis: false,
    hideLongTextTooltip: false,
    disableKeyboardNavigation: true,
    disableIconAnimation: true,
    disableScrolling: true,
    enableLongTextAnimation: true
  },
  render: (args) => {
    const [value, setValue] = useState<string>('');
    return (
      <div className="min-h-[240px] flex items-start">
        <SingleSelect
          options={args.options}
          placeholder={args.placeholder}
          disabled={args.disabled}
          filter={args.filter}
          className={args.className}
          disableSelectionLooping={args.disableSelectionLooping}
          hideFooter={args.hideFooter}
          hideRowHighlight={args.hideRowHighlight}
          hideLongTextEllipsis={args.hideLongTextEllipsis}
          hideLongTextTooltip={args.hideLongTextTooltip}
          popAbove={args.popAbove}
          value={value}
          onChange={(val) => setValue(val)}
        />
      </div>
    );
  },
};

export const Multiselect: Story = {
  args: {
    options: defaultOptions,
    placeholder: 'Select multiple options',
    disabled: false,
    hideFooter: false,
    hideRowHighlight: false,
    hideLongTextEllipsis: false,
    hideLongTextTooltip: false,
    popAbove: false,
    maxDisplayBadges: 2,
    hideSelectionCount: false,
    hideRemainingBadge: false,
    rightAlignCheckboxes: false,
    wrapBadges: false,
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <div className="min-h-[240px] flex items-start">
        <MultiSelect
          options={args.options}
          placeholder={args.placeholder}
          disabled={args.disabled}
          className={args.className}
          disableSelectionLooping={args.disableSelectionLooping}
          hideFooter={args.hideFooter}
          hideRowHighlight={args.hideRowHighlight}
          hideLongTextEllipsis={args.hideLongTextEllipsis}
          hideLongTextTooltip={args.hideLongTextTooltip}
          popAbove={args.popAbove}
          maxDisplayBadges={args.maxDisplayBadges}
          hideSelectionCount={args.hideSelectionCount}
          hideRemainingBadge={args.hideRemainingBadge}
          rightAlignCheckboxes={args.rightAlignCheckboxes}
          wrapBadges={args.wrapBadges}
          value={value}
          onChange={(val) => setValue(val)}
        />
      </div>
    );
  },
};

const customMultiselectIcons = {
  trigger: <ArrowDownIcon className="h-4 w-4 stroke-orange-500 stroke-1"/>
};

const customMultiselectClassNames = {
  container: 'font-mono',
  trigger: 'rounded-none w-[360px] focus:border-orange-500 focus:border-[2px] focus-visible:border-orange-500 focus-visible:outline-none cursor-crosshair min-h-[44px] hover:border-orange-400',
  triggerIcon: 'text-orange-500 stroke-[2.5]',
  badge: 'rounded-none bg-orange-100 text-orange-700',
  badgeText: 'font-bold',
  badgeRemove: 'rounded-none hover:bg-orange-300',
  badgeRemoveIcon: 'text-orange-600 stroke-[2]',
  remainingBadge: 'rounded-none bg-orange-100 text-orange-700',
  popup: 'shadow-none rounded-none w-[200px] border-2 border-orange-500 text-orange-600',
  scrollContent: 'cursor-copy',
  header: 'bg-orange-50 border-b-2 border-orange-200 text-orange-200',
  item: 'font-arial cursor-crosshair text-orange-700',
  checkbox: 'w-3 h-3 rounded-full border-2 border-orange-500 bg-white',
  checkboxChecked: 'bg-orange-500 border-orange-600',
  checkIcon: 'hidden',
};

export const CustomMultiselect: Story = {
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
    },
  },
  args: {
    options: defaultOptions,
    placeholder: 'Custom styled multiselect',
    maxDisplayBadges: 3,
    hideFooter: true,
    hideRowHighlight: true,
    rightAlignCheckboxes: true,
    popAbove: true,
    disabled: false,
    hideLongTextEllipsis: false,
    hideLongTextTooltip: false,
    hideSelectionCount: false,
    hideRemainingBadge: false,
    wrapBadges: false,
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>(['option2', 'option5']);
    
    return (
      <div className="pt-64">
        <MultiSelect
          options={args.options}
          placeholder={args.placeholder}
          disabled={args.disabled}
          className={args.className}
          disableSelectionLooping={args.disableSelectionLooping}
          hideFooter={args.hideFooter}
          hideRowHighlight={args.hideRowHighlight}
          hideLongTextEllipsis={args.hideLongTextEllipsis}
          hideLongTextTooltip={args.hideLongTextTooltip}
          popAbove={args.popAbove}
          maxDisplayBadges={args.maxDisplayBadges}
          hideSelectionCount={args.hideSelectionCount}
          hideRemainingBadge={args.hideRemainingBadge}
          rightAlignCheckboxes={args.rightAlignCheckboxes}
          wrapBadges={args.wrapBadges}
          value={value}
          onChange={(val) => setValue(val)}
          icons={customMultiselectIcons}
          classNames={customMultiselectClassNames}
        />
      </div>
    );
  },
};
