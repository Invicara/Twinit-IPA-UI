# Twinit-IPA-UI

A React component library implementing Invicara's design system with TypeScript support.

## Quick Start

### Installation

```bash
npm install @invicara/ipa-ui
```

### Basic Usage

```tsx
import { Button, Dialog, SingleSelect, Input } from '@invicara/ipa-ui';

function App() {
  return (
    <Button variant="default" size="default">
      Click Me
    </Button>
  );
}
```

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

## Component Variants

Some components are broken down into multiple variants that share a common base:

### Dropdown Component

The dropdown functionality is split into two variants:

- **`SingleSelect`** - Single selection dropdown with optional search/filter
- **`MultiSelect`** - Multiple selection dropdown with checkboxes and badges

Both variants share:
- Common base components (`DropdownPopup`, `DropdownTrigger`, `DropdownScrollableContent`)
- Shared styles (`DROPDOWN_STYLES`)
- Shared keyboard navigation logic (`useDropdownKeyboard`)
- Shared text utilities (`dropdown-text-utils`)

**Usage:**
```tsx
import { SingleSelect, MultiSelect } from '@invicara/ipa-ui';

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

## Development

### Running the Project

```bash
# Install dependencies
npm install

# Run Storybook (component documentation and testing)
npm run storybook

# Build Storybook for production
npm run build-storybook

# Build the library
npm run rollup
```

### Testing

```bash
# Run tests
npm test

# Run tests in verbose mode (shows detailed output)
npm run testv

# Run tests in watch mode (re-runs on file changes)
npm run test-watch
```

### Tailwind Development

```bash
# Watch and compile Tailwind CSS during development
npm run tailwind-dev
```

This command watches `src/styles/globals.css` and outputs to `src/output.css` for use in components.

## Component Props

Each component exports TypeScript types for full IDE support. Check individual component files for:
- `*.types.ts` - Type definitions
- `*.stories.tsx` - Storybook examples and prop documentation
- `*.test.tsx` - Test examples showing usage patterns

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

## Contributing

When adding new components:

1. **Simple components** → Use CVA pattern with variants
2. **Complex components** → Use interface pattern with `classNames` prop
3. **Component variants** → Share base components and utilities
4. **Composed components** → Accept ReactNode for flexible composition

Follow the existing patterns in the codebase for consistency.
