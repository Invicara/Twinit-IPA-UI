import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { SingleSelect, MultiSelect } from './index';
import type { SingleSelectProps } from './single-select';
import type { MultiSelectProps } from './multi-select';
import { DROPDOWN_DEFAULT_MAX_VISIBLE_OPTIONS } from './shared/dropdown-base';
import { ArrowDownIcon } from '@radix-ui/react-icons';
import customStyles from './dropdown.custom-styles.module.css';
import { styleOverridesArgType, uneditableArgType } from '@storybook/argTypes';

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

type DropdownStoryArgs = Omit<SingleSelectProps, 'options'> & {
  options?: SingleSelectProps['options'];
  variant?: 'single' | 'multi';
} & Partial<
  Pick<
    MultiSelectProps,
    | 'maxDisplayBadges'
    | 'hideSelectionCount'
    | 'hideRemainingBadge'
    | 'hideCheckboxes'
    | 'hideBadgeRemove'
    | 'rightAlignCheckboxes'
    | 'wrapBadges'
    | 'disableCloseOnTriggerClick'
  >
>;

const multiSelectArgType = (argType: {
  control: { type: 'boolean' } | { type: 'number' };
  description: string;
  table: Record<string, unknown>;
}) => ({
  ...argType,
  if: { arg: 'variant', eq: 'multi' },
  table: {
    ...argType.table,
    category: 'MultiSelect',
  },
});

