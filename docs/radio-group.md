# RadioGroup

A group of radio options with a single selection. Built on [Radix UI Radio Group](https://www.radix-ui.com/primitives/docs/components/radio-group). Use for mutually exclusive choices (e.g. “Select one”).

## Import

```tsx
import { RadioGroup } from '@dtplatform/ipa-ui';
import type { RadioGroupProps } from '@dtplatform/ipa-ui';
```

## Basic usage

```tsx
const [value, setValue] = useState('a');

<RadioGroup
  label="Choose one"
  options={[
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
    { value: 'c', label: 'Option C', disabled: true },
  ]}
  value={value}
  onValueChange={setValue}
/>
```

## API

**RadioGroup** accepts Radix Radio Group Root props (e.g. `value`, `defaultValue`, `onValueChange`, `name`, `required`) except `children`, with these additions/overrides. Props and the ref go to the Radix Root, which sits inside an outer wrapper `<div>` that also holds the label.

| Prop          | Type     | Default     | Description |
|---------------|----------|-------------|-------------|
| `options`     | `{ value: string; label: string; disabled?: boolean }[]` | **required** | List of options. |
| `label`       | `string` | -           | Group label shown above the radios. |
| `horizontal`  | `boolean`| `false`     | Lay options out in a row instead of a column. Sets `orientation` and `data-orientation` on the Radix Root; use this rather than Radix's `orientation` prop. |
| `disabled`    | `boolean`| `false`     | Disable the entire group. |
| `styleOverrides` | `Record<string, string>` | - | Slot-to-class map merged with the defaults. Slots: `radioGroup` (outer wrapper), `label`, `group` (Radix Root), `item` (option row), `radio`, `indicator`, `itemContent`, `itemLabel`. Plain object or CSS module. |
| `className`   | `string` | -           | Extra class on the Radix Root (`group` slot), not on the outer wrapper. |

**Option fields**: `value` (required), `label` (required), `disabled` (optional; disable this option only). There is no exported option type; use `RadioGroupProps['options'][number]` if you need one.

**Data attributes:** the Radix Root has `data-testid="ipa_radio_group"` and `data-orientation` (`vertical` \| `horizontal`). The outer wrapper and each option row carry `data-disabled` (`true` / `false`).

## Examples

**Uncontrolled with default**

```tsx
<RadioGroup
  name="choice"
  defaultValue="b"
  options={[
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B' },
  ]}
/>
```

**Horizontal layout**

```tsx
<RadioGroup
  horizontal
  label="Size"
  options={[
    { value: 's', label: 'S' },
    { value: 'm', label: 'M' },
    { value: 'l', label: 'L' },
  ]}
  value={size}
  onValueChange={setSize}
/>
```

**Disabled group**

```tsx
<RadioGroup disabled options={options} value={value} onValueChange={setValue} />
```

## Styling

The component uses internal CSS modules for the group, each radio, and labels. Use `className` on the Radix Root to adjust spacing or alignment, and `styleOverrides` for the wrapper, label and option-level parts.

## Accessibility

Radix provides the radio ARIA roles and attributes. The group is associated with the optional `label` via `aria-labelledby`. Each option is a focusable radio with a visible `<label>`; individual `disabled` on options is respected.

Keyboard: every enabled option is in the tab order (disabled options get `tabIndex={-1}`); Space or Enter selects the focused option; arrow keys move focus to the previous/next enabled option (no wrap-around).
