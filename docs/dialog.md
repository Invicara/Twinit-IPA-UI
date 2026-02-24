# Dialog

Modal (or non-modal) dialog with optional overlay, header with title and close button, scrollable body, and configurable footer. Built on [Radix UI Dialog](https://www.radix-ui.com/primitives/docs/components/dialog). Use for confirmations, forms, or any focused content that should appear above the page.

## Import

```tsx
import { Dialog } from '@dtplatform/ipa-ui';
```

## Basic usage

```tsx
const [open, setOpen] = useState(false);

<Dialog
  open={open}
  onOpenChange={setOpen}
  title="Confirm action"
  footer={
    <>
      <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
      <Button onClick={handleConfirm}>Confirm</Button>
    </>
  }
>
  Are you sure you want to continue?
</Dialog>
```

## API

| Prop                    | Type       | Default     | Description |
|-------------------------|------------|-------------|-------------|
| `open`                  | `boolean`  | —           | Controlled open state. |
| `onOpenChange`          | `(open: boolean) => void` | — | Called when open state should change. |
| `title`                 | `string`   | **required** | Heading in the header. |
| `children`              | `ReactNode`| **required** | Body content (scrollable). |
| `footer`                | `ReactNode`| —           | Footer content (e.g. buttons). Omit when using `acknowledgment` or `passive`. |
| `size`                  | `'sm'` \| `'default'` \| `'lg'` \| `'xl'` \| `'full'` | `'default'` | Dialog width. |
| `hideOverlay`           | `boolean`  | `false`     | No dark overlay (non-modal style). |
| `acknowledgment`        | `boolean`  | `false`     | Show a single “OK” button in the footer; no need to pass `footer`. |
| `passive`               | `boolean`  | `false`     | No footer at all. |
| `disableClickOutside`   | `boolean`  | `false`     | Clicking overlay does not close. |
| `disableCloseButton`    | `boolean`  | `false`     | Hide the X close button in the header. |
| `disableEscapeKey`      | `boolean`  | `false`     | Escape key does not close. |
| `container`             | `HTMLElement \| null` | — | Portal mount node. Defaults to `document.getElementById('ipa-ui-modal-root')` if present. |
| `classNames`            | `object`   | —           | Override classes for sub-elements (see **classNames** below). |
| `className`             | `string`  | —           | Applied to the content wrapper. |

### classNames (Dialog)

All properties are optional. Pass only the keys you need to override.

| Property       | Applies to |
|----------------|------------|
| `overlay`      | Backdrop behind the dialog. |
| `content`      | Main dialog panel (wrapper around header, body, footer). |
| `header`       | Header bar (title + close button). |
| `title`        | Title heading (`h2`). |
| `closeButton`  | X close button. |
| `body`         | Scrollable content area. |
| `footer`       | Footer area (buttons). |

## Examples

**Acknowledgment (OK only)**

```tsx
<Dialog
  open={open}
  onOpenChange={setOpen}
  title="Saved"
  acknowledgment
>
  Your changes have been saved.
</Dialog>
```

**No footer**

```tsx
<Dialog open={open} onOpenChange={setOpen} title="Info" passive>
  Read-only message.
</Dialog>
```

**Non-modal (no overlay)**

```tsx
<Dialog open={open} onOpenChange={setOpen} title="Side panel" hideOverlay>
  Content without blocking the rest of the page.
</Dialog>
```

**Portal container (e.g. theme wrapper)**

Ensure modals inherit your app’s theme by rendering them inside a wrapper that has your CSS variables:

```tsx
// In your app root, have a node: <div id="ipa-ui-modal-root" />
// Or pass explicitly:
<Dialog container={document.getElementById('my-modal-root')} ... />
```

**Custom footer and classNames**

```tsx
<Dialog
  classNames={{ footer: 'my-footer-class', title: 'my-title-class' }}
  footer={<Button>Custom action</Button>}
  ...
/>
```

## Styling

The dialog uses internal CSS modules for layout, overlay, and animations. Override specific areas with `classNames` or the root `className`. For implementation details (e.g. animation strategy), see [dialog-animations.md](external/dialog-animations.md) (contributors).

## Accessibility

Radix handles focus trap, focus restoration, and `aria` attributes. The title is rendered as an `h2` and associated with the dialog. Provide an accessible label if you hide the title visually but keep it for screen readers.