const meta = {
  title: 'ui/Dropdown',
  component: SingleSelect,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    variant: 'single',
    styleOverrides: {},
    disabled: false,
    filter: false,
    hideFooter: false,
    hideRowHighlight: false,
    hideLongTextEllipsis: false,
    hideLongTextTooltip: false,
    disableKeyboardNavigation: false,
    disableSelectionLooping: false,
    disableScrolling: false,
    disableIconAnimation: false,
    enableLongTextAnimation: false,
    disableClickOutside: false,
    popAbove: false,
    openOnFocus: false,
    maxVisibleOptions: DROPDOWN_DEFAULT_MAX_VISIBLE_OPTIONS,
  },
  argTypes: {
    variant: {
      control: false,
      description: 'Storybook only: shows MultiSelect props when `multi`.',
      table: { disable: true },
    },
    options: {
      control: { type: 'object' },
      description: 'Items as `{ value, label, disabled? }[]`.',
      table: {
        type: { summary: 'Array<{ value: string; label: string; disabled?: boolean }>' },
        defaultValue: { summary: '[]' },
      },
    },
    value: uneditableArgType(
      'string | string[] | undefined',
      'Controlled selection; stories manage with local state, not Controls.'
    ),
    onChange: uneditableArgType(
      '(value: string | string[]) => void',
      'Called when the selection has changed.'
    ),
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder when nothing is selected.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: 'undefined' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the trigger and list interaction.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    filter: {
      control: { type: 'boolean' },
      description: 'Searchable filter input instead of a static trigger label.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    maxDisplayBadges: multiSelectArgType({
      control: { type: 'number' },
      description: 'Max badges shown before collapsing to a "+N" remaining badge.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '2' },
      },
    }),
    hideFooter: {
      control: { type: 'boolean' },
      description: 'Hide the list footer (e.g. "No results" or selection count).',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    hideRowHighlight: {
      control: { type: 'boolean' },
      description: 'Hide hover/focus highlight on option rows.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    hideLongTextEllipsis: {
      control: { type: 'boolean' },
      description: 'Allow long option labels to wrap instead of truncating with ellipsis.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    hideLongTextTooltip: {
      control: { type: 'boolean' },
      description: 'Hide tooltip for truncated long option text.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    hideSelectionCount: multiSelectArgType({
      control: { type: 'boolean' },
      description: 'Hide the footer selection count.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    }),
    hideRemainingBadge: multiSelectArgType({
      control: { type: 'boolean' },
      description: 'Hide the "+N" badge for selections beyond `maxDisplayBadges`.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    }),
    hideCheckboxes: multiSelectArgType({
      control: { type: 'boolean' },
      description: 'Hide row checkboxes.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    }),
    hideBadgeRemove: multiSelectArgType({
      control: { type: 'boolean' },
      description: 'Hide the remove control on each badge.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    }),
    rightAlignCheckboxes: multiSelectArgType({
      control: { type: 'boolean' },
      description: 'Align checkboxes to the right edge of each row.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    }),
    wrapBadges: multiSelectArgType({
      control: { type: 'boolean' },
      description: 'Allow selected badges to wrap onto multiple lines.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    }),
    disableKeyboardNavigation: {
      control: { type: 'boolean' },
      description:
        'Disable arrow-key list navigation. ',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disableSelectionLooping: {
      control: { type: 'boolean' },
      description: 'Stop arrow-key navigation at the first/last item instead of looping.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disableScrolling: {
      control: { type: 'boolean' },
      description: 'Disable scroll animation / scrolling behavior in the option list.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disableIconAnimation: {
      control: { type: 'boolean' },
      description: 'Disable chevron/icon rotation animation on the trigger.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    enableLongTextAnimation: {
      control: { type: 'boolean' },
      description: 'Animate horizontally scrolling text for long labels in the list.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disableClickOutside: {
      control: { type: 'boolean' },
      description: 'Keep the list open when clicking outside the dropdown.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disableCloseOnTriggerClick: multiSelectArgType({
      control: { type: 'boolean' },
      description: 'Keep the list open when clicking the trigger while open.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    }),
    openOnFocus: {
      control: { type: 'boolean' },
      description:
        'Open the dropdown on focus.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    popAbove: {
      control: { type: 'boolean' },
      description: 'Prefer opening the list above the trigger (Floating UI may still flip).',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    maxVisibleOptions: {
      control: { type: 'number' },
      description:
        'Max visible rows before the list scrolls. Pass `false` in code for viewport-height only (no row cap).',
      table: {
        type: { summary: 'number | false' },
        defaultValue: { summary: '8' },
      },
    },
    floatingZIndex: {
      control: { type: 'number' },
      description: 'Optional z-index for the portaled popup.',
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: 'undefined' },
      },
    },
    portalContainer: uneditableArgType(
      'HTMLElement | null | undefined',
      'Portal mount node for the list popup; advanced usage only.'
    ),
    icons: uneditableArgType(
      'Record<string, ReactNode> | undefined',
      'Custom trigger/footer/badge icons; set in story source (e.g. Custom Multiselect).'
    ),
    className: {
      control: { type: 'text' },
      description: 'CSS class for the outermost container of the component.',
      table: {
        type: { summary: 'string | undefined' },
        defaultValue: { summary: 'undefined' },
      },
    },
    styleOverrides: styleOverridesArgType(),
  },
} satisfies Meta<DropdownStoryArgs>;

export default meta;
type Story = StoryObj<DropdownStoryArgs>;

export const Default: Story = {
  args: {
    options: defaultOptions,
    placeholder: 'Select an option',
    filter: false,
    disabled: false,
    hideRowHighlight: false,
    hideLongTextTooltip: false,
  },
  render: (args) => {
    const [value, setValue] = useState<string>('');
    return (
      <div style={{ minHeight: 240, display: 'flex', alignItems: 'flex-start' }}>
        <SingleSelect
          options={args.options ?? defaultOptions}
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
          disableIconAnimation={args.disableIconAnimation}
          enableLongTextAnimation={args.enableLongTextAnimation}
          disableClickOutside={args.disableClickOutside}
          disableScrolling={args.disableScrolling}
          maxVisibleOptions={args.maxVisibleOptions}
          styleOverrides={args.styleOverrides}
          disableKeyboardNavigation={args.disableKeyboardNavigation}
          openOnFocus={args.openOnFocus}
          value={value}
          onChange={(val) => setValue(val)}
        />
      </div>
    );
  },
};

export const Filter: Story = {
  args: {
    options: filterOptions,
    placeholder: 'Search options…',
    filter: true,
    hideFooter: false,
    hideRowHighlight: false,
    hideLongTextEllipsis: false,
    hideLongTextTooltip: false,
    disableScrolling: false,
    enableLongTextAnimation: true
  },
  render: (args) => {
    const [value, setValue] = useState<string>('');
    return (
      <div style={{ minHeight: 240, display: 'flex', alignItems: 'flex-start' }}>
        <SingleSelect
          options={args.options ?? defaultOptions}
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
          disableIconAnimation={args.disableIconAnimation}
          enableLongTextAnimation={args.enableLongTextAnimation}
          disableClickOutside={args.disableClickOutside}
          disableScrolling={args.disableScrolling}
          maxVisibleOptions={args.maxVisibleOptions}
          styleOverrides={args.styleOverrides}
          disableKeyboardNavigation={args.disableKeyboardNavigation}
          openOnFocus={args.openOnFocus}
          value={value}
          onChange={(val) => setValue(val)}
        />
      </div>
    );
  },
};

export const Multiselect: Story = {
  args: {
    variant: 'multi',
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
    maxVisibleOptions: 5,
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <div style={{ minHeight: 240, display: 'flex', alignItems: 'flex-start' }}>
        <MultiSelect
          options={args.options ?? defaultOptions}
          placeholder={args.placeholder}
          disabled={args.disabled}
          className={args.className}
          disableSelectionLooping={args.disableSelectionLooping}
          hideFooter={args.hideFooter}
          hideRowHighlight={args.hideRowHighlight}
          hideLongTextEllipsis={args.hideLongTextEllipsis}
          hideLongTextTooltip={args.hideLongTextTooltip}
          popAbove={args.popAbove}
          disableClickOutside={args.disableClickOutside}
          disableScrolling={args.disableScrolling}
          maxDisplayBadges={args.maxDisplayBadges}
          hideSelectionCount={args.hideSelectionCount}
          hideRemainingBadge={args.hideRemainingBadge}
          rightAlignCheckboxes={args.rightAlignCheckboxes}
          wrapBadges={args.wrapBadges}
          maxVisibleOptions={args.maxVisibleOptions}
          styleOverrides={args.styleOverrides}
          disableKeyboardNavigation={args.disableKeyboardNavigation}
          openOnFocus={args.openOnFocus}
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

/** Short panel with `overflow: hidden` — list should not be clipped (portaled + flip). */
export const InsideOverflowHidden: Story = {
  args: {
    maxVisibleOptions: 5,
    hideFooter: false
  },

  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'The trigger sits in a short container with `overflow: hidden`. The list is portaled and positioned with Floating UI so it remains visible.',
      },
    },
  },

  render: (args) => {
    const [value, setValue] = useState<string>('');
    return (
      <div
        style={{
          overflow: 'hidden',
          height: 100,
          width: 320,
          border: '1px solid var(--neutral-4, #ccc)',
          padding: 8,
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <SingleSelect
          options={defaultOptions}
          value={value}
          onChange={setValue}
          placeholder="Open in tight space"
          hideFooter={args.hideFooter}
          disableClickOutside={args.disableClickOutside}
          disableKeyboardNavigation={args.disableKeyboardNavigation}
          maxVisibleOptions={args.maxVisibleOptions}
          styleOverrides={args.styleOverrides}
        />
      </div>
    );
  },
};

export const CustomMultiselect: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Pre-filled **styleOverrides** from `dropdown.custom-styles.module.css` (orange monospace demo). Open Controls to edit slot keys or clear to `{}`. **Important:** In your app, import your override CSS file last so overrides win over defaults. See dropdown docs.',
      },
      source: {
        type: 'code',
      },
    },
  },
  args: {
    options: defaultOptions,
    placeholder: 'Custom styled multiselect',
    variant: 'multi',
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
    styleOverrides: customStyles,
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>(['option2', 'option5']);

    return (
      <div style={{ paddingTop: 256 }}>
        <MultiSelect
          options={args.options ?? defaultOptions}
          placeholder={args.placeholder}
          disabled={args.disabled}
          className={args.className}
          disableSelectionLooping={args.disableSelectionLooping}
          hideFooter={args.hideFooter}
          hideRowHighlight={args.hideRowHighlight}
          hideLongTextEllipsis={args.hideLongTextEllipsis}
          hideLongTextTooltip={args.hideLongTextTooltip}
          popAbove={args.popAbove}
          disableClickOutside={args.disableClickOutside}
          disableKeyboardNavigation={args.disableKeyboardNavigation}
          maxDisplayBadges={args.maxDisplayBadges}
          hideSelectionCount={args.hideSelectionCount}
          hideRemainingBadge={args.hideRemainingBadge}
          rightAlignCheckboxes={args.rightAlignCheckboxes}
          wrapBadges={args.wrapBadges}
          disableScrolling={args.disableScrolling}
          maxVisibleOptions={args.maxVisibleOptions}
          value={value}
          onChange={(val) => setValue(val)}
          icons={customMultiselectIcons}
          styleOverrides={args.styleOverrides}
        />
      </div>
    );
  },
};
