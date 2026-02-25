# Slider

Single-thumb or range (dual-thumb) slider with optional labels and numeric inputs. Built on [Radix UI Slider](https://www.radix-ui.com/primitives/docs/components/slider). Use for selecting a number or range within min/max.

## Import

```tsx
import { Slider, sliderVariants } from '@dtplatform/ipa-ui';
```

## Basic usage

```tsx
// Single value
const [value, setValue] = useState(50);
<Slider
  label="Volume"
  value={[value]}
  onValueChange={([v]) => setValue(v)}
  min={0}
  max={100}
/>

// Range (two thumbs)
const [range, setRange] = useState([25, 75]);
<Slider
  variant="range"
  label="Price range"
  value={range}
  onValueChange={setRange}
  min={0}
  max={1000}
/>
```

## API

**Slider** accepts Radix Slider Root props (e.g. `min`, `max`, `step`, `value`, `onValueChange`, `defaultValue`) with these additions:

| Prop           | Type     | Default  | Description |
|----------------|----------|----------|-------------|
| `variant`      | `'default'` \| `'range'` | `'default'` | Single thumb or range (two thumbs). |
| `label`        | `string` | `'Select Amount'` | Label above the slider. |
| `minLabel`     | `string` | `'0'`    | Text at minimum end. |
| `maxLabel`     | `string` | `'100'`  | Text at maximum end. |
| `disabled`     | `boolean`| `false`  | Disable slider and number inputs. |
| `testIdPrefix` | `string` | —        | Sets `data-testid` on the root. |
| `className`    | `string` | —        | Extra class on the container. |

**Value shape:**

- **Single (`variant="default"`)**: `value` / `defaultValue` is an array of one number, e.g. `[50]`. `onValueChange` receives `(number[])`.
- **Range (`variant="range"`)**: `value` / `defaultValue` is an array of two numbers, e.g. `[25, 75]`. Uncontrolled default is `[25, 75]`.

**Radix props** (commonly used): `min` (default `0`), `max` (default `100`), `step` (default `1`).

## Examples

**Uncontrolled single**

```tsx
<Slider defaultValue={[50]} min={0} max={100} />
```

**Uncontrolled range**

```tsx
<Slider variant="range" defaultValue={[20, 80]} min={0} max={100} />
```

**With custom min/max labels**

```tsx
<Slider
  label="Discount"
  minLabel="$0"
  maxLabel="$100"
  min={0}
  max={100}
  value={[discount]}
  onValueChange={([v]) => setDiscount(v)}
/>
```

**Disabled**

```tsx
<Slider disabled value={[50]} />
```

The component also renders optional number inputs below the track (one for single, two for range) so users can type the value. These stay in sync with the slider and respect `min`, `max`, `step`, and `disabled`.

## sliderVariants

For custom wrappers that match the design system:

```tsx
import { sliderVariants } from '@dtplatform/ipa-ui';
<div className={sliderVariants({ variant: 'range' })}>...</div>
```

## Styling

The slider uses internal CSS modules for the track, range fill, thumbs, labels, and inputs. Use `className` on the root for layout. Theme variables can affect colors; check the library’s theme layer if you need to override.

## Accessibility

Radix handles keyboard (arrow keys, focus management) and ARIA attributes. The root is associated with the optional `label` via `aria-labelledby`. Ensure the label is visible or provide an accessible name for screen readers.
