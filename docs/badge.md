# Badge

Small pill label for statuses, counts or tags. Renders a `<span>`.

## Import

```tsx
import { Badge } from '@dtplatform/ipa-ui';
```

## Basic usage

```tsx
<Badge>New</Badge>
<Badge variant="secondary">Draft</Badge>
<Badge variant="outline">12</Badge>
```

## Props

Also accepts standard `<span>` HTML attributes (e.g. `className`, `title`, `onClick`). Forwards `ref` to the `<span>`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default'` \| `'secondary'` \| `'outline'` | `'default'` | Visual style: filled brand, light brand, or bordered neutral. |
| `children` | `ReactNode` | - | Badge content. |
| `styleOverrides` | `Record<string, string>` | - | Extra classes per slot key (`badge`), merged with defaults. |

Types: `BadgeProps`, `BadgeVariant`.

## Styling

The only slot is `badge`. Variant colors are set with `.badge[data-variant="..."]`, so an override of a variant color must include the same attribute selector (see [Data attributes](data-attributes.md#specificity-when-the-default-uses-data-attributes)):

```css
/* badge.overrides.module.css */
.badge[data-variant="default"] {
  background-color: var(--positive-7);
}
```

```tsx
import overrides from './badge.overrides.module.css';

<Badge styleOverrides={overrides}>Active</Badge>
```

## Data attributes

| Attribute | Value |
|-----------|-------|
| `data-testid` | `ipa_badge` |
| `data-variant` | `default` \| `secondary` \| `outline` |
