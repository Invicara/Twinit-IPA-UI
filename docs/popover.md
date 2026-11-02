# Popover

Floating panel anchored to a trigger, for small forms, pickers or extra details. Built on [Radix UI Popover](https://www.radix-ui.com/primitives/docs/components/popover). Used internally by [DatePicker / DateRangePicker](calendar.md) and the Table filters.

## Import

```tsx
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  PopoverClose,
} from '@dtplatform/ipa-ui';
```

## Basic usage

```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="secondary">Details</Button>
  </PopoverTrigger>
  <PopoverContent align="start">
    <p>Extra information.</p>
    <PopoverClose asChild>
      <Button size="sm">Done</Button>
    </PopoverClose>
  </PopoverContent>
</Popover>
```

## Subcomponents

- **Popover**: Radix `Root`, unchanged. Use `open` / `defaultOpen` / `onOpenChange` / `modal`.
- **PopoverTrigger**, **PopoverAnchor**, **PopoverClose**: Radix `Trigger`, `Anchor` and `Close`, unchanged.
- **PopoverContent**: IPA-styled Radix `Content`, rendered in a portal. Accepts all [Radix Content props](https://www.radix-ui.com/primitives/docs/components/popover#content) (`side`, `align`, `sideOffset`, `avoidCollisions`, `onOpenAutoFocus`, ...) plus the props below. Forwards `ref`.

## PopoverContent props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `align` | `'start'` \| `'center'` \| `'end'` | `'center'` | Alignment against the trigger (Radix prop, IPA default). |
| `sideOffset` | `number` | `4` | Distance in px from the trigger (Radix prop, IPA default). |
| `container` | `HTMLElement \| null` | `#ipa-ui-modal-root`, else `document.body` | Portal target. See [Portal container](../README.md#portal-container-ipa-ui-modal-root). |
| `stickPlacement` | `boolean` | `false` | Once the content has picked a side, keep it while open (collision flipping is disabled), so content that changes height does not jump to the other side. |
| `styleOverrides` | `Record<string, string>` | - | Extra classes per slot key (`popoverContent`), merged with defaults. |

Type: `PopoverContentProps`.

## Styling

The only slot is `popoverContent`. Defaults: 288px wide, 12px padding, `z-index: 1200`, open/close scale-and-fade animation keyed on `data-state`. Override the width with `className` or `styleOverrides`.

## Data attributes

| Attribute | Value |
|-----------|-------|
| `data-testid` | `ipa_popover_content` |
| `data-state` | `open` \| `closed` (Radix) |
| `data-side`, `data-align` | Resolved placement (Radix) |
