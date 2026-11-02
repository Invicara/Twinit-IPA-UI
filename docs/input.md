# Input

Text input or textarea with optional label, helper text, password visibility toggle, and leading icon. Supports validation states (default, error, success, warning, readonly) for use in forms.

## Import

```tsx
import { Input, inputVariants } from '@dtplatform/ipa-ui';
```

## Basic usage

```tsx
<Input label="Email" placeholder="you@example.com" />
<Input label="Password" type="password" password placeholder="••••••" />
<Input label="Notes" textarea placeholder="Optional notes" />
```

## API

**Input** accepts standard `input` / `textarea` HTML attributes (except `size`) plus:

| Prop         | Type     | Default     | Description |
|--------------|----------|-------------|-------------|
| `state`      | `'default'` \| `'error'` \| `'success'` \| `'warning'` \| `'readonly'` | `'default'` | Visual and accessibility state. |
| `size`       | `'default'` \| `'sm'` \| `'lg'` | `'default'` | Field height and typography. `sm` = 32px, `lg` = 40px (single-line). |
| `fitContent` | `boolean` | `false` | Outer wrapper uses `fit-content` width instead of 100%. |
| `label`      | `string` | —           | Label text above the field. |
| `helperText` | `string` | —           | Hint or error text below the field. |
| `password`   | `boolean`| `false`     | Renders a show/hide password toggle. |
| `clearable`  | `boolean`| `false`     | Renders an X icon inside the field to clear the current value. |
| `textarea`   | `boolean`| `false`     | Renders a `<textarea>` instead of `<input>`. |
| `icon`       | `LucideIcon` \| `ComponentType<{ className? }>` | — | Leading icon inside the input area. |
| `testIdPrefix` | `string` | —         | Sets `data-testid` for tests. |
| `className`  | `string` | —           | Extra class on the input/textarea. |

When `state === 'readonly'`, the field is not editable and receives `readOnly`. Use `state` together with `helperText` to show validation messages (e.g. `state="error"` and `helperText="Invalid email"`).

When `clearable` is set, an X icon appears on the right while the field has a value; click it to clear. With `password`, the X sits just left of the eye toggle.

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
<Input label="Description" textarea rows={4} placeholder="Describe..." />
```

**With icon**

```tsx
import { Search } from 'lucide-react';
<Input label="Search" icon={Search} placeholder="Search..." />
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

## inputVariants

For building custom inputs that match the design system:

```tsx
import { inputVariants } from '@dtplatform/ipa-ui';
<input className={inputVariants({ state: 'error', variant: 'input' })} />
```

## Styling

The component uses internal CSS modules. Label and helper text colors change with `state`. Override with `className` on the root container or rely on theme variables used inside the library.

## Accessibility

- Label is associated via `htmlFor` / `id` (auto-generated with `useId()`).
- Helper text is linked with `aria-describedby`.
- Password toggle has `aria-label` (“Show password” / “Hide password”).
- Readonly state is reflected in the DOM and styling.
