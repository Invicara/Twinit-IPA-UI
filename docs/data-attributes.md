# Standard data attributes for UI components

Components use a consistent set of data attributes for styling and inspectability. Style via CSS selectors (e.g. `.button[data-variant="danger"]`) instead of applying variant/size classes from JS.

Not every component uses every attribute; only those that are relevant.

| Attribute           | Values / type   | When to use |
|---------------------|-----------------|-------------|
| **data-testid**     | `ipa_*` string  | Fixed test selector on the main element of most components (see the list below). Passing your own `data-testid` prop overrides it on components that spread props onto that element. |
| **data-state**      | string          | Semantic state (e.g. `"open"`, `"closed"`, `"checked"`, `"unchecked"`, `"selected"`, `"error"`, `"default"`). Use for state that drives many styles or comes from a controlled/uncontrolled value. |
| **data-variant**    | string          | Visual or behavioural variant (e.g. `"default"`, `"danger"`, `"secondary"`, `"filter"`). Use when the component has multiple appearance or behaviour modes. |
| **data-size**       | string          | Size preset (e.g. `"default"`, `"sm"`, `"icon"`). Use when the component has discrete size options. |
| **data-disabled**   | `"true"` \| `"false"` | Disabled state. Use in addition to or instead of the native `disabled` attribute so styling works when the root is not a form element (e.g. when using `asChild` with a non-button). SingleSelect / MultiSelect set `"true"` or omit the attribute. |
| **data-orientation**| `"horizontal"` \| `"vertical"` | Layout direction. Use for components that can be laid out horizontally or vertically. |
| **data-position**   | `"top"` \| `"bottom"` | Resolved side of a floating popup after collision handling. |
| **data-scrollable** | `"true"` | Whether the element has scrollable overflow. Use when the same element can be scrollable or not. |
| **data-focused**    | `"true"` | Option/item has keyboard or hover focus. Use for list option highlight styling. |
| **data-checked**    | `"true"` | Selected/checked state. Use for checkbox-like or selected-item styling. |

## Components and their attributes

Radix-based components also carry Radix's own attributes (e.g. `data-state`, `data-side`, `data-align`, `data-highlighted`); only the ones ipa-ui sets or documents are listed.

