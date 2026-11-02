# Slider

Single-thumb or range (dual-thumb) slider with optional labels and numeric inputs. Built on [Radix UI Slider](https://www.radix-ui.com/primitives/docs/components/slider). Use for selecting a number or range within min/max.

## Import

```tsx
import { Slider } from '@dtplatform/ipa-ui';
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
  range
  label="Price range"
  value={range}
  onValueChange={setRange}
  min={0}
  max={1000}
/>
```

## API

**Slider** accepts Radix Slider Root props (e.g. `min`, `max`, `step`, `value`, `onValueChange`, `defaultValue`, `onValueCommit`) with these additions. Props and the ref go to the Radix Root, which sits inside an outer wrapper `<div>` with the label, min/max labels and number inputs.

| Prop           | Type     | Default  | Description |
|----------------|----------|----------|-------------|
| `range`        | `boolean`| `false`  | Range mode: uncontrolled default becomes `[25, 75]` and two number inputs are shown. The number of thumbs always follows the length of the value array. |
| `label`        | `string` | `'Select Amount'` | Label above the slider. Pass `""` to hide it. |
| `minLabel`     | `string` | `'0'`    | Static text at the minimum end (not derived from `min`). Pass `""` to hide it. |
| `maxLabel`     | `string` | `'100'`  | Static text at the maximum end (not derived from `max`). Pass `""` to hide it. |
| `disabled`     | `boolean`| `false`  | Disable slider and number inputs. |
| `showValueInputs` | `boolean` | `true` | Show the built-in number inputs below the track. Set `false` if you render your own. |
| `styleOverrides` | `Record<string, string>` | - | Slot-to-class map merged with the defaults. Slots: `slider` (outer wrapper), `label`, `controls`, `minLabel`, `maxLabel`, `sliderContainer`, `root` (Radix Root), `track`, `range` (filled part), `thumb`, `inputs`, `inputContainer` (single mode only), `inputBox` (each number input). Plain object or CSS module. |
| `className`    | `string` | -        | Extra class on the Radix Root (`root` slot), not on the outer wrapper. |

**Data attributes:** the Radix Root has `data-testid="ipa_slider"`, `data-disabled`, and `data-range="true"` in range mode. The outer wrapper has `data-disabled` (`true` / `false`).

**Value shape:**

- **Single (default)**: `value` / `defaultValue` is an array of one number, e.g. `[50]`. Uncontrolled default is `[50]`. `onValueChange` receives `(number[])`.
- **Range (`range`)**: `value` / `defaultValue` is an array of two numbers, e.g. `[25, 75]`. Uncontrolled default is `[25, 75]`.

**Radix props** (commonly used): `min` (default `0`), `max` (default `100`), `step` (default `1`).

## Examples

**Uncontrolled single**

```tsx
<Slider defaultValue={[50]} min={0} max={100} />
```

**Uncontrolled range**

```tsx
<Slider range defaultValue={[20, 80]} min={0} max={100} />
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

By default the component also renders number inputs below the track (one for single, two for range) so users can type the value; hide them with `showValueInputs={false}`. They stay in sync with the slider and fire `onValueChange`. Typed values are clamped to `min` / `max` (non-numeric input is ignored); `step` is applied to the inputs' spinner but typed values are not snapped to it. The inputs are disabled with `disabled`.

## Styling

The slider uses internal CSS modules for the track, range fill, thumbs, labels, and inputs. Use `className` on the Radix Root for the track area and `styleOverrides` for the other parts. Theme variables can affect colors; check the library’s theme layer if you need to override.

## Accessibility

Radix handles keyboard (arrow keys, focus management) and ARIA attributes. The root is associated with the optional `label` via `aria-labelledby`. Ensure the label is visible or provide an accessible name for screen readers. The built-in number inputs have no label of their own; if that matters for your form, hide them with `showValueInputs={false}` and render labelled inputs yourself.
