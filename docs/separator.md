# Separator

A 1px horizontal or vertical divider line. Built on [Radix UI Separator](https://www.radix-ui.com/primitives/docs/components/separator).

## Import

```tsx
import { Separator } from '@dtplatform/ipa-ui';
```

## Basic usage

```tsx
<Separator />

<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
  <span>Edit</span>
  <Separator orientation="vertical" />
  <span>Delete</span>
</div>
```

## Props

Accepts all [Radix Separator Root](https://www.radix-ui.com/primitives/docs/components/separator#root) props (including `asChild`) and `<div>` HTML attributes. Forwards `ref`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `'horizontal'` \| `'vertical'` | `'horizontal'` | Horizontal: 1px high, full width. Vertical: 1px wide, full height, at least 16px. |
| `decorative` | `boolean` | `true` | IPA default (Radix defaults to `false`). When `true` the line renders `role="none"` and is ignored by screen readers; set `false` for a semantic `role="separator"`. |
| `styleOverrides` | `Record<string, string>` | - | Extra classes per slot key (`separator`), merged with defaults. |

Type: `SeparatorProps`.

## Styling

The only slot is `separator`. Size rules use `.separator[data-orientation="..."]`; include the same attribute in your override to change them. Color can be overridden on `.separator` alone.

## Data attributes

| Attribute | Value |
|-----------|-------|
| `data-testid` | `ipa_separator` |
| `data-orientation` | `horizontal` \| `vertical` |
