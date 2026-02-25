# Twinit-IPA-UI

A React component library implementing Invicara's design system with TypeScript support.

> **BETA disclaimer:** This library is currently in **BETA**. Integrators should expect **breaking changes** to the component API as the library evolves. Use at your own risk.

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

### 2. Complex Components (Interface Pattern with classNames)

**Components:** `Dialog`, `Dropdown` (SingleSelect/MultiSelect), `Accordion`, `Breadcrumb`

Complex components use an **interface-based approach** with a `classNames` prop for granular styling control. These components have multiple sub-components that can be individually styled.

**Example:**
```tsx
<Dialog
  title="My Dialog"
  hideOverlay          // Show/hide backdrop overlay
  disableCloseButton   // Enable/disable close button
  disableEscapeKey       // Allow/prevent closing with Escape
  enableLongTextAnimation   // Enable long text scrolling animation
  classNames={{
    overlay: "bg-black/50",
    content: "rounded-lg",
    header: "bg-blue-500",
    body: "p-4",
    footer: "border-t"
  }}
>
  Content here
</Dialog>

<SingleSelect
  options={options}
  hideFooter={false}              // Show/hide footer
  hideRowHighlight={false}        // Show/hide row highlight on hover
  disableKeyboardNavigation={false} // Enable/disable keyboard navigation
  enableLongTextAnimation={true}   // Enable text scrolling for long items
  classNames={{
    trigger: "custom-trigger",
    popup: "custom-popup",
    item: "custom-item"
  }}
/>
```

**The `classNames` Pattern:**

The `classNames` prop is an object that maps to specific sub-components within a complex component. This allows you to drill down and customize individual parts:

```tsx
// Dialog example
classNames={{
  overlay: "custom-overlay-styles",      // Styles the backdrop overlay
  content: "custom-content-styles",      // Styles the main dialog container
  header: "custom-header-styles",        // Styles the header section
  title: "custom-title-styles",          // Styles the title text
  closeButton: "custom-close-styles",    // Styles the X close button
  body: "custom-body-styles",            // Styles the content area
  footer: "custom-footer-styles"         // Styles the footer section
}}

// Dropdown example
classNames={{
  container: "custom-container",        // Styles the wrapper div
  trigger: "custom-trigger",              // Styles the input/button trigger
  popup: "custom-popup",                  // Styles the dropdown menu
  item: "custom-item",                    // Styles each dropdown item
  itemText: "custom-item-text",           // Styles the text within items
  ellipsis: "custom-ellipsis",            // Styles the ellipsis indicator
  footer: "custom-footer"                 // Styles the footer
}}
```

**How it works:**
- Each key in `classNames` corresponds to a specific sub-component
- The provided Tailwind classes are merged with the component's default styles using `cn()` (clsx + tailwind-merge)
- You can override any default styling by providing your own classes
- Classes are applied using the `className={cn(defaultStyles, classNames?.key)}` pattern

### Input: Styling subparts (no Tailwind)

The `Input` component supports the same pattern via **`classNames`**. Pass custom classes (e.g. from your CSS module) to target each subpart without rewriting the component's CSS.

**Available keys:** `container`, `label`, `wrapper`, `iconContainer`, `icon`, `input`, `passwordToggle`, `passwordToggleIcon`, `helperText`

**Example – Custom classes (e.g. from your CSS module):**

```tsx
import { Input } from '@invicara/ipa-ui'
import formStyles from './MyForm.module.css'

<Input
  label="Email"
  helperText="We'll never share your email"
  placeholder="you@example.com"
  classNames={{
    container: formStyles.inputGroup,
    label: formStyles.inputLabel,
    input: formStyles.inputField,
    helperText: formStyles.inputHelper,
  }}
/>
```

```css
/* MyForm.module.css */
.inputGroup {
  margin-bottom: 1rem;
}
.inputLabel {
  font-weight: 600;
  letter-spacing: 0.02em;
}
.inputField {
  max-width: 20rem;
}
.inputHelper {
  font-size: 0.75rem;
  color: var(--neutral-6);
  margin-top: 0.25rem;
}
```

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

## Styling with Tailwind

All components use Tailwind CSS for styling. You can customize components in several ways:

1. **Using className prop** (simple components):
   ```tsx
   <Button className="w-full bg-blue-500 hover:bg-blue-600">
     Custom Button
   </Button>
   ```

2. **Using classNames prop** (complex components):
   ```tsx
   <Dialog
     classNames={{
       content: "max-w-2xl",
       header: "bg-gradient-to-r from-blue-500 to-purple-500",
       body: "text-lg"
     }}
   >
     Content
   </Dialog>
   ```

3. **Overriding default styles**:
   The `cn()` utility function merges classes intelligently, so you can override defaults:
   ```tsx
   <Button className="bg-red-500">  // Overrides default variant background
     Red Button
   </Button>
   ```

## Theming and Dialog Portals

### Theme wrapper (`data-theme="invicara"`)

ipa-ui ships with an `invicara` design theme based on CSS variables.  
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

