# Link

Styled link (anchor) with optional default icon, inline variant, and disabled state. Use for navigation; when disabled, the link does not navigate and click is suppressed.

## Import

```tsx
import { Link, linkVariants } from '@dtplatform/ipa-ui';
```

## Basic usage

```tsx
<Link href="/docs">Documentation</Link>
<Link href="/edit" variant="inline">Edit</Link>
<Link href="/page" disabled>Disabled link</Link>
```

## API

**Link** accepts standard anchor attributes (e.g. `href`, `target`, `rel`) plus:

| Prop       | Type     | Default     | Description |
|------------|----------|-------------|-------------|
| `variant`  | `'default'` \| `'inline'` | `'default'` | Visual style. Default variant shows an icon (pencil). |
| `disabled` | `boolean` | `false`     | When `true`, `href` is not applied and click is prevented; link looks disabled. |
| `testIdPrefix` | `string` | —       | Sets `data-testid` for tests. |
| `className`| `string` | —           | Extra CSS classes. |
| `children` | `ReactNode` | **required** | Link content. |

If `href` is missing or falsy, the link is treated as disabled (no navigation, `aria-disabled`).

## Examples

**External link**

```tsx
<Link href="https://example.com" target="_blank" rel="noopener noreferrer">
  External site
</Link>
```

**Inline (e.g. in paragraph)**

```tsx
<p>See our <Link href="/guide" variant="inline">guide</Link> for details.</p>
```

**Conditionally disabled**

```tsx
<Link href={userCanEdit ? '/edit' : undefined} disabled={!userCanEdit}>
  Edit
</Link>
```

## linkVariants

Use `linkVariants` to style a different element (e.g. React Router `Link`) like the design-system link:

```tsx
import { linkVariants } from '@dtplatform/ipa-ui';
import { Link as RouterLink } from 'react-router-dom';

<RouterLink to="/docs" className={linkVariants({ variant: 'default' })}>
  Docs
</RouterLink>
```

## Styling

Styles come from internal CSS modules. Use `className` to override. Disabled state applies visual and interaction treatment; the component uses `aria-disabled` when disabled.

## Accessibility

- Use `href` for real navigation; when disabled, the link doesn’t navigate and handles `onClick` to prevent default.
- For external links, include `rel="noopener noreferrer"` and consider indicating “opens in new window” in the text or with `aria-label`.
