# Input

Text input or textarea with optional label, helper text, password visibility toggle, and leading icon. Supports validation states (default, error, success, warning, readonly) for use in forms.

## Import

```tsx
import { Input } from '@dtplatform/ipa-ui';
```

## Basic usage

```tsx
<Input label="Email" placeholder="you@example.com" />
<Input label="Password" type="password" password placeholder="••••••" />
<Input label="Notes" textarea placeholder="Optional notes" />
```

## API

**Input** accepts standard `input` HTML attributes (except `size`) plus the props below. They are passed to the `<input>` / `<textarea>` element, except `className`. The prop type is based on `input` attributes, so textarea-only attributes such as `rows` are not typed. The ref is forwarded to the `<input>` / `<textarea>` element.

| Prop         | Type     | Default     | Description |
|--------------|----------|-------------|-------------|
| `state`      | `'default'` \| `'error'` \| `'success'` \| `'warning'` \| `'readonly'` | `'default'` | Visual and accessibility state. |
| `size`       | `'default'` \| `'sm'` \| `'lg'` | `'default'` | Field height and typography. Single-line: `default` = 36px, `sm` = 32px, `lg` = 40px. Textarea min-height: 80px, 64px, 96px. |
| `fitContent` | `boolean` | `false` | Outer wrapper uses `fit-content` width instead of 100%. |
| `label`      | `string` | -           | Label text above the field. |
| `helperText` | `string` | -           | Hint or error text below the field. |
| `password`   | `boolean`| `false`     | Masks the value (`type="password"`) and renders a show/hide toggle. When revealed, `type` falls back to your `type` prop or `text`. No effect with `textarea`. |
| `clearable`  | `boolean`| `false`     | Renders an X button inside the field to clear the current value. Not shown with `textarea`, `disabled`, or `state="readonly"`. |
| `textarea`   | `boolean`| `false`     | Renders a `<textarea>` instead of `<input>`. |
| `icon`       | `ReactNode` | -        | Leading icon element inside the input area (pass an element, e.g. `<Search />`, not a component). |
| `className`  | `string` | -           | Extra class on the outer root container (not on the input/textarea; use `styleOverrides.inputBox` for that). |
| `styleOverrides` | `Record<string, string>` | - | Slot-to-class map merged with the defaults. Slots: `input` (root), `inputFitContent`, `label`, `wrapper`, `iconContainer`, `icon`, `inputBox` (the field), `variantInput`, `variantTextarea`, `withIcon`, `withPassword`, `withClear`, `clearButton`, `clearButtonWithPassword`, `clearButtonIcon`, `passwordToggle`, `passwordToggleIcon`, `helperText`. Plain object or CSS module. |

When `state === 'readonly'`, the field is not editable and receives `readOnly`. Use `state` together with `helperText` to show validation messages (e.g. `state="error"` and `helperText="Invalid email"`).

When `clearable` is set, an X button appears on the right while the field has a value; clicking it empties the field, calls `onChange` with an event whose `target.value` is `""`, and refocuses the field. With `password`, the X sits just left of the eye toggle. In controlled mode, update your state from that `onChange`.

**Data attributes:** the field has `data-testid="ipa_input"`, `data-state`, `data-size` and `data-disabled` (`"true"` or `"false"`). The root, label and helper text carry `data-state`; the root also has `data-fit-content` when `fitContent` is set. The clear button has `data-testid="ipa_input_clear"`.

## Examples

**Controlled**

```tsx
const [email, setEmail] = useState('');
<Input
  label="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

**With validation**

```tsx
<Input
  label="Email"
  state={errors.email ? 'error' : 'default'}
  helperText={errors.email}
  value={email}
  onChange={...}
/>
```

**Password with toggle**

```tsx
<Input label="Password" password placeholder="Enter password" />
```

**Textarea**

```tsx
<Input label="Description" textarea placeholder="Describe..." />
```

**With icon**

```tsx
import { Search } from 'lucide-react';
<Input label="Search" icon={<Search />} placeholder="Search..." />
```

**Compact (toolbar / inline)**

```tsx
<Input fitContent size="sm" placeholder="Search names..." aria-label="Filter Name" />
```

**Large**

```tsx
<Input size="lg" label="Company" placeholder="Acme Inc." />
```

**Readonly**

```tsx
<Input label="ID" state="readonly" value={entity.id} />
```

## Styling

The component uses internal CSS modules. Label and helper text colors change with `state`. Override with `className` on the root container, `styleOverrides` for inner parts, or rely on theme variables used inside the library.

## Accessibility

- Label is associated via `htmlFor` / `id` (auto-generated with `useId()`). Passing your own `id` replaces the generated one on the field and breaks that association.
- Helper text is linked with `aria-describedby`.
- `aria-invalid` is set when `state="error"`.
- Password toggle has `aria-label` (“Show password” / “Hide password”); the clear button has `aria-label="Clear input"`. Both are skipped in tab order (`tabIndex={-1}`).
- Readonly state is reflected in the DOM and styling.