- **Button**: `data-testid="ipa_button"`, `data-variant` (default | danger | secondary | tertiary), `data-size` (default | sm | icon), `data-disabled`
- **Badge**: `data-testid="ipa_badge"`, `data-variant` (default | secondary | outline)
- **Link**: `data-testid="ipa_link"`, `data-variant` (default | inline), `data-disabled` (`"true"` also when `href` is missing)
- **Input**: root, label, `<input>` / `<textarea>` and helper text carry `data-state` (default | error | success | warning | readonly); the field also has `data-testid="ipa_input"`, `data-size` (default | sm | lg) and `data-disabled`; root has `data-fit-content="true"` when `fitContent` is set; the clear button has `data-testid="ipa_input_clear"` and `data-size`
- **Checkbox** (Radix): `data-testid="ipa_checkbox"`, `data-state` (checked | unchecked | indeterminate), `data-disabled`
- **RadioGroup**: `data-testid="ipa_radio_group"` and `data-orientation` (horizontal | vertical) on the group; `data-disabled` on the outer container and on each item wrapper
- **Dialog**: `data-size` (sm | default | lg | xl | full) on content; overlay has `data-testid="ipa_dialog_overlay"`; Radix sets `data-state` on overlay/content (open | closed)
- **Accordion** (Radix): `data-testid="ipa_accordion"` on the root; `data-state` on items/triggers (open | closed)
- **Breadcrumb**: `data-testid="ipa_breadcrumb"` on the `<nav>`
- **Separator**: `data-testid="ipa_separator"`, `data-orientation` (horizontal | vertical)
- **Slider**: `data-disabled` on the wrapper and on the Radix root; the root also has `data-testid="ipa_slider"` and `data-range="true"` in range mode
- **Popover**: content has `data-testid="ipa_popover_content"` (Radix sets `data-side`, used for `stickPlacement`)
- **DropdownMenu**: `data-testid` `ipa_dropdown_menu_content`, `ipa_dropdown_menu_item`, `ipa_dropdown_menu_checkbox_item`, `ipa_dropdown_menu_separator`
- **Command**: `data-testid` `ipa_command`, `ipa_command_input`, `ipa_command_list`, `ipa_command_empty`, `ipa_command_item`
- **Calendar**: `data-testid="ipa_calendar"`; root has `data-slot="calendar"`; each day button has `data-testid="ipa_calendar_day"`, `data-day` (the date as `toLocaleDateString()`), and `"true"` / `"false"` flags `data-selected-single`, `data-range-start`, `data-range-end`, `data-range-middle`, `data-outside`, `data-focused`, `data-today`, `data-disabled`
- **DatePicker / DateRangePicker**: trigger button has `data-testid` `ipa_date_picker_trigger` / `ipa_date_range_picker_trigger` (change with `triggerTestId`) and `data-empty` (`"true"` when no value); relative-date preset buttons have `data-active="true"` when their range is selected
- **SingleSelect / MultiSelect**: no `data-testid` (a `data-testid` you pass goes on the root); `data-state` (open | closed) on root and on trigger (MultiSelect trigger button); `data-disabled` on root, trigger (SingleSelect input / MultiSelect button), and option buttons; `data-variant` (filter) on SingleSelect root when filter is enabled; the portaled listbox popup has `data-ipa-ui-dropdown-floating="true"` and `data-position` (top | bottom) for the **resolved** vertical side after [Floating UI](https://floating-ui.com) flip (`popAbove` only sets preferred placement); scroll content uses `data-scrollable` (true) and `data-block-arrow-keys` (true) when `disableKeyboardNavigation` is set; option row uses `data-focused` (true) when highlighted; MultiSelect checkbox wrapper uses `data-checked` (true) when the option is selected
- **Table**: `data-testid` on the parts: `ipa_table` (chrome shell), `ipa_table_status` (live region), `ipa_table_root_wrapper`, `ipa_table_root`, `ipa_table_header`, `ipa_table_body`, `ipa_table_footer`, `ipa_table_caption`, `ipa_table_row`, `ipa_table_head_cell`, `ipa_table_body_cell`, `ipa_table_column_header`, `ipa_table_draggable_head_cell`, `ipa_table_column_resize_handle`, `ipa_table_selection_cell_inner`, `ipa_table_toolbar`, `ipa_table_pagination`, `ipa_table_skeleton`, `ipa_table_fetching`. State: body rows `data-state="selected"` when selected; resize handle `data-resizing` (`"true"` | `"false"`); checkbox filter option indicator `data-state` (checked | unchecked); sort list field trigger `data-state` (open | closed); rating filter stars `data-filled="true"`

## Usage in CSS

```css
.root[data-variant="danger"] { ... }
.root[data-size="sm"] { ... }
.root[data-disabled="true"] { ... }
.root:not([data-disabled="true"]):hover { ... }
```

## Usage in tests

Assert on attributes for behaviour and styling:

```ts
expect(button).toHaveAttribute("data-variant", "danger")
expect(button).toHaveAttribute("data-disabled", "true")
```

---

## Customising with styleOverrides

Components like **SingleSelect** and **MultiSelect** accept **`styleOverrides`**: an object whose **keys** are the component’s style slot names (the same names used internally, e.g. `s.scrollContent`, `s.trigger`) and whose **values** are the class names to apply to those elements.

- **Plain CSS**: You provide this object yourself (e.g. `{ scrollContent: "scrollContent", trigger: "trigger" }`) and load your `.css` file. No CSS modules required.
- **CSS modules**: You can pass your override **CSS module** directly; its export has the same shape (keys = selector names, values = hashed class names), so you skip writing the mapping object.

For the full guide (plain CSS first, then CSS modules, and how the mapping relates to `s.xyz`), see [Custom Style Overrides](../README.md#custom-style-overrides) in the main README. For the convention on loading your override CSS (import last), see the same README section.

### Copy the default selector, then change values

1. Find the default rule in the component’s CSS (e.g. `multi-select.module.css`, `dropdown-base.module.css`).
2. In your override module, use the **same selector** (same class names, same attribute selectors like `[data-checked="true"]`).
3. Change only the property values.

### Specificity when the default uses data attributes

If the default selector includes a **data attribute** (e.g. `.checkboxIconWrapper[data-checked="true"]`), your override selector **must include that same attribute**. If you omit it, your rule has **lower specificity** and the default will win.

**Good** – mirror the default (same structure, same attribute):

```css
.checkboxIconWrapper[data-checked="true"] {
  background-color: #ea580c;
}
```

**Bad** – selector not specific enough; default wins:

```css
.checkboxIconWrapper {
  background-color: #ea580c;  /* ignored */
}
```

### Summary

- **Make sure your rule wins the cascade**: import your override CSS after ipa-ui, or raise its specificity when your build extracts CSS to a stylesheet (see [Override convention](../README.md#override-convention-make-your-rule-win-the-cascade) in the README).
- **Copy** the default selector structure (including any `[data-...]`) into your override.
- **Match** the default’s specificity when it uses data attributes; otherwise your override can be invisible.

---

## Other candidates for data-* refactor

Components not yet using the full standard set (refactors completed for Link, RadioGroup, Checkbox, Input, Dialog):

| Component    | Status | Notes |
|-------------|--------|--------|
| **Slider**  | Uses `data-disabled`, `data-range` | No variant/size; optional `data-orientation` if horizontal/vertical is added. |
| **Breadcrumb** | Only `data-testid` | Low priority; could add `data-disabled` on links if needed. |
| **Accordion** | Uses Radix `data-state` | No change needed unless we add a variant. |
