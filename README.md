# Twinit-IPA-UI

A React component library implementing Invicara's design system with TypeScript support.

Follows [semantic versioning](https://semver.org): breaking changes ship only in major versions. Peer dependencies: `react` and `react-dom` ^18.2.0, and `@tanstack/react-table` ^8.

## Table of contents

- [Quick Start](#quick-start)
- [Component documentation](#component-documentation)
- [Component Architecture](#component-architecture)
- [Component Variants](#component-variants)
- [Composed Components](#composed-components)
- [Custom Style Overrides](#custom-style-overrides)
- [Theming and Portals](#theming-and-portals)
- [Common Patterns](#common-patterns)

## Quick Start

### Installation

```bash
npm install @dtplatform/ipa-ui @tanstack/react-table@^8
```

Your app must already have `react` and `react-dom` ^18.2.0. Everything else ipa-ui uses (Radix UI, `cmdk`, `react-day-picker`, `date-fns`, `lucide-react`, Floating UI) is bundled into the package build, so you do not install it. If you want Lucide icons in your own code, add `lucide-react` to your app yourself. No CSS import is needed (see [CSS loading](#css-loading)).

### Basic Usage

```tsx
import { Button } from '@dtplatform/ipa-ui';

function App() {
  return (
    <Button variant="default" size="default">
      Click Me
    </Button>
  );
}
```

## Component documentation

Implementation guides for each component are in the [`docs/`](docs/) folder:

| Component | Doc |
|-----------|-----|
| [Accordion](docs/accordion.md) | `docs/accordion.md` |
| [Badge](docs/badge.md) | `docs/badge.md` |
| [Breadcrumb](docs/breadcrumb.md) | `docs/breadcrumb.md` |
| [Button](docs/button.md) | `docs/button.md` |
| [Calendar (Calendar / DatePicker / DateRangePicker)](docs/calendar.md) | `docs/calendar.md` |
| [Checkbox](docs/checkbox.md) | `docs/checkbox.md` |
| [Command](docs/command.md) | `docs/command.md` |
| [Dialog](docs/dialog.md) | `docs/dialog.md` |
| [Dropdown (SingleSelect / MultiSelect / Dropdown)](docs/dropdown.md) | `docs/dropdown.md` |
| [DropdownMenu](docs/dropdown-menu.md) | `docs/dropdown-menu.md` |
| [Input](docs/input.md) | `docs/input.md` |
| [Link](docs/link.md) | `docs/link.md` |
| [Popover](docs/popover.md) | `docs/popover.md` |
| [RadioGroup](docs/radio-group.md) | `docs/radio-group.md` |
| [Separator](docs/separator.md) | `docs/separator.md` |
| [Slider](docs/slider.md) | `docs/slider.md` |
| [Table](docs/table.md) | `docs/table.md` |
| [Icons](docs/icons.md) | `docs/icons.md` |
| [Data attributes](docs/data-attributes.md) | `docs/data-attributes.md` |

**For contributors:** see [docs/external/](docs/external/). **For internal team:** release flow, publishing, and implementation details are in [docs/internal/](docs/internal/).

## Component Architecture

Every component is styled with **CSS modules** and the theme's **CSS custom properties** (see [Theming](#theme-wrapper-data-themeinvicara)). There is no Tailwind and no utility-class API: pass your own classes, not Tailwind classes.

- **Variants and sizes** are props (e.g. `variant`, `size`) that the component also exposes as data attributes (`data-variant`, `data-size`, `data-state`, ...). See [Data attributes](docs/data-attributes.md).
- **`className`** adds classes to the component's main element.
- **`styleOverrides`** adds classes to named inner parts ("slots"). Every component family accepts it. Single-element components (and `DatePicker` / `DateRangePicker`) take it on the component itself; `Accordion` and `Breadcrumb` take it on the root, which passes it to their subcomponents (`Table` does the same for most of its parts, see [Table](docs/table.md)); `Command`, `DropdownMenu` and `Popover` take it on individual parts such as `CommandItem`, `DropdownMenuContent` or `PopoverContent` (see each doc). See [Custom Style Overrides](#custom-style-overrides).

**Example:**
```tsx
import { Button, MultiSelect } from '@dtplatform/ipa-ui';
import myOverrides from './my-dropdown-overrides.module.css';  // or a plain object + .css file

<Button variant="danger" size="sm" className="my-button">Delete</Button>

<MultiSelect
  options={options}
  value={value}
  onChange={setValue}
  styleOverrides={myOverrides}
/>
```

Component docs (e.g. [Dropdown](docs/dropdown.md)) list the available slot names and props.

## Component Variants

Some components are broken down into multiple variants that share a common base:

### Dropdown Component

The dropdown functionality is split into two variants:

- **`SingleSelect`** – Single selection with optional search/filter
- **`MultiSelect`** – Multiple selection with checkboxes and badges

**Usage:**
```tsx
import { SingleSelect, MultiSelect } from '@dtplatform/ipa-ui';

// Single select
<SingleSelect
  options={options}
  value={selected}
  onChange={setSelected}
  filter={true}  // Enable search
/>

// Multi select
<MultiSelect
  options={options}
  value={selectedArray}
  onChange={setSelectedArray}
  maxDisplayBadges={2}
/>
```

## Composed Components

Some components can contain other components:

### Dialog Component

The `Dialog` component can contain `Button` components in its footer:

```tsx
<Dialog
  title="Confirm Action"
  footer={
    <>
      <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
      <Button variant="danger" onClick={handleConfirm}>Delete</Button>
    </>
  }
>
  Are you sure you want to delete this item?
</Dialog>
```

The dialog also supports an `acknowledgment` prop that automatically generates an "OK" button:

```tsx
<Dialog
  title="Success"
  acknowledgment={true}
>
  Your changes have been saved.
</Dialog>
```

## Custom Style Overrides

Components expose a **`styleOverrides`** prop that lets you theme inner parts by passing an object that maps **style slot names** to **class names**. Each key is the name of a slot (the same names used internally on the component, e.g. `s.trigger`, `s.scrollContent`, `s.popup`); each value is the class name string to apply to that element, in addition to the default class. You can use **plain CSS** (no CSS modules) or **CSS modules** (pass the module directly and skip the mapping object). The convention below applies to all such components.

### Plain CSS (no CSS modules required)

Use a normal `.css` file and an object that maps each style slot to your class name. The object keys must match the component’s slot names; the values are the class names you use in your CSS.

1. **Write your CSS** with the class names you want (for a 1:1 setup, use the same names as the slots):

```css
/* my-dropdown-overrides.css */
.trigger {
  border-radius: 0;
  width: 360px;
}
.scrollContent {
  cursor: copy;
}
.checkboxIconWrapper {
  border-radius: 50%;
}
```

2. **Define the mapping object**: keys = slot names (same as `s.xyz` in the component), values = the class names in your CSS:

```ts
const myOverrides = {
  trigger: "trigger",
  scrollContent: "scrollContent",
  checkboxIconWrapper: "checkboxIconWrapper",
  // only the slots you override
};
```

3. **Load your CSS file** (import it so it’s in the bundle), then pass the object. Make sure your rules win the cascade (see [the convention below](#override-convention-make-your-rule-win-the-cascade)):

```tsx
import { MultiSelect } from '@dtplatform/ipa-ui';
import './my-dropdown-overrides.css';  // load override CSS (see convention below)

const myOverrides = { trigger: "trigger", ... };  // from step 2

<MultiSelect styleOverrides={myOverrides} options={...} value={...} onChange={...} />
```

No CSS modules are required; the mapping object tells the component which class to apply to each element (`s.trigger`, `s.scrollContent`, etc.).

### CSS modules (skip the mapping object)

If your project uses CSS modules, you can pass your override **module** directly. The build produces an object whose keys are the selector names and whose values are the hashed class names, so the keys already match the component’s slot names, and you skip writing the mapping object. The same load-order convention applies (see below):

```tsx
import { MultiSelect } from '@dtplatform/ipa-ui';
import myOverrides from './my-dropdown-overrides.module.css';

<MultiSelect styleOverrides={myOverrides} options={...} value={...} onChange={...} />
```

### Override convention: make your rule win the cascade

Your override class is applied next to the default class on the same element, so both rules have the same specificity and **the one that appears later in the document wins**.

ipa-ui injects its CSS (theme tokens and every component's CSS module) as `<style>` tags appended to `document.head` when the package is first imported. So:

- If your bundler also injects your CSS at import time (e.g. webpack `style-loader`, Vite in dev), **import your override file after `@dtplatform/ipa-ui`**:

  ```ts
  // e.g. main.tsx or index.tsx
  import { MultiSelect } from '@dtplatform/ipa-ui';
  // ... other imports
  import './style-overrides.css'; // last, so its <style> comes after ipa-ui's
  ```

- If your build extracts CSS into a `<link>` stylesheet (typical production builds), that stylesheet is in the page before ipa-ui's injected `<style>` tags, so equal-specificity overrides lose. **Raise specificity** instead, e.g. `.trigger.trigger { ... }`, or `[data-theme="invicara"] .trigger { ... }` when you use the [theme wrapper](#theme-wrapper-data-themeinvicara).

For component-specific slot names and data-attribute selectors (e.g. `[data-checked="true"]`), see the component docs (e.g. [Dropdown](docs/dropdown.md)) and [Data attributes](docs/data-attributes.md#customising-with-styleoverrides).

## Theming and Portals

### Theme wrapper (`data-theme="invicara"`)

ipa-ui ships with an `invicara` design theme based on CSS custom properties. The theme is defined in **[`src/styles/globals.css`](src/styles/globals.css)** (compiled to `dist/output.css` in the package); open either file to see the full set of variables. It defines **global variables** for colours and other tokens that components use via `var(--...)`. Main palettes include **brand** (`--brand-1` … `--brand-10`), **neutral** (`--neutral-0` … `--neutral-10`), and semantic sets such as **alert**, **warning**, **positive**, and **blue**. To rebrand or change the palette, override these variables (e.g. in your own stylesheet or under a wrapper) by copy-pasting the same variable names from `globals.css` and setting your own values; components will pick them up automatically.

The variables are declared on both `:root` and `[data-theme="invicara"]`. Wrapping the part of your app that uses ipa-ui in a `data-theme="invicara"` container re-declares them there, so a host stylesheet that redefines the same names on `:root` (e.g. `--primary`, `--border`) does not leak into ipa-ui components:

```tsx
const root = createRoot(document.getElementById('root')!);

root.render(
  <div data-theme="invicara">
    <App />
  </div>
);
```

All ipa-ui components rendered under this wrapper resolve their theme variables (colors, radii, etc.) from the `invicara` theme.

### Portal container (`#ipa-ui-modal-root`)

Overlays render through React portals: `Dialog`, `PopoverContent` (also used by `DatePicker` / `DateRangePicker` and the Table filters), `DropdownMenuContent`, and the `SingleSelect` / `MultiSelect` listbox. A portal into `document.body` sits outside your theme wrapper and can pick up the wrong CSS variables.

To keep them inside the theme wrapper, add a dedicated modal root **inside** it:

```tsx
root.render(
  <div data-theme="invicara">
    <div id="ipa-ui-modal-root" />
    <App />
  </div>
);
```

Each of these components then portals into:

1. the element you pass explicitly (`container` on `Dialog`, `PopoverContent` and `DropdownMenuContent`; `portalContainer` on `SingleSelect` / `MultiSelect`), otherwise
2. `document.getElementById('ipa-ui-modal-root')` when that element exists, otherwise
3. `document.body`.

```tsx
<Dialog
  title="My Dialog"
  open={open}
  onOpenChange={setOpen}
  container={document.getElementById('ipa-ui-modal-root')}
>
  ...
</Dialog>
```

### CSS loading

ipa-ui's CSS ships inside its JavaScript. Importing anything from `@dtplatform/ipa-ui` injects the theme tokens, base styles and every component's CSS module as `<style>` tags in `document.head`. **You do not need to import a CSS file**, and no Tailwind setup or config is involved.

The base styles are global: they load the Inter font from Google Fonts, set `box-sizing: border-box` and a default `border-color` on all elements, a `:focus-visible` outline, and `margin`, background, text color and font on `body`. Override them in your own CSS if they conflict with your app.

`dist/output.css` (the package's `style` field) contains only the theme tokens and base styles, not the component styles. Importing it is optional (e.g. `@import '@dtplatform/ipa-ui/dist/output.css';`, or with `~` for older webpack Sass setups); it does not change how component styles load.

### Using ipa-ui via `@dtplatform/ipa-core`

If you consume ipa-ui indirectly through `@dtplatform/ipa-core` and use `IpaMainLayout`:

- `IpaMainLayout` already:
  - wraps the application in `<div data-theme="invicara">…</div>`
  - includes `<div id="ipa-ui-modal-root" />` inside that wrapper
- You generally **don’t need to add your own theme or modal wrappers** for core-driven screens; they’re provided by the layout.

## Common Patterns

### Controlled Components

Most components support controlled usage:

```tsx
const [value, setValue] = useState('');

<SingleSelect
  value={value}
  onChange={setValue}
  options={options}
/>
```

### Uncontrolled Components

Components that expose Radix root props (e.g. `Accordion`, `Popover`, `DropdownMenu`) also work uncontrolled with `defaultValue` / `defaultOpen`:

```tsx
<Accordion type="single" collapsible defaultValue="item-1">
  {/* ... */}
</Accordion>
```

### Accessibility

Components built on Radix UI primitives (Accordion, Checkbox, Dialog, DropdownMenu, Popover, RadioGroup, Separator, Slider) and on `cmdk` (Command) inherit their focus management, keyboard navigation and ARIA attributes. All focusable elements get a visible `:focus-visible` outline from the base styles. See each component doc for its accessibility notes.

