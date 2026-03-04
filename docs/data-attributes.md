# Standard data attributes for UI components

Components use a consistent set of data attributes for styling and inspectability. Style via CSS selectors (e.g. `.button[data-variant="danger"]`) instead of applying variant/size classes from JS.

Not every component uses every attribute; only those that are relevant.

| Attribute           | Values / type   | When to use |
|---------------------|-----------------|-------------|
| **data-state**      | string          | Semantic state (e.g. `"open"`, `"closed"`, `"checked"`, `"error"`, `"default"`). Use for state that drives many styles or comes from a controlled/uncontrolled value. |
| **data-variant**    | string          | Visual variant (e.g. `"default"`, `"danger"`, `"secondary"`). Use when the component has multiple appearance variants. |
| **data-size**       | string          | Size preset (e.g. `"default"`, `"sm"`, `"icon"`). Use when the component has discrete size options. |
| **data-disabled**   | `"true"` \| `"false"` | Disabled state. Use in addition to or instead of the native `disabled` attribute so styling works when the root is not a form element (e.g. when using `asChild` with a non-button). |
| **data-orientation**| `"horizontal"` \| `"vertical"` | Layout direction. Use for components that can be laid out horizontally or vertically. |

## Components and their attributes

- **Button**: `data-variant`, `data-size`, `data-disabled`
- **Link**: `data-variant` (default | inline), `data-disabled`
- **Input**: `data-state` (default | error | success | warning | readonly), `data-disabled`
- **Checkbox** (Radix): `data-state` (checked | unchecked | indeterminate), `data-disabled`
- **RadioGroup**: `data-orientation` (horizontal | vertical), `data-disabled` (on container and item wrapper)
- **Dialog**: `data-size` (sm | default | lg | xl | full); Radix sets `data-state` on overlay/content (open | closed)
- **Accordion** (Radix): `data-state` on items/triggers (open | closed)
- **Slider** (Radix root): `data-disabled`

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

## Other candidates for data-* refactor

Components not yet using the full standard set (refactors completed for Link, RadioGroup, Checkbox, Input, Dialog):

| Component    | Status | Notes |
|-------------|--------|--------|
| **Slider**  | Uses `data-disabled` | No variant/size; optional `data-orientation` if horizontal/vertical is added. |
| **Breadcrumb** | Not refactored | Low priority; could add `data-disabled` on links if needed. |
| **Accordion** | Uses Radix `data-state` | No change needed unless we add a variant. |
