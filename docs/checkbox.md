# Checkbox

Single checkbox control built on [Radix UI Checkbox](https://www.radix-ui.com/primitives/docs/components/checkbox). Supports controlled and uncontrolled usage, and disabled/indeterminate states.

## Import

```tsx
import { Checkbox } from '@invicara/ipa-ui';
```

## Basic usage

```tsx
// Uncontrolled
<Checkbox />

// Controlled
const [checked, setChecked] = useState(false);
<Checkbox checked={checked} onCheckedChange={setChecked} />

// With label (you provide the label element)
<label>
  <Checkbox /> Accept terms
</label>
```

## API

**Checkbox** accepts [Radix Checkbox Root](https://www.radix-ui.com/primitives/docs/components/checkbox#root) props, including:

| Prop              | Type                     | Description |
|-------------------|--------------------------|-------------|
| `checked`         | `boolean` \| `'indeterminate'` | Controlled checked state. |
| `defaultChecked`  | `boolean`                | Uncontrolled initial state. |
| `onCheckedChange` | `(checked: boolean \| 'indeterminate') => void` | Called when state changes. |
| `disabled`        | `boolean`                | Disables the checkbox. |
| `required`        | `boolean`                | HTML required. |
| `name`            | `string`                 | Form field name. |
| `value`           | `string`                 | Form value when checked. |
| `className`       | `string`                 | Extra CSS classes. |

The component renders a check icon (Lucide) inside the box when checked. Indeterminate state is supported via Radix.

## Examples

**Form integration**

```tsx
<Checkbox name="newsletter" value="yes" onCheckedChange={(c) => setNewsletter(c === true)} />
```

**Indeterminate (e.g. “select all”)**

```tsx
<Checkbox
  checked={indeterminate ? 'indeterminate' : allSelected}
  onCheckedChange={handleSelectAll}
/>
```

**With label and aria**

```tsx
const id = useId();
<>
  <Checkbox id={id} aria-label="Accept terms" />
  <label htmlFor={id}>Accept terms</label>
</>
```

## Styling

The checkbox uses internal CSS modules. Use `className` to adjust size or appearance. The component uses a `peer` class so sibling elements can style based on checked state (e.g. Tailwind `peer-checked:`).

## Accessibility

Radix handles focus and keyboard (Space to toggle). Associate a visible label via `htmlFor`/`id` or `aria-label`/`aria-labelledby` for screen readers.
