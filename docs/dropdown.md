# Dropdown (SingleSelect & MultiSelect)

Dropdowns for choosing one option (**SingleSelect**) or multiple options (**MultiSelect**). Support filtering, keyboard navigation, custom icons, and optional “pop above” behavior. For a simple single-select without filter, you can also use the legacy **Dropdown** wrapper with `variant="single"` or `variant="filter"`.

## Import

```tsx
import { SingleSelect, MultiSelect, Dropdown } from '@dtplatform/ipa-ui';
// Types
import type { SingleSelectProps, MultiSelectProps } from '@dtplatform/ipa-ui';
```

## SingleSelect

One value selected from a list. Optional filter (search) mode.

### Basic usage

```tsx
const [value, setValue] = useState<string | undefined>();

<SingleSelect
  options={[
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B', disabled: true },
    { value: 'c', label: 'Option C' },
  ]}
  value={value}
  onChange={setValue}
  placeholder="Select an option"
/>
```

### SingleSelect props (main)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `Array<{ value: string; label: string; disabled?: boolean }>` | **required** | Options list. |
| `value` | `string` | — | Controlled value. |
| `onChange` | `(value: string) => void` | — | Called when selection changes. |
| `placeholder` | `string` | `'Select an option'` or `'Type to search...'` if `filter` | Trigger placeholder. |
| `disabled` | `boolean` | `false` | Disable the dropdown. |
| `filter` | `boolean` | `false` | Enable type-to-filter (search) in the list. |
| `popAbove` | `boolean` | `false` | Open popup above the trigger. |
| `hideFooter` | `boolean` | — | Hide footer area. |
| `hideRowHighlight` | `boolean` | — | Disable row highlight on focus/hover. |
| `disableKeyboardNavigation` | `boolean` | — | Disable arrow-key navigation. |
| `disableCloseOnOutsideClick` | `boolean` | `false` | Keep open when clicking outside. |
| `closeOnInputClick` | `boolean` | — | Close when clicking the trigger input (filter mode). |
| `icons` | `{ trigger?: ReactNode; footer?: ReactNode }` | — | Custom trigger or footer icons. |
| `styleOverrides` | `Record<string, string>` | — | Object mapping style slot names (e.g. `scrollContent`, `trigger`) to class names. Plain object for plain CSS; or pass a CSS module directly. See [Custom Style Overrides](../README.md#custom-style-overrides) in the main README. |

---

## MultiSelect

Multiple values selected; selected items can be shown as badges in the trigger.

### Basic usage

```tsx
const [value, setValue] = useState<string[]>([]);

<MultiSelect
  options={[
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
  ]}
  value={value}
  onChange={setValue}
  placeholder="Select multiple"
  maxDisplayBadges={2}
/>
```

### MultiSelect props (main)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `Array<{ value: string; label: string; disabled?: boolean }>` | **required** | Options list. |
| `value` | `string[]` | `[]` | Controlled value. |
| `onChange` | `(value: string[]) => void` | — | Called when selection changes. |
| `placeholder` | `string` | `'Select multiple options'` | Trigger placeholder. |
| `disabled` | `boolean` | `false` | Disable the dropdown. |
| `maxDisplayBadges` | `number` | `2` | Max badges shown in trigger; rest summarized (e.g. “+2”). |
| `popAbove` | `boolean` | `false` | Open popup above the trigger. |
| `hideFooter` | `boolean` | — | Hide footer. |
| `hideCheckboxes` | `boolean` | — | Hide checkboxes next to options. |
| `hideBadgeRemove` | `boolean` | — | Hide remove icon on badges. |
| `hideRemainingBadge` | `boolean` | — | Hide “+N” badge when more than `maxDisplayBadges` selected. |
| `disableCloseOnOutsideClick` | `boolean` | `false` | Keep open when clicking outside. |
| `disableCloseOnTriggerClick` | `boolean` | — | Don’t close when clicking trigger again. |
| `icons` | `{ trigger?: ReactNode; badgeClose?: ReactNode; check?: ReactNode }` | — | Custom icons. |
| `styleOverrides` | `Record<string, string>` | — | Object mapping style slot names (e.g. `scrollContent`, `trigger`) to class names. Plain object for plain CSS; or pass a CSS module directly. See [Custom Style Overrides](../README.md#custom-style-overrides) in the main README. |

---

## Legacy Dropdown wrapper

For backward compatibility, a single **Dropdown** component can render either SingleSelect or MultiSelect:

```tsx
<Dropdown
  variant="single"   // or "multiselect" | "filter"
  options={options}
  value={value}
  onChange={setValue}
  placeholder="Choose one"
/>
```

- `variant="single"` → SingleSelect  
- `variant="filter"` → SingleSelect with `filter={true}`  
- `variant="multiselect"` → MultiSelect  

Prefer importing **SingleSelect** or **MultiSelect** directly for new code.

---

## Accessibility

Dropdowns manage focus and keyboard (Enter to open/select, Arrow keys to move, Escape to close). Options use appropriate roles and attributes. For filter mode, ensure a visible label or `aria-label` so users know the control’s purpose.
