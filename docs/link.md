# Link

Styled link (anchor) with optional leading icon, inline variant, and disabled state. Use for navigation; when disabled, the link does not navigate and click is suppressed.

## Import

```tsx
import { Link } from '@dtplatform/ipa-ui';
```

## Basic usage

```tsx
<Link href="/docs">Documentation</Link>
<Link href="/edit" inline>Edit</Link>
<Link href="/page" disabled>Disabled link</Link>
```

## API

**Link** accepts standard anchor attributes (e.g. `href`, `target`, `rel`) plus:

| Prop       | Type     | Default     | Description |
|------------|----------|-------------|-------------|
| `inline`   | `boolean` | `false`     | Inline text style: underlined (underline removed on hover) and laid out inline. When `false`, the default style is a non-underlined flex row (icon + text). Exposed as `data-variant` (`"inline"` or `"default"`). Only the inline variant is underlined. |
| `icon`     | `ReactNode` | -         | Optional leading icon element, rendered before `children` in a 14px slot. No icon is rendered by default. |
| `disabled` | `boolean` | `false`     | When `true`, `href` is not applied and click is prevented (your `onClick` is not called); link looks disabled. |
| `styleOverrides` | `Record<string, string>` | - | Slot-to-class map merged with the defaults. Slots: `link` (anchor), `icon` (icon wrapper), `withIcon` (added on inline links that have an icon). Plain object or CSS module. |
| `className`| `string` | -           | Extra CSS classes. |
| `children` | `ReactNode` | **required** | Link content. |

The anchor renders `data-testid="ipa_link"`, `data-variant` (`"default"` \| `"inline"`), `data-disabled` and `aria-disabled` (`true` / `false`).

If `href` is missing or falsy, the link is treated as disabled (no navigation, `aria-disabled="true"`).

## Examples

**External link**

```tsx
<Link href="https://example.com" target="_blank" rel="noopener noreferrer">
  External site
</Link>
```

**Inline (e.g. in paragraph)**

```tsx
<p>See our <Link href="/guide" inline>guide</Link> for details.</p>
```

**Conditionally disabled**

```tsx
<Link href={userCanEdit ? '/edit' : undefined} disabled={!userCanEdit}>
  Edit
</Link>
```

**With icon**

```tsx
import { Pencil } from 'lucide-react';

<Link href="/edit" icon={<Pencil />}>Edit</Link>
```

## Styling

Styles come from internal CSS modules. Use `className` to override. Disabled state applies visual and interaction treatment; the component uses `aria-disabled` when disabled.

## Accessibility

- Use `href` for real navigation; when disabled, the link doesn’t navigate: its click handler calls `preventDefault()` and `stopPropagation()`.
- For external links, include `rel="noopener noreferrer"` and consider indicating “opens in new window” in the text or with `aria-label`.
