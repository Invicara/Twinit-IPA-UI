import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { SingleSelect, MultiSelect } from './index';
import { ArrowDownIcon } from '@radix-ui/react-icons';
import customStyles from './dropdown.custom-styles.module.css';

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
    styleOverrides: {
      control: false,
      description: 'CSS module with same selector names as default (base + component); import your override file last so it wins',
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
    filter: false,
    disabled: false,
    hideRowHighlight: false,
    hideLongTextEllipsis: true,
    popAbove: false,
      hideLongTextTooltip: false
  },
  render: (args) => {
    const [value, setValue] = useState<string>('');
    return (
      <div style={{ minHeight: 240, display: 'flex', alignItems: 'flex-start' }}>
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
      <div style={{ minHeight: 240, display: 'flex', alignItems: 'flex-start' }}>
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
      <div style={{ minHeight: 240, display: 'flex', alignItems: 'flex-start' }}>
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
  trigger: <ArrowDownIcon className={customStyles.triggerIconCustom} />,
};

export const CustomMultiselect: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Uses `styleOverrides` with a CSS module that has the same selector names as the default (base + component). **Important:** In your app, import your override CSS file last so overrides win over defaults. See dropdown docs.',
      },
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
      <div style={{ paddingTop: 256 }}>
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
          styleOverrides={customStyles}
        />
      </div>
    );
  },
};
