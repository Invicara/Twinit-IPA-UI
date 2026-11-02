# Dropdown (SingleSelect & MultiSelect)

Dropdowns for choosing one option (**SingleSelect**) or multiple values (**MultiSelect**). The options list is rendered in a **portal** with **[Floating UI](https://floating-ui.com)** positioning (`fixed`, flip, shift, size) so it stays visible inside scroll parents and near viewport edges. Optional `popAbove` sets a **preferred** side; collision detection may still open the list on the other side. A legacy **Dropdown** wrapper (selected with `variant`) is kept for backward compatibility, see [Legacy Dropdown wrapper](#legacy-dropdown-wrapper).

## Import

```tsx
import { SingleSelect, MultiSelect, Dropdown, DROPDOWN_DEFAULT_MAX_VISIBLE_OPTIONS } from '@dtplatform/ipa-ui';
// Types
import type { SingleSelectProps, MultiSelectProps, DropdownProps, DropdownOption } from '@dtplatform/ipa-ui';
```

`DROPDOWN_DEFAULT_MAX_VISIBLE_OPTIONS` is the default for `maxVisibleOptions` (`8`).

Both components forward `ref` to their root `<div>`. Their props types do not include HTML attributes; hyphenated attributes you pass (such as `data-testid` or `aria-*`) are spread onto the root `<div>`, not onto the input or trigger button.

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

### SingleSelect props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `Array<{ value: string; label: string; disabled?: boolean }>` | **required** | Options list. |
| `value` | `string` | - | Controlled value (the selected option's `value`). |
| `onChange` | `(value: string) => void` | - | Called when an option is picked. In `filter` mode it is also called with `""` when the user clears the selection (see [Filter mode](#filter-mode-singleselect)). |
| `className` | `string` | - | Extra class on the `<input>` (not the root). |
| `placeholder` | `string` | `'Select an option'`, or `'Type to search...'` if `filter` | Input placeholder. |
| `disabled` | `boolean` | `false` | Disable the dropdown. |
| `filter` | `boolean` | `false` | Makes the input editable: options are filtered by case-insensitive substring match on `label`, the matching text is highlighted, and "No options found" is shown when nothing matches. Without `filter` the input is read-only. |
| `popAbove` | `boolean` | `false` | Prefer opening the list above the trigger; may still open below if there is not enough space (flip). |
| `portalContainer` | `HTMLElement \| null` | - | Root node for the portaled listbox (same idea as Dialog `container`). Defaults to `#ipa-ui-modal-root` if present, otherwise `document.body`, so theme CSS variables apply when that root exists. |
| `floatingZIndex` | `number` | `1200` | `z-index` for the portaled listbox. |
| `maxVisibleOptions` | `number \| false` | `8` | Max option rows (35px each) before the list scrolls; `false` removes this cap (only viewport / floating limits apply). With a numeric cap, the portaled popup height matches that cap plus the footer (not the full viewport). Ignored when `disableScrolling` is set. |
| `disableScrolling` | `boolean` | `false` | Removes the scrollable list area and the `maxVisibleOptions` cap. Options that do not fit in the available viewport height are clipped, not scrollable. |
| `disableSelectionLooping` | `boolean` | `false` | **↑/↓** stop at the first / last option instead of wrapping around. |
| `hideFooter` | `boolean` | `false` | Hide the chevron footer strip of the list (clicking the footer closes the list). |
| `hideRowHighlight` | `boolean` | `false` | No hover / keyboard highlight on option rows (`data-focused` is not set). |
| `hideLongTextEllipsis` | `boolean` | `false` | Hide the `..` indicator shown when an option label is truncated. |
| `hideLongTextTooltip` | `boolean` | `false` | Do not set a native `title` tooltip with the full label on truncated options. |
| `enableLongTextAnimation` | `boolean` | `false` | On hover, scroll a truncated option label horizontally so the full text can be read. |
| `disableIconAnimation` | `boolean` | `false` | Turn off the chevron rotation when the list opens. |
| `disableKeyboardNavigation` | `boolean` | `false` | Turns off keyboard selection. While **closed**, **↑/↓** do nothing (they do not open the list); **Enter** / **Space** still open it but without a highlighted row. While **open**, **↑/↓**, **Enter** and **Space** are ignored (arrow keys are also swallowed so the page and list do not scroll); pick options with the mouse. **Tab** and **Escape** still work. In `filter` mode, **Enter** / **Space** in a closed, empty input still clear the selection. The literal string `"true"` is treated as enabled (serialized props / Storybook controls). |
| `disableClickOutside` | `boolean` | `false` | When `true` (or string `"true"` from controls), clicks outside the trigger and portaled list do **not** close the list. Other values (including `"false"`) are treated as off so outside close still works. |
| `openOnFocus` | `boolean` | `false` | Without `filter`: **keyboard** focus on the input that matches `:focus-visible` (e.g. Tab) opens the list. With `filter`: focusing the input opens the list when it contains text (on focus the input is pre-filled with the selected label, so this includes any committed selection). Default `false`, so focus alone does not open the list; use click, typing or the keys below. The literal string `"true"` is treated as enabled. |
| `icons` | `{ trigger?: ReactNode; footer?: ReactNode }` | - | `trigger` replaces the chevron next to the input. `footer` replaces the footer chevron of the "No options found" popup only; the footer of the options list always uses the default chevron. |
| `styleOverrides` | `Record<string, string>` | - | Object mapping style slot names to class names. Plain object for plain CSS; or pass a CSS module directly. See [Styling](#styling-styleoverrides) and [Custom Style Overrides](../README.md#custom-style-overrides) in the main README. |

---

## MultiSelect

Multiple values selected; selected items are shown as badges in the trigger, and each option row has a checkbox.

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

### MultiSelect props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `Array<{ value: string; label: string; disabled?: boolean }>` | **required** | Options list. |
| `value` | `string[]` | `[]` | Controlled value. |
| `onChange` | `(value: string[]) => void` | - | Called with the new array when an option is toggled or a badge is removed. |
| `className` | `string` | - | Extra class on the trigger `<button>` (not the root). |
| `placeholder` | `string` | `'Select multiple options'` | Shown in the trigger when nothing is selected. |
| `disabled` | `boolean` | `false` | Disable the dropdown. |
| `maxDisplayBadges` | `number` | `2` | Max badges shown in the trigger; the rest are summarised as a `+N` badge. Badge labels longer than 10 characters are truncated with `..`. |
| `wrapBadges` | `boolean` | `false` | Let badges wrap onto several lines in the trigger instead of staying on one line. |
| `hideRemainingBadge` | `boolean` | `false` | Hide the `+N` badge when more than `maxDisplayBadges` are selected. |
| `hideBadgeRemove` | `boolean` | `false` | Hide the remove (X) icon on badges. |
| `hideSelectionCount` | `boolean` | `false` | Hide the "`N` selected" header in the list (at the top, or at the bottom when the list opens above). |
| `hideCheckboxes` | `boolean` | `false` | Hide the checkboxes next to options. |
| `rightAlignCheckboxes` | `boolean` | `false` | Place checkboxes on the right of the option label. |
| `popAbove` | `boolean` | `false` | Prefer opening the list above the trigger; may still open below if there is not enough space (flip). |
| `portalContainer` | `HTMLElement \| null` | - | Root node for the portaled listbox. Defaults to `#ipa-ui-modal-root` if present, otherwise `document.body`. |
| `floatingZIndex` | `number` | `1200` | `z-index` for the portaled listbox. |
| `maxVisibleOptions` | `number \| false` | `8` | Max option rows (35px each) before the list scrolls; `false` removes this cap (only viewport / floating limits apply). With a numeric cap, the portaled popup height matches that cap plus the footer (not the full viewport). Ignored when `disableScrolling` is set. |
| `disableScrolling` | `boolean` | `false` | Removes the scrollable list area and the `maxVisibleOptions` cap. Options that do not fit in the available viewport height are clipped, not scrollable. |
| `disableSelectionLooping` | `boolean` | `false` | **↑/↓** stop at the first / last option instead of wrapping around. |
| `hideFooter` | `boolean` | `false` | Hide the chevron footer strip of the list (clicking the footer closes the list). |
| `hideRowHighlight` | `boolean` | `false` | No hover / keyboard highlight on option rows (`data-focused` is not set). |
| `hideLongTextEllipsis` | `boolean` | `false` | Hide the `..` indicator shown when an option label is truncated. |
| `hideLongTextTooltip` | `boolean` | `false` | Do not set a native `title` tooltip with the full label on truncated options. |
| `enableLongTextAnimation` | `boolean` | `false` | On hover, scroll a truncated option label horizontally so the full text can be read. |
| `disableIconAnimation` | `boolean` | `false` | Turn off the trigger chevron rotation when the list opens. |
| `disableKeyboardNavigation` | `boolean` | `false` | Same as SingleSelect: while **closed**, **↑/↓** do nothing and **Enter** / **Space** open the list without a highlighted row; while **open**, **↑/↓**, **Enter** and **Space** are ignored, so options are toggled with the mouse. **Tab** and **Escape** still work. The literal string `"true"` is treated as enabled. |
| `disableClickOutside` | `boolean` | `false` | When `true` (or string `"true"` from controls), clicks outside the trigger and portaled list do **not** close the list. Other values (including `"false"`) are treated as off so outside close still works. |
| `disableCloseOnTriggerClick` | `boolean` | `false` | Accepted but currently has **no effect**: clicking the trigger while the list is open always closes it. |
| `openOnFocus` | `boolean` | `false` | When `true`, **keyboard** focus on the trigger that matches `:focus-visible` opens the list (so Tab can open without a separate key; mouse focus alone typically does not). The literal string `"true"` is treated as enabled. |
| `icons` | `{ trigger?: ReactNode; badgeClose?: ReactNode; check?: ReactNode }` | - | `trigger` replaces the trigger chevron, `badgeClose` the badge remove icon, `check` the checkmark in a selected option's checkbox. |
| `styleOverrides` | `Record<string, string>` | - | Object mapping style slot names to class names. Plain object for plain CSS; or pass a CSS module directly. See [Styling](#styling-styleoverrides) and [Custom Style Overrides](../README.md#custom-style-overrides) in the main README. |

---

## Legacy Dropdown wrapper

For backward compatibility, a single **Dropdown** component can render either SingleSelect or MultiSelect:

```tsx
const [value, setValue] = useState<string | string[]>('');

<Dropdown
  variant="single"   // or "multiselect" | "filter"
  options={options}
  value={value}
  onChange={setValue}
  placeholder="Choose one"
/>
```

- `variant="single"` (default) → SingleSelect
- `variant="filter"` → SingleSelect with `filter={true}`
- `variant="multiselect"` → MultiSelect

The wrapper accepts only `className`, `options`, `value` (`string | string[]`), `onChange` (`(value: string | string[]) => void`), `disabled`, `variant`, `placeholder`, `maxDisplayBadges`, `portalContainer`, `floatingZIndex`, `maxVisibleOptions` and `openOnFocus`, and passes them through to the chosen component. The exported `DropdownProps` type is older and does not list `portalContainer`, `floatingZIndex` or `maxVisibleOptions`.

Prefer importing **SingleSelect** or **MultiSelect** directly for new code.

---

## Keyboard behavior (W3C-aligned listbox / combobox)

Behavior follows the common **select / listbox** keyboard matrix (closed trigger vs open list), aligned with guidance such as the [W3C ARIA Authoring Practices Guide patterns for combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) and listbox keyboard interaction.

DOM focus stays on the **trigger** (MultiSelect button or SingleSelect input) while the list is open; the highlighted row is **visual** focus only.

### Closed: focus on trigger

| Key | Behavior |
|-----|----------|
| **Tab** / **Shift+Tab** | Native tab order only; the list does **not** open (unless `openOnFocus` is set). |
| **↓** | Opens the list. Active option: SingleSelect, the **current value** if it appears in the list (in `filter` mode, the **filtered** list), otherwise the **first** option; MultiSelect, the **first selected** option in `options` order, otherwise the **first** option. |
| **↑** | Opens the list. Active option: the current value / first selected option as for **↓**, otherwise the **last** option. |
| **Enter** | Opens the list with the same active option rule as **↓**. SingleSelect `filter` with an **empty** input: clears the selection (`onChange("")`) instead of opening. |
| **Space** | Same as **Enter** (open only; no commit). |

With `disableKeyboardNavigation`, **↑/↓** do nothing here and **Enter** / **Space** open the list with no active option.

### Open: list visible

| Key | Behavior |
|-----|----------|
| **Tab** / **Shift+Tab** | **Closes** the list **without** changing the selection, then moves focus to the **next** / **previous** focusable control **outside** the portaled list (tab order: `tabIndex`, then document order). |
| **↓** / **↑** | Move the **active** (highlighted) option only; no commit. With no active option, **↓** goes to the first option and **↑** to the last (the first with `disableSelectionLooping`). At the ends the highlight wraps around unless `disableSelectionLooping` is set. Disabled options are not skipped. |
| **Enter** | **SingleSelect**: selects the active option (the first option if none is active), **closes** the list, focus returns to the input. **MultiSelect**: **toggles** the active option (the first option if none is active; disabled options are ignored) and **closes** the list. |
| **Space** | **SingleSelect**: same as **Enter**, **except** in `filter` mode with a non-empty query and no keyboard / hover row (only the typeahead highlight): **Space** is not intercepted so the user can type a space. **MultiSelect**: **toggles** the active option like **Enter** but **does not close** the list, so **Space** can toggle several rows; **Enter** toggles and closes. |
| **Escape** | Closes the list **without** changing the selection; focus remains on the trigger. **SingleSelect filter:** if the list is already closed and the query was cleared to empty while a value was still committed, **Escape** restores the committed label in the input (same as blur; does not call `onChange`). |

With `disableKeyboardNavigation`, **↑/↓**, **Enter** and **Space** are ignored while the list is open; **Tab** and **Escape** behave as above.

**Scrolling:** When the **keyboard** moves the active row, the list scrolls that row toward the **center** of the scrollable region. **Filter** typeahead highlighting of the first match does **not** scroll the list, so mouse-driven selection does not fight with `scrollIntoView`. **Mouse:** Moving the pointer over rows updates the highlight even while the list is scrolling (wheel or scrollbar); moving the mouse only exits "keyboard list" mode without clearing the row under the pointer.

**Left / Right** and **Home** / **End** are not handled by the list. In `filter` mode they keep their native caret behavior in the input.

### Filter mode (SingleSelect)

- **Display:** After choosing an option, the selected label appears in the input immediately (even before a controlled parent re-renders with the new `value`), so the field does not flash the placeholder until blur.
- **Reopen:** With **`openOnFocus={false}`** (default), focusing the input does **not** open the list even when the field shows the selected label as filter text (avoids reopening after a mouse pick when focus returns to the input). Set **`openOnFocus`** to open the list when the input gains focus and the query text is non-empty. The user can **backspace** or edit the text to widen or narrow results; typing always opens the list.
- **Clear / revert:** Backspacing until the query is **empty** shows the **placeholder** while focus stays in the field (the committed selection is unchanged until you confirm). The open list's **row highlight is cleared** (no active option) until you use **↑/↓** or **hover** again. **Enter** or **Space** with an empty query and **no** highlighted row **commits** clearing (`onChange("")`). **Blur** (tab away / click elsewhere), **Escape** (including when the list is already closed), or closing via **click outside** **discards** that edit and puts the **last committed selection's label** back in the input, unless you already cleared with Enter/Space. With the list **open**, an empty query, and a **keyboard- or mouse-highlighted** row (**↑/↓** or hover), **Enter** / **Space** commit that row instead of clearing.
- **Typing:** While the list is open and the query is non-empty, the **first** matching row is shown as highlighted (**typeahead**). Printable keys do not switch the control into "keyboard list" mode so **mouse hover** on rows still updates the highlight without scroll jank. No typeahead highlight is shown when `disableKeyboardNavigation` is set.
- **Keys:** When the list is open, **↑/↓**, **Tab**, **Escape**, **Enter**, and **Space** follow the same matrix as non-filter mode, with the **Space** exception above. With an **empty** query, **Enter** / **Space** clear the selection as under **Clear** above.

### Chevron button (SingleSelect)

The chevron beside the input (`role="button"`, `aria-label` "Open options" / "Close options") toggles the list on click and moves focus to the input. It has `tabIndex={-1}`, so it is not in the tab order; its **Enter** / **Space** toggle only applies if it is focused programmatically. Use the input for keyboard interaction.

---

## Styling (styleOverrides)

`styleOverrides` keys are merged with the default CSS module classes (both classes are applied). Slot names:

| Slots | Element |
|-------|---------|
| `singleSelect` / `multiSelect` | Root `<div>`. |
| `container` (SingleSelect) | Wrapper around the input and chevron. |
| `triggerBase`, `trigger` | SingleSelect `<input>` / MultiSelect trigger `<button>`. |
| `triggerIcon`, `triggerIconTransition` | Trigger chevron (or custom `icons.trigger` wrapper) and its rotation. `triggerIcon` also styles the list footer chevron. |
| `triggerIconButton` (SingleSelect) | Chevron button next to the input. |
| `triggerContent`, `triggerContentWrap`, `triggerContentNoWrap` (MultiSelect) | Badge area inside the trigger (`wrapBadges` picks Wrap / NoWrap). |
| `badge`, `badgeText`, `badgeRemove`, `badgeRemoveIcon`, `remainingBadge`, `placeholder` (MultiSelect) | Badges, remove icon, `+N` badge, placeholder text. |
| `popup` | Portaled listbox (`role="listbox"`). |
| `header`, `headerText` (MultiSelect) | "`N` selected" header. |
| `scrollContent` | Scrollable options area. |
| `itemBase`, `itemHover`, `itemFocused`, `itemDisabled` | Option row `<button>`: base, hover (mouse mode), highlighted, disabled. |
| `itemRightAlign` (MultiSelect) | Option row when `rightAlignCheckboxes` is set. |
| `itemContent`, `itemContentText`, `itemText`, `itemContentEllipsisIndicator` | Label wrapper, label text, `..` indicator. |
| `highlightedText` (SingleSelect) | Matched substring in `filter` mode. |
| `checkbox`, `checkboxRightAlign`, `checkboxIconWrapper`, `checkboxIcon` (MultiSelect) | Option checkbox. |
| `footer` | Chevron footer strip of the list. |
| `noResults`, `footerGroup`, `footerIcon`, `footerIconAnimate` (SingleSelect) | "No options found" popup and its footer. |

`itemFocused`, `itemDisabled` and `itemText` have no default rule; the default highlight and disabled styles use `.itemBase[data-focused="true"]` and `.itemBase[data-disabled="true"]`. When overriding a rule that uses a data attribute, keep the attribute in your selector (see [Data attributes](data-attributes.md#customising-with-styleoverrides)).

## Data attributes

The dropdowns set no `data-testid`; a `data-testid` you pass goes on the root `<div>`. State attributes (`data-state`, `data-disabled`, `data-variant`, `data-position`, `data-focused`, `data-checked`, `data-scrollable`) are listed in [Data attributes](data-attributes.md).

## Accessibility

The components have no `id` or label prop for the input / trigger, and `aria-*` attributes you pass land on the root `<div>`, so render a visible text label next to the control (especially in filter mode). The portaled popup has `role="listbox"` and is marked `data-ipa-ui-dropdown-floating="true"` for focus management; option rows are `<button>` elements.
