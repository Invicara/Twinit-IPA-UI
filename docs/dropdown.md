# Dropdown (SingleSelect & MultiSelect)

Dropdowns for choosing one option (**SingleSelect**) or multiple values (**MultiSelect**). The options list is rendered in a **portal** with **[Floating UI](https://floating-ui.com)** positioning (`fixed`, flip, shift, size) so it stays visible inside scroll parents and near viewport edges. Optional `popAbove` sets a **preferred** side; collision detection may still open the list on the other side. For a simple single-select without filter, you can also use the legacy **Dropdown** wrapper with `variant="single"` or `variant="filter"`.

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
| `popAbove` | `boolean` | `false` | Prefer opening the list above the trigger; may still open below if there is not enough space (flip). |
| `portalContainer` | `HTMLElement \| null` | — | Root node for the portaled listbox (same idea as Dialog `container`). Defaults to `#ipa-ui-modal-root` if present, otherwise `document.body`, so theme CSS variables apply when that root exists. |
| `floatingZIndex` | `number` | `1200` | `z-index` for the portaled listbox. |
| `maxVisibleOptions` | `number \| false` | `8` | Max option rows before the list scrolls; `false` removes this cap (only viewport / floating limits apply). With a numeric cap, the portaled popup height matches that cap plus the footer (not the full viewport). |
| `hideFooter` | `boolean` | — | Hide footer area. |
| `hideRowHighlight` | `boolean` | — | Disable row highlight on focus/hover. |
| `disableKeyboardNavigation` | `boolean` | — | When `true`: while the list is **open**, **↑/↓** do not move the active row. While **closed**, **↑/↓** / **Enter** / **Space** still **open** the list but do **not** set a keyboard row highlight (mouse hover still works). **Tab**, **Escape**, and other keys are unchanged. Treat **`"true"`** as enabled when the prop comes from HTML attributes or serialized controls (only the literal string `"true"` is coerced). |
| `disableClickOutside` | `boolean` | `false` | When `true` (or string `"true"` from controls), clicks outside the trigger and portaled list do **not** close the list. Other values (including `"false"`) are treated as off so outside close still works. |
| `openOnFocus` | `boolean` | `false` | **SingleSelect `filter`:** when `true`, focusing the input while it already contains filter text opens the list. Default `false` so focus alone (e.g. Tab into the field with a selected label) does not open the list; use click or typing to open. **`"true"`** string is coerced like other boolean-ish props. |
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
| `popAbove` | `boolean` | `false` | Prefer opening the list above the trigger; may still open below if there is not enough space (flip). |
| `portalContainer` | `HTMLElement \| null` | — | Root node for the portaled listbox. Defaults to `#ipa-ui-modal-root` if present, otherwise `document.body`. |
| `floatingZIndex` | `number` | `1200` | `z-index` for the portaled listbox. |
| `maxVisibleOptions` | `number \| false` | `8` | Max option rows before the list scrolls; `false` removes this cap (only viewport / floating limits apply). With a numeric cap, the portaled popup height matches that cap plus the footer (not the full viewport). |
| `hideFooter` | `boolean` | — | Hide footer. |
| `hideCheckboxes` | `boolean` | — | Hide checkboxes next to options. |
| `hideBadgeRemove` | `boolean` | — | Hide remove icon on badges. |
| `hideRemainingBadge` | `boolean` | — | Hide “+N” badge when more than `maxDisplayBadges` selected. |
| `disableClickOutside` | `boolean` | `false` | When `true` (or string `"true"` from controls), clicks outside the trigger and portaled list do **not** close the list. Other values (including `"false"`) are treated as off so outside close still works. |
| `disableCloseOnTriggerClick` | `boolean` | — | Don’t close when clicking trigger again. |
| `openOnFocus` | `boolean` | `false` | When `true`, **keyboard** focus on the trigger that matches **`:focus-visible`** opens the list (so Tab can open without a separate key; mouse focus alone typically does not). Default `false`. **`"true"`** string is coerced. |
| `disableKeyboardNavigation` | `boolean` | — | Same as SingleSelect: while **open**, **↑/↓** do not move the active row; while **closed**, keys that **open** the list do not set a keyboard row highlight. **Enter** / **Space** / **Tab** / **Escape** unchanged. The literal string **`"true"`** is treated as enabled when the prop is serialized. |
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

## Keyboard behavior (W3C-aligned listbox / combobox)

Behavior follows the common **select / listbox** keyboard matrix (closed trigger vs open list), aligned with guidance such as the [W3C ARIA Authoring Practices Guide patterns for combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) and listbox keyboard interaction.

DOM focus stays on the **trigger** (MultiSelect button or SingleSelect input) while the list is open; the highlighted row is **visual** focus (e.g. `aria-activedescendant`-style highlighting), except where noted.

### Closed — focus on trigger

| Key | Behavior |
|-----|----------|
| **Tab** / **Shift+Tab** | Native tab order only; list does **not** open. |
| **↓** | Opens the list. Active option: **current value** if it appears in the list; otherwise the **first** option. (SingleSelect **filter** uses the **filtered** list.) |
| **↑** | Opens the list. Active option: **current value** if present; otherwise the **last** option. |
| **Enter** | Opens the list with the same active option rule as **↓**. |
| **Space** | Same as **Enter** (open only; no commit). |

### Open — list visible

| Key | Behavior |
|-----|----------|
| **Tab** / **Shift+Tab** | **Closes** the list **without** changing the selection, then moves focus to the **next** / **previous** focusable control **outside** the portaled list. The next control is chosen in **tab order** (`tabIndex` then document order); the trigger is blurred first so focus can leave reliably. If the trigger is not found in the standard focusable list (e.g. timing), the next control is resolved using **document order** among focusables. |
| **↓** / **↑** | Move the **active** (highlighted) option only; no commit. *(If `disableKeyboardNavigation` is set, these keys do **not** move the active row while open, and do not set a keyboard highlight when opening from closed.)* |
| **Enter** | **SingleSelect**: selects the active option, **closes** the list, focus returns to the input. **MultiSelect**: **toggles** the active option in the value array and **closes** the list. |
| **Space** | **SingleSelect**: same as **Enter** (select + close), **except** in **`filter` mode** when the **real** keyboard row index is unset (`focusedIndex < 0`): **Space** is not intercepted so the user can type a space in the search field (the **typeahead** row may still show a highlight for the first match). **MultiSelect**: **toggles** the active option like **Enter** but **does not close** the list—use **Enter** to commit and close, or **Space** repeatedly to toggle multiple rows while staying open. |
| **Escape** | Closes the list **without** changing the selection; focus remains on the trigger. **SingleSelect filter:** if the list is already closed and the query was cleared to empty while a value was still committed, **Escape** restores the committed label in the input (same as blur—does not call `onChange`). |

**Scrolling:** When the **keyboard** moves the active row (`focusedIndex` from arrows or open-from-closed with navigation enabled), the list scrolls that row toward the **center** of the scrollable region. **Filter** typeahead highlighting of the first match does **not** scroll the list, so mouse-driven selection does not fight with `scrollIntoView`. **Mouse:** Moving the pointer over rows updates the highlight even while the list is scrolling (wheel or scrollbar); moving the mouse only exits “keyboard list” mode without clearing the row under the pointer.

**Left / Right arrows** are not used on these **select-only** variants (they are relevant for **editable** comboboxes with a text cursor).

**Home** / **End** are not implemented on the list (not part of the matrix above).

### Filter mode (SingleSelect)

- **Display:** After choosing an option, the selected label appears in the input immediately (even before a controlled parent re-renders with the new `value`), so the field does not flash the placeholder until blur.
- **Reopen:** With **`openOnFocus={false}`** (default), focusing the input does **not** open the list even when the field shows the selected label as filter text (avoids reopening after a mouse pick when focus returns to the input). Set **`openOnFocus`** to opt into opening the list when the input gains focus and the query text is non-empty. The user can **backspace** or edit the text to widen or narrow results; typing still opens the list via `onChange`.
- **Clear / revert:** Backspacing until the query is **empty** shows the **placeholder** while focus stays in the field (the committed selection is unchanged until you confirm). The open list’s **row highlight is cleared** (no active option) until you use **↑/↓** or **hover** again. **Enter** or **Space** with an empty query and **no** highlighted row **commits** clearing (`onChange("")`). **Blur** (tab away / click elsewhere), **Escape** (including when the list is already closed), or closing via **click outside** **discards** that edit and puts the **last committed selection’s label** back in the input—unless you already cleared with Enter/Space. With the list **open**, an empty query, and a **keyboard- or mouse-highlighted** row (**↑/↓** or hover), **Enter** / **Space** commit that row instead of clearing.
- **Typing:** While the list is open and the query is non-empty, the **first** matching row is shown as highlighted (**typeahead**). Printable keys do not switch the control into “keyboard list” mode so **mouse hover** on rows still updates the highlight without scroll jank.
- **Keys:** When the list is open, **↑/↓**, **Tab**, **Escape**, **Enter**, and **Space** follow the same matrix as non-filter mode, with the **Space** exception above when the **real** row index is unset **and** the query is non-empty (so a space character can be typed). With an **empty** query, **Enter** / **Space** clear the selection as under **Clear** above.

### Chevron button (SingleSelect)

The chevron beside the input uses **Enter** / **Space** as a **toggle** (open ↔ close) and does not mirror the full listbox matrix. Prefer keyboarding through the main input for spec-complete behavior.

---

## Accessibility

Ensure a visible label or `aria-label` on the control (especially filter mode). Options list semantics live in the portaled popup; the popup root is marked `data-ipa-ui-dropdown-floating` for focus management.

### Review / product questions

1. **No selection, ↑ vs ↓**: **↑** lands on the **last** option and **↓** on the **first** when there is no current value—confirm that matches your UX.
