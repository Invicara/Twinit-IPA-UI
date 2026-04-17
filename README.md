# Twinit-IPA-UI

A React component library implementing Invicara's design system with TypeScript support.

> **BETA disclaimer:** This library is currently in **BETA**. Integrators should expect **breaking changes** to the component API as the library evolves. Use at your own risk.

## Table of contents

- [Quick Start](#quick-start)
- [Component documentation](#component-documentation)
- [Component Architecture](#component-architecture)
- [Component Variants](#component-variants)
- [Composed Components](#composed-components)
- [Custom Style Overrides](#custom-style-overrides)
- [Theming and Dialog Portals](#theming-and-dialog-portals)
- [Common Patterns](#common-patterns)

## Quick Start

### Installation

```bash
npm install @dtplatform/ipa-ui
```

### Basic Usage

```tsx
import { Button, Dialog, SingleSelect, Input } from '@dtplatform/ipa-ui';

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
| [Breadcrumb](docs/breadcrumb.md) | `docs/breadcrumb.md` |
| [Button](docs/button.md) | `docs/button.md` |
| [Checkbox](docs/checkbox.md) | `docs/checkbox.md` |
| [Dialog](docs/dialog.md) | `docs/dialog.md` |
| [Dropdown (SingleSelect / MultiSelect)](docs/dropdown.md) | `docs/dropdown.md` |
| [Input](docs/input.md) | `docs/input.md` |
| [Link](docs/link.md) | `docs/link.md` |
| [RadioGroup](docs/radio-group.md) | `docs/radio-group.md` |
| [Slider](docs/slider.md) | `docs/slider.md` |
| [Icons (XIcon)](docs/icons.md) | `docs/icons.md` |

**For contributors:** see [docs/external/](docs/external/). **For internal team:** release flow, publishing, and implementation details are in [docs/internal/](docs/internal/).

## Component Architecture

This library uses two distinct styling patterns based on component complexity:

### 1. Simple Components (CVA Pattern)

**Components:** `Button`, `Input`, `Checkbox`, `RadioGroup`, `Slider`, `Link`

Simple components use **Class Variance Authority (CVA)** for variant-based styling. These components have a limited set of predefined variants and sizes.

**Example:**
```tsx
<Button variant="default" size="sm" className="custom-class">
  Click Me
</Button>
```

**Customization:**
- Use `variant` prop for style variants (e.g., `default`, `danger`, `secondary`, `tertiary`)
- Use `size` prop for size variants (e.g., `default`, `sm`, `icon`)
- Use `className` prop to add additional Tailwind classes that merge with the base styles

### 2. Complex Components (styleOverrides)

**Components:** `Dropdown` (SingleSelect/MultiSelect); others (e.g. `Dialog`, `Accordion`, `Breadcrumb`) will follow.

Complex components expose a **`styleOverrides`** prop: an object that maps style slot names (e.g. `trigger`, `popup`, `scrollContent`) to class names. Use plain CSS or a CSS module; see [Custom Style Overrides](#custom-style-overrides) for the full guide.

**Example (Dropdown):**
```tsx
import { MultiSelect } from '@dtplatform/ipa-ui';
import myOverrides from './my-dropdown-overrides.module.css';  // or use a plain object + .css file

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

Components that expose a **`styleOverrides`** prop (e.g. **SingleSelect**, **MultiSelect**; others will follow) let you theme inner parts by passing an object that maps **style slot names** to **class names**. Each key is the name of a slot (the same names used internally on the component, e.g. `s.trigger`, `s.scrollContent`, `s.popup`); each value is the class name string to apply to that element. You can use **plain CSS** (no CSS modules) or **CSS modules** (pass the module directly and skip the mapping object). The convention below applies to all such components.

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
  // … only the slots you override
};
```

3. **Load your CSS file** (import it so it’s in the bundle), then pass the object. Prefer **importing your override file last** in your app entry so your overrides win (see convention below):

```tsx
import { MultiSelect } from '@dtplatform/ipa-ui';
import './my-dropdown-overrides.css';  // load override CSS (import last – see convention below)

const myOverrides = { trigger: "trigger", ... };  // from step 2

<MultiSelect styleOverrides={myOverrides} options={...} value={...} onChange={...} />
```

No CSS modules are required; the mapping object tells the component which class to apply to each element (`s.trigger`, `s.scrollContent`, etc.).

### CSS modules (skip the mapping object)

If your project uses CSS modules, you can pass your override **module** directly. The build produces an object whose keys are the selector names and whose values are the hashed class names—so the keys already match the component’s slot names, and you skip writing the mapping object. Import your override CSS last so it wins (see convention below):

```tsx
import { MultiSelect } from '@dtplatform/ipa-ui';
import myOverrides from './my-dropdown-overrides.module.css';

<MultiSelect styleOverrides={myOverrides} options={...} value={...} onChange={...} />
```

### Override convention: import your override file last

For your overrides to win over the library defaults, **your override CSS must appear after the component’s CSS** in the final bundle. **Import your override file last** in your app entry (or in a dedicated file that you import last):

```ts
// e.g. main.tsx or index.tsx
import './app.css';
import { MultiSelect } from '@dtplatform/ipa-ui';
// ... other imports and app code

// Last: import overrides so their CSS is emitted after the library’s
import './style-overrides';
```

If your override file is not loaded last, default and override rules can have the same specificity and the one that appears later wins—which may be the default.

For component-specific slot names and data-attribute selectors (e.g. `[data-checked="true"]`), see the component docs (e.g. [Dropdown](docs/dropdown.md)) and [Data attributes](docs/data-attributes.md#customising-with-styleoverrides).

## Theming and Dialog Portals

### Theme wrapper (`data-theme="invicara"`)

ipa-ui ships with an `invicara` design theme based on CSS custom properties. The theme is defined in **[`src/styles/globals.css`](src/styles/globals.css)** — you can open that file to see the full set of variables. It defines **global variables** for colours and other tokens that components use via `var(--...)`. Main palettes include **brand** (`--brand-1` … `--brand-10`), **neutral** (`--neutral-0` … `--neutral-10`), and semantic sets such as **alert**, **warning**, **positive**, and **blue**. To rebrand or change the palette, override these variables (e.g. in your own stylesheet or under a wrapper) by copy-pasting the same variable names from `globals.css` and setting your own values; components will pick them up automatically.

To ensure all components (especially those using `var(--primary)` and other tokens) are themed correctly and isolated from host CSS (e.g. Bootstrap):

- Wrap the part of your app that uses ipa-ui in a theme container:

```tsx
const root = createRoot(document.getElementById('root')!);

root.render(
  <div data-theme="invicara">
    <App />
  </div>
);
```

All ipa-ui components rendered under this wrapper will resolve their theme variables (colors, radii, etc.) from the `invicara` theme.

### Dialog portal container (`#ipa-ui-modal-root`)

ipa-ui’s `Dialog` component uses a React portal. By default, portals render into `document.body`, which can cause themed content (e.g. buttons) to inherit the wrong CSS variables when global styles override `:root`.

To keep all dialogs inside your theme wrapper:

- Add a dedicated modal root **inside** the theme container:

```tsx
root.render(
  <div data-theme="invicara">
    <div id="ipa-ui-modal-root" />
    <App />
  </div>
);
```

- `Dialog` will:
  - Use the `container` prop if you pass one:

    ```tsx
    <Dialog
      title="My Dialog"
      open={open}
      onOpenChange={setOpen}
      container={document.getElementById('ipa-ui-modal-root')}
    >
      …
    </Dialog>
    ```

  - Otherwise, automatically portal into `document.getElementById('ipa-ui-modal-root')` when that element exists.

This keeps dialog overlays, content, and buttons inside the `data-theme="invicara"` subtree so they use ipa-ui’s tokens (e.g. pink primary) rather than host globals.

### CSS loading (component imports vs global import)

ipa-ui components import the library CSS internally (e.g. `import './output.css'`), so **in most setups you do not need an explicit global CSS import** – using any ipa-ui component will load the CSS.

However, if you want deterministic load order relative to your app styles (for example, “always after Bootstrap”), you can optionally add a global import once in your app’s main stylesheet:

```scss
/* Example: in your main app.scss */
@import '~@dtplatform/ipa-ui/dist/output.css';
```

This is recommended when you:

- Rely heavily on global frameworks like Bootstrap, and
- Want ipa-ui’s utility/component layers to consistently win in the cascade.

### Using ipa-ui via `@dtplatform/ipa-core`

If you consume ipa-ui indirectly through `@dtplatform/ipa-core` and use `IpaMainLayout`:

- `IpaMainLayout` already:
  - wraps the application in `<div data-theme="invicara">…</div>`
  - includes `<div id="ipa-ui-modal-root" />` inside that wrapper
- You generally **don’t need to add your own theme or modal wrappers** for core-driven screens; they’re provided by the layout.

You can still optionally add a global CSS import (as above) if you need strict control over load order relative to your app’s existing styles.

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

Many components also work in uncontrolled mode:

```tsx
<Button onClick={handleClick}>
  Click Me
</Button>
```

### Accessibility

All components follow ARIA best practices and are keyboard navigable. Components include:
- Proper focus management
- Keyboard navigation (Arrow keys, Enter, Escape, Tab)
- Screen reader support
- Focus indicators

