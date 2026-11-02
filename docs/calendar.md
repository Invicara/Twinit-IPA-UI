# Calendar

Date selection built on [`react-day-picker`](https://daypicker.dev) v10 with IPA styling, following [shadcn/ui Calendar](https://ui.shadcn.com/docs/components/radix/calendar). Radix does not provide a calendar primitive (see [internal component sources](internal/component-sources.md)).

## Exports

- `Calendar`: month grid for single, range or multiple selection
- `DatePicker`: trigger button + `Popover` + single-date `Calendar`
- `DateRangePicker`: trigger button + `Popover` + range `Calendar`, with optional relative presets
- `CalendarDayButton`: the day cell button `Calendar` renders by default (exported for custom `components.DayButton` compositions)
- Types: `CalendarProps`, `DatePickerProps`, `DateRangePickerProps`, `DateRangeRelativeFlags`

## Import

```tsx
import { Calendar, DatePicker, DateRangePicker } from '@dtplatform/ipa-ui';
```

## Calendar

```tsx
const [date, setDate] = useState<Date>();

<Calendar mode="single" selected={date} onSelect={setDate} />
```

Accepts all [`DayPicker` props](https://daypicker.dev/api/type-aliases/DayPickerProps) (`mode`, `selected`, `onSelect`, `numberOfMonths`, `disabled`, `locale`, ...). IPA changes these defaults:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `captionLayout` | `'label'` \| `'dropdown'` \| `'dropdown-months'` \| `'dropdown-years'` | `'dropdown'` | Month and year selectors in the caption. Use `'label'` for a static caption. |
| `navLayout` | `'around'` \| `'after'` | `'around'` | Previous/next buttons on either side of the caption. |
| `showOutsideDays` | `boolean` | `true` | Show days from the previous and next months. |
| `styleOverrides` | `Record<string, string>` | - | Extra classes per slot, merged with defaults (see [Styling](#styling)). |

`classNames` and `components` are merged with the IPA ones. Note that a key you pass in `classNames` replaces the IPA class for that element (it is spread last); use `styleOverrides` to add classes instead.

## DatePicker

```tsx
const [date, setDate] = useState<Date>();

<DatePicker value={date} onChange={setDate} placeholder="Pick a date" />
```

## DateRangePicker

```tsx
import { DateRangePicker, type DateRangePickerProps } from '@dtplatform/ipa-ui';

type DateRange = NonNullable<DateRangePickerProps['value']>; // { from: Date | undefined; to?: Date }

const [range, setRange] = useState<DateRange>();

<DateRangePicker value={range} onChange={setRange} showThisWeek showThisMonth />
```

`DateRange` is `react-day-picker`'s type; derive it from the props as above so you do not need a direct `react-day-picker` dependency.

## Picker props

Both pickers render a secondary `Button` as the trigger and close via a close button in the popover. They do **not** forward other `Calendar` props (e.g. `disabled` matchers, `locale`); for that, compose `Popover` + `Calendar` yourself.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Date` (DatePicker) \| `DateRange` (DateRangePicker) | - | Selected value (controlled). |
| `onChange` | `(value \| undefined) => void` | - | Called on selection, preset click and clear. |
| `placeholder` | `string` | `'Pick a date'` / `'Pick a date range'` | Trigger text when empty. |
| `displayFormat` | `string` | `'PPP'` / `'LLL dd, y'` | [date-fns `format`](https://date-fns.org/docs/format) pattern for the trigger label. Ranges render as `from - to`. |
| `triggerLabel` | `string` | - | Replaces the formatted value on the trigger. |
| `numberOfMonths` | `number` | `2` | DateRangePicker only. Months shown side by side. |
| `closeOnSelect` | `boolean` | `true` / `false` | Close after a pick. DateRangePicker closes only once both `from` and `to` are set. |
| `disabled` | `boolean` | `false` | Disables the trigger. |
| `size` | `'default'` \| `'sm'` \| `'icon'` | `'default'` | Trigger `Button` size. |
| `id` | `string` | - | `id` on the trigger button. |
| `className`, `triggerClassName` | `string` | - | Extra classes on the trigger button. |
| `popoverContentClassName` | `string` | - | Extra class on the popover content. |
| `hideChevron` | `boolean` | `false` | Hide the trailing chevron and use the compact trigger. |
| `showClearTrigger` | `boolean` | `false` | While a value is set, replace the calendar icon with an X that clears and closes. |
| `clearAriaLabel` | `string` | - | `aria-label` of that X. |
| `showPopoverClear` | `boolean` | `false` | Show **Clear** (clears, stays open) and **Reset** (clears and closes) buttons under the calendar when a value is set. |
| `onClear` | `() => void` | - | Called after any clear, in addition to `onChange(undefined)`. |
| `triggerTestId` | `string` | `'ipa_date_picker_trigger'` / `'ipa_date_range_picker_trigger'` | `data-testid` of the trigger. |
| `styleOverrides` | `Record<string, string>` | - | Passed to the trigger slots, `PopoverContent` and `Calendar`. |

**Relative presets (DateRangePicker only)**, all `boolean`, default `false`: `showToday`, `showThisWeek`, `showThisMonth`, `showThisQuarter`, `showThisYear`. Each adds a button under the calendar that sets the range (weeks start on Monday). The popover stays open; the button matching the current value gets `data-active`.

## Styling

`styleOverrides` merges classes per slot (`mergeStyles`). Common slots:

- Calendar: `calendar`, `months`, `month`, `monthCaption`, `nav`, `navButton`, `dropdowns`, `dropdown`, `captionLabel`, `monthGrid`, `weekdays`, `weekday`, `week`, `day`, `dayButton`, `dayButtonOutside`, `today`, `outside`, `disabled`, `rangeStart`, `rangeMiddle`, `rangeEnd`, `weekNumber`, `chevronIcon`
- Pickers: `datePickerTrigger`, `datePickerTriggerCompact`, `datePickerTriggerLabel`, `clearTriggerIcon`, `clearTriggerDestructive`, `datePickerContent`, `datePickerClose`, `datePickerResetRow`, `datePickerClear`, `datePickerReset`, `relativeDateRow`, `relativeDateButton`, plus `popoverContent` from [Popover](popover.md)

The full list is the class names in `src/components/ui/calendar/calendar.module.css`.

## Data attributes and test ids

| Element | `data-testid` | Data attributes |
|---------|---------------|-----------------|
| Calendar root | `ipa_calendar` | `data-slot="calendar"` |
| Day button | `ipa_calendar_day` | `data-day`, `data-selected-single`, `data-range-start`, `data-range-end`, `data-range-middle`, `data-outside`, `data-today`, `data-focused`, `data-disabled` |
| Picker trigger | `triggerTestId` (see above) | `data-empty` when no value |
| Popover content | `ipa_popover_content` | Radix `data-state`, `data-side` |
| Preset button | - | `data-active` when it matches `value` |

## Dependencies

`react-day-picker` and `date-fns` are bundled with ipa-ui; you do not install them.
