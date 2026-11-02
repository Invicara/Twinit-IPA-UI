# Dialog

Modal dialog with optional overlay, header with title and close button, scrollable body, and configurable footer. Built on [Radix UI Dialog](https://www.radix-ui.com/primitives/docs/components/dialog). Use for confirmations, forms, or any focused content that should appear above the page.

## Import

```tsx
import { Dialog } from '@dtplatform/ipa-ui';
```

## Basic usage

There is no trigger component: control visibility with `open` / `onOpenChange`.

```tsx
import { Button, Dialog } from '@dtplatform/ipa-ui';

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
| `open`                  | `boolean`  | -           | Controlled open state. |
| `onOpenChange`          | `(open: boolean) => void` | - | Called when open state should change. |
| `title`                 | `string`   | **required** | Heading in the header. |
| `children`              | `ReactNode`| **required** | Body content (scrollable). |
| `footer`                | `ReactNode`| -           | Footer content (e.g. buttons). Ignored when `acknowledgment` or `passive` is set. The footer area is not rendered when there is no footer content. |
| `size`                  | `'sm'` \| `'default'` \| `'lg'` \| `'xl'` \| `'full'` | `'default'` | Dialog max width: `28rem`, `36rem`, `48rem`, `64rem`, `90vw`. Exposed as `data-size` on the content panel. |
| `hideOverlay`           | `boolean`  | `false`     | Do not render the dark overlay. Visual only: the dialog stays modal (focus trap, scroll lock, page outside not clickable; clicking outside still closes unless `disableClickOutside`). |
| `acknowledgment`        | `boolean`  | `false`     | Show a single “OK” button in the footer that closes the dialog (calls `onOpenChange(false)`); replaces `footer`. `passive` wins if both are set. |
| `passive`               | `boolean`  | `false`     | No footer at all (overrides `footer` and `acknowledgment`). |
| `disableClickOutside`   | `boolean`  | `false`     | Clicking or focusing outside the panel does not close. |
| `disableCloseButton`    | `boolean`  | `false`     | Hide the X close button in the header. |
| `disableEscapeKey`      | `boolean`  | `false`     | Escape key does not close. |
| `container`             | `HTMLElement \| null` | - | Portal mount node. Defaults to `document.getElementById('ipa-ui-modal-root')` if present, otherwise `document.body`. |
| `styleOverrides`        | `Record<string, string>` | - | Override classes for sub-elements (see **styleOverrides** below). Plain object or CSS module. |
| `className`             | `string`  | -           | Applied to the content panel (`content` slot). |

`Dialog` does not accept other HTML attributes; the ref is forwarded to the content panel (`HTMLDivElement`).

### styleOverrides (Dialog)

Pass an object (or CSS module) mapping slot names to class names. Keys match the internal slots; pass only the keys you need to override. See [README Custom Style Overrides](../README.md#custom-style-overrides) for plain CSS vs CSS modules.

| Key            | Applies to |
|----------------|------------|
| `dialog`       | Backdrop overlay (outermost). Not rendered with `hideOverlay`. |
| `content`      | Main dialog panel (wrapper around header, body, footer). |
| `contentPointerEventsAuto` | Added to the panel only when `hideOverlay` is set. |
| `header`       | Header bar (title + close button). |
| `title`        | Title heading (`h2`). |
| `closeButton`  | X close button. |
| `closeButtonIcon` | Icon inside the X close button. |
| `body`         | Scrollable content area (also carries the global `custom-scrollbar` class). |
| `footer`       | Footer area (buttons). |

### Data attributes

The overlay has `data-testid="ipa_dialog_overlay"`. The content panel has `data-size` (the `size` value). Radix sets `data-state` (`open` \| `closed`) on both overlay and panel.

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

**No overlay**

```tsx
<Dialog open={open} onOpenChange={setOpen} title="Side panel" hideOverlay>
  No dark backdrop; the page behind is visible but still not interactive while open.
</Dialog>
```

**Portal container (e.g. theme wrapper)**

Ensure modals inherit your app’s theme by rendering them inside a wrapper that has your CSS variables:

```tsx
// In your app root, have a node: <div id="ipa-ui-modal-root" />
// Or pass explicitly:
<Dialog container={document.getElementById('my-modal-root')} ... />
```

**Custom footer and styleOverrides**

```tsx
<Dialog
  styleOverrides={{ footer: 'my-footer-class', title: 'my-title-class' }}
  footer={<Button>Custom action</Button>}
  ...
/>
```

## Styling

The dialog uses internal CSS modules for layout, overlay, and animations. Override specific areas with `styleOverrides` or `className` (applied to the content panel). For implementation details (e.g. animation strategy), see [dialog-animations.md](external/dialog-animations.md) (contributors).

## Accessibility

Radix handles focus trap, focus restoration, and `aria` attributes. The title is rendered as an `h2` and associated with the dialog. Provide an accessible label if you hide the title visually but keep it for screen readers.
