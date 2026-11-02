# Checkbox

Single checkbox control built on [Radix UI Checkbox](https://www.radix-ui.com/primitives/docs/components/checkbox). Supports controlled and uncontrolled usage, and disabled/indeterminate states.

## Import

```tsx
import { Checkbox } from '@dtplatform/ipa-ui';
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
| `defaultChecked`  | `boolean` \| `'indeterminate'` | Uncontrolled initial state. `'indeterminate'` also turns on the tri-state click loop (see `indeterminate`). |
| `onCheckedChange` | `(checked: boolean \| 'indeterminate') => void` | Called when state changes. |
| `disabled`        | `boolean`                | Disables the checkbox. Default `false`. |
| `indeterminate`   | `boolean`                | Uncontrolled only. When `true`, the initial state is indeterminate if `defaultChecked` is omitted, and clicks cycle indeterminate → checked → unchecked → indeterminate. Default `false` (plain on/off toggle; an indeterminate state steps to checked). Ignored when `checked` is passed. |
| `required`        | `boolean`                | HTML required. |
| `name`            | `string`                 | Form field name. |
| `value`           | `string`                 | Form value when checked. |
| `className`       | `string`                 | Extra CSS classes on the root. |
| `styleOverrides`  | `Record<string, string>` | Slot-to-class map merged with the defaults. Slots: `checkbox` (root), `indicator`, `icon` (both icons), `iconCheck`, `iconIndeterminate`. Plain object or CSS module. |

The component renders a check icon (Lucide) inside the box when checked and a minus icon when indeterminate. In controlled mode (`checked` passed), state changes are handled by Radix and reported through `onCheckedChange`; clicking an indeterminate box reports `true`.

The root renders `data-testid="ipa_checkbox"`, `data-state` (`checked` \| `unchecked` \| `indeterminate`) and `data-disabled` (`"true"` or `"false"`).

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

**Uncontrolled tri-state**

```tsx
<Checkbox indeterminate onCheckedChange={(state) => console.log(state)} />
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

The checkbox uses internal CSS modules. Use `className` to adjust size or appearance. Style checked or indeterminate states via `data-state` on the root (see [data attributes](data-attributes.md)).

## Accessibility

Radix handles focus and keyboard (Space to toggle). Associate a visible label via `htmlFor`/`id` or `aria-label`/`aria-labelledby` for screen readers.
