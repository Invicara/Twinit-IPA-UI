# RadioGroup

A group of radio options with a single selection. Built on [Radix UI Radio Group](https://www.radix-ui.com/primitives/docs/components/radio-group). Use for mutually exclusive choices (e.g. “Select one”).

## Import

```tsx
import { RadioGroup, radioGroupVariants } from '@invicara/ipa-ui';
import type { RadioGroupOption } from '@invicara/ipa-ui';
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

**RadioGroup** accepts Radix Radio Group props (e.g. `value`, `onValueChange`, `name`) with these additions/overrides:

| Prop          | Type     | Default     | Description |
|---------------|----------|-------------|-------------|
| `options`     | `RadioGroupOption[]` | **required** | List of options. |
| `label`       | `string` | —           | Group label shown above the radios. |
| `orientation` | `'vertical'` \| `'horizontal'` | `'vertical'` | Layout of options. |
| `disabled`    | `boolean`| `false`     | Disable the entire group. |
| `testIdPrefix`| `string` | —           | Sets `data-testid` on the root. |
| `className`   | `string` | —           | Extra class on the group root. |

**RadioGroupOption**:

| Field      | Type     | Description |
|------------|----------|-------------|
| `value`    | `string` | **required** Option value. |
| `label`    | `string` | **required** Visible label. |
| `disabled` | `boolean`| Optional; disable this option only. |
| `helperText` | `string` | Optional; not all implementations may render it. |

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
  orientation="horizontal"
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

## radioGroupVariants

For custom layouts that match the design system:

```tsx
import { radioGroupVariants } from '@invicara/ipa-ui';
<div className={radioGroupVariants({ orientation: 'horizontal' })}>
  {/* custom radio markup */}
</div>
```

## Styling

The component uses internal CSS modules for the group, each radio, and labels. Use `className` on the root to adjust spacing or alignment. Option-level styling is controlled by the library; override via theme/CSS variables if supported.

## Accessibility

Radix provides keyboard navigation and ARIA attributes. The group is associated with the optional `label` via `aria-labelledby`. Each option is a focusable radio with a visible label; individual `disabled` on options is respected.
