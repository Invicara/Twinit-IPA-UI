# Calendar

Date selection built on [shadcn/ui Calendar](https://ui.shadcn.com/docs/components/radix/calendar) (`react-day-picker`) and IPA styling. Radix does not provide a calendar primitive — see [internal component sources](internal/component-sources.md).

## Exports

- `Calendar` — month grid for single, range, or multi selection
- `DatePicker` — Popover + trigger button + single-date `Calendar`
- `DateRangePicker` — Popover + trigger button + range `Calendar`

## Calendar

```tsx
import { Calendar } from "@dtplatform/ipa-ui"
import { useState } from "react"

function Example() {
  const [date, setDate] = useState<Date>()
  return <Calendar mode="single" selected={date} onSelect={setDate} />
}
```

Supports the full `react-day-picker` v10 API (`mode`, `selected`, `onSelect`, `captionLayout`, `numberOfMonths`, etc.).

**Defaults:** `captionLayout="dropdown"` (month + year selectors) and `navLayout="around"` to match [shadcn Calendar](https://ui.shadcn.com/docs/components/radix/calendar). Pass `captionLayout="label"` for a static caption.

## DatePicker

The [shadcn Date Picker](https://ui.shadcn.com/docs/components/radix/date-picker) is a composition of `Popover` + `Calendar` — not a separate Radix primitive.

```tsx
import { DatePicker } from "@dtplatform/ipa-ui"
import { useState } from "react"

function Example() {
  const [date, setDate] = useState<Date>()
  return (
    <DatePicker
      value={date}
      onChange={setDate}
      placeholder="Pick a date"
    />
  )
}
```

## DateRangePicker

```tsx
import { DateRangePicker } from "@dtplatform/ipa-ui"
import { useState } from "react"
import type { DateRange } from "react-day-picker"

function Example() {
  const [range, setRange] = useState<DateRange>()
  return <DateRangePicker value={range} onChange={setRange} />
}
```

## Styling

Both components accept `styleOverrides` (CSS module slot map), consistent with other ipa-ui components.

## Dependencies

- `react-day-picker` — headless calendar engine used by shadcn
- `date-fns` — formatting in `DatePicker` / `DateRangePicker` labels
