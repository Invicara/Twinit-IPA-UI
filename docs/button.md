# Button

Primary action component with multiple variants and sizes. Supports `asChild` so you can render a link or custom component while keeping button styling.

## Import

```tsx
import { Button, buttonVariants } from '@dtplatform/ipa-ui';
```

## Basic usage

```tsx
<Button>Submit</Button>
<Button variant="secondary" size="sm">Cancel</Button>
<Button variant="danger">Delete</Button>
```

## API

**Button** accepts standard button HTML attributes plus:

| Prop       | Type                                      | Default     | Description |
|-----------|-------------------------------------------|-------------|-------------|
| `variant` | `'default'` \| `'danger'` \| `'secondary'` \| `'tertiary'` | `'default'` | Visual style. |
| `size`    | `'default'` \| `'sm'` \| `'icon'`         | `'default'` | Size. Use `icon` for icon-only buttons. |
| `asChild` | `boolean`                                | `false`     | When `true`, render the single child as the root (e.g. `<a>`) with button styles. |
| `testIdPrefix` | `string`                            | —           | Sets `data-testid` on the element for tests. |

**buttonVariants** – CVA helper if you need to apply button styles to another element:

```tsx
import { buttonVariants } from '@dtplatform/ipa-ui';
<a className={buttonVariants({ variant: 'secondary', size: 'sm' })} href="/">Back</a>
```

## Examples

**Icon button**

```tsx
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

## Styling

Styles are applied via internal CSS modules. Variants map to design tokens (e.g. brand colors). Override with `className` if needed.

## Accessibility

Use native `<button>` for actions; use `asChild` with `<a>` for navigation. Provide `aria-label` for icon-only buttons.
