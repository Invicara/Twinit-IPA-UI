# Standard data attributes for UI components

Components use a consistent set of data attributes for styling and inspectability. Style via CSS selectors (e.g. `.button[data-variant="danger"]`) instead of applying variant/size classes from JS.

Not every component uses every attribute; only those that are relevant.

| Attribute           | Values / type   | When to use |
|---------------------|-----------------|-------------|
| **data-state**      | string          | Semantic state (e.g. `"open"`, `"closed"`, `"checked"`, `"error"`, `"default"`). Use for state that drives many styles or comes from a controlled/uncontrolled value. |
| **data-variant**    | string          | Visual or behavioural variant (e.g. `"default"`, `"danger"`, `"secondary"`, `"filter"`). Use when the component has multiple appearance or behaviour modes. |
| **data-size**       | string          | Size preset (e.g. `"default"`, `"sm"`, `"icon"`). Use when the component has discrete size options. |
| **data-disabled**   | `"true"` \| `"false"` | Disabled state. Use in addition to or instead of the native `disabled` attribute so styling works when the root is not a form element (e.g. when using `asChild` with a non-button). |
| **data-orientation**| `"horizontal"` \| `"vertical"` | Layout direction. Use for components that can be laid out horizontally or vertically. |
| **data-scrollable** | `"true"` | Whether the element has scrollable overflow. Use when the same element can be scrollable or not. |
| **data-focused**    | `"true"` | Option/item has keyboard or hover focus. Use for list option highlight styling. |
| **data-checked**    | `"true"` | Selected/checked state. Use for checkbox-like or selected-item styling. |

## Components and their attributes

- **Button**: `data-variant`, `data-size`, `data-disabled`
- **Link**: `data-variant` (default | inline), `data-disabled`
- **Input**: `data-state` (default | error | success | warning | readonly), `data-disabled`
- **Checkbox** (Radix): `data-state` (checked | unchecked | indeterminate), `data-disabled`
- **RadioGroup**: `data-orientation` (horizontal | vertical), `data-disabled` (on container and item wrapper)
- **Dialog**: `data-size` (sm | default | lg | xl | full); Radix sets `data-state` on overlay/content (open | closed)
- **Accordion** (Radix): `data-state` on items/triggers (open | closed)
- **Slider** (Radix root): `data-disabled`
- **SingleSelect / MultiSelect**: `data-state` (open | closed) on root and on trigger (MultiSelect trigger button); `data-disabled` on root, trigger, and option buttons; `data-position` (top | bottom) on popup for popAbove; `data-variant` (filter) on SingleSelect root when filter is enabled; scroll content uses `data-scrollable` (true); option row uses `data-focused` (true) when focused; MultiSelect checkbox wrapper uses `data-checked` (true) when the option is selected

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

- **Import your override CSS last** so it wins over the default (see [Custom Style Overrides](../README.md#custom-style-overrides) in the README).
- **Copy** the default selector structure (including any `[data-...]`) into your override.
- **Match** the default’s specificity when it uses data attributes; otherwise your override can be invisible.

---

## Other candidates for data-* refactor

Components not yet using the full standard set (refactors completed for Link, RadioGroup, Checkbox, Input, Dialog):

| Component    | Status | Notes |
|-------------|--------|--------|
| **Slider**  | Uses `data-disabled` | No variant/size; optional `data-orientation` if horizontal/vertical is added. |
| **Breadcrumb** | Not refactored | Low priority; could add `data-disabled` on links if needed. |
| **Accordion** | Uses Radix `data-state` | No change needed unless we add a variant. |
