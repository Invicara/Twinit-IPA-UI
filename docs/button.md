# Button

Primary action control with variants and sizes. Supports `asChild` to style a link or other single child as a button.

## Import

```tsx
import { Button } from '@dtplatform/ipa-ui';
```

## Basic usage

```tsx
<Button>Submit</Button>
<Button variant="secondary" size="sm">Cancel</Button>
<Button variant="danger">Delete</Button>
```

## Props

Also accepts standard [`<button>` HTML attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) (e.g. `onClick`, `type`, `aria-label`).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default'` \| `'secondary'` \| `'tertiary'` \| `'danger'` | `'default'` | Visual style. |
| `size` | `'default'` \| `'sm'` \| `'icon'` | `'default'` | Dimensions; use `icon` for icon-only buttons. |
| `disabled` | `boolean` | `false` | Blocks clicks and shows disabled styling. With `asChild`, the native `disabled` attribute is not passed to the child; only `data-disabled="true"` (styling) is set, so prevent navigation/clicks yourself. |
| `asChild` | `boolean` | `false` | Apply button styles to the single child (e.g. a link). |
| `children` | `string \| ReactNode` | - | Label or content (string or React node). |
| `styleOverrides` | `Record<string, string>` | - | Extra classes per slot key (`button`), merged with defaults. |

## Data attributes

The rendered element carries `data-testid="ipa_button"`, `data-variant` (the `variant` value), `data-size` (the `size` value) and `data-disabled` (`"true"` or `"false"`). Use them for test selectors or styling hooks.

## Examples

**Icon button**

```tsx
import { XIcon } from 'lucide-react';

<Button size="icon" aria-label="Close">
  <XIcon />
</Button>
```

**Link styled as button (`asChild`)**

```tsx
<Button asChild>
  <a href="/dashboard">Go to dashboard</a>
</Button>
```

**Disabled**

```tsx
<Button disabled>Save</Button>
```

**Style overrides**

```tsx
import styles from './button.overrides.module.css';

<Button styleOverrides={styles}>Custom</Button>
```

## Accessibility

Use `<button>` for actions; use `asChild` with `<a>` for navigation. Set `aria-label` on icon-only buttons.
