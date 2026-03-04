## Dialog Animations Strategy

This document explains why the `Dialog` component uses a **custom animation strategy** instead of the standard Tailwind + `data-[state=...]` pattern used elsewhere in the library.

It is intended for **library developers** working on `@dtplatform/ipa-ui`, not for consumers of the package.

---

### Background

Radix UI's `Dialog` primitive exposes its open/closed state via the `data-state` attribute:

- `data-state="open"`
- `data-state="closed"`

The original shadcn/Radix pattern typically uses Tailwind's `data-[state=open]:...` variants and animation utilities in the component JSX, for example:

```tsx
<DialogPrimitive.Content
  className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]
             data-[state=open]:animate-in data-[state=closed]:animate-out
             data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95"
/>
```

This works well in app code, but it has two problems for a **distributed UI library**:

1. **Public class names:** Tailwind utility names (e.g. `animate-in`, `zoom-in-95`) appear in the host app's DOM. They can theoretically clash with other frameworks (e.g. Bootstrap) or leak implementation details we want to keep internal.
2. **Transform conflicts:** The dialog is centered using `left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]`. Tailwind's animation utilities also manipulate `transform`, which can override or fight with the centering transform when combined incorrectly.

To avoid both issues, the dialog now uses **library-owned keyframes** and **plain CSS attribute selectors**, while still relying on Radix's `data-state` attribute to drive the animations.

---

### Goals

For the `Dialog` component we specifically want:

1. **No Tailwind animation utility class names exposed** to consuming apps.
2. **No transform conflicts** between centering and animations.
3. **Radix-driven state** (via `data-state="open" | "closed"`) to remain the single source of truth.
4. **Consistent behavior** with or without a dark overlay.

---

### Implementation Overview

The dialog's styling is split into:

- **Base layout & appearance** – defined in the CSS module using `@apply` (for BEM-style classes such as `dialog`, `content`, `header`, `footer`, etc.).
- **Open/close animations** – implemented as custom keyframes (`ipa-dialog-*`) wired to Radix's `data-state` attribute using standard CSS attribute selectors.

#### 1. Base styles (CSS module)

```css
.dialog {
  @apply fixed inset-0 z-50 bg-neutral-10/75;
}

.content {
  @apply fixed left-[50%] top-[50%] z-50 grid w-full
         translate-x-[-50%] translate-y-[-50%]
         gap-0 border-0 bg-neutral-0 shadow-[0_4px_24px_rgba(0,0,0,0.15)]
         transition-all duration-200 rounded-[8px];
}
```

Here we let Tailwind handle:

- Centering (`left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]`)
- Sizing, background, borders, shadow, radius, etc.

These classes are baked into the **CSS module**, not exposed as raw Tailwind class names in the consuming app.

#### 2. Custom keyframes

```css
@keyframes ipa-dialog-overlay-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes ipa-dialog-overlay-out {
  from { opacity: 1; }
  to   { opacity: 0; }
}

@keyframes ipa-dialog-content-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes ipa-dialog-content-out {
  from { opacity: 1; }
  to   { opacity: 0; }
}
```

Key points:

- We use **namespaced keyframe names** (`ipa-dialog-*`) to avoid collisions.
- We **do not animate `transform`**; centering is handled entirely by the base `.content` class.
- Animations are simple fade-in/fade-out for now; if we want zoom/slide later, we must be careful not to break centering (see below).

#### 3. Attribute selectors wired to Radix `data-state`

```css
.dialog[data-state="open"] {
  animation: ipa-dialog-overlay-in 150ms ease-out forwards;
}

.dialog[data-state="closed"] {
  animation: ipa-dialog-overlay-out 150ms ease-in forwards;
}

.content[data-state="open"] {
  animation: ipa-dialog-content-in 150ms ease-out forwards;
}

.content[data-state="closed"] {
  animation: ipa-dialog-content-out 150ms ease-in forwards;
}
```

This is pure CSS – **no Tailwind variants** here. Radix is responsible for setting:

- `data-state="open"` when the dialog opens.
- `data-state="closed"` when the dialog closes.

The CSS module reacts to those attributes and plays the correct keyframes.

#### 4. JSX stays clean and library-friendly

In `dialog.tsx`, we only apply **CSS module classes** and optional overrides via `classNames`:

```tsx
<DialogPrimitive.Overlay
  className={cn(
    styles.dialog,
    classNames?.dialog
  )}
/>;

<DialogPrimitive.Content
  ref={ref}
  className={cn(
    styles.content,
    sizeClasses[size],
    hideOverlay && styles.contentPointerEventsAuto,
    classNames?.content,
    className
  )}
  onInteractOutside={(e) => {
    if (disableClickOutside) e.preventDefault();
  }}
  onEscapeKeyDown={(e) => {
    if (disableEscapeKey) e.preventDefault();
  }}
  {...props}
>
  {/* ... */}
</DialogPrimitive.Content>;
```

There are **no Tailwind animation utilities** in the JSX. Consuming apps only see:

- The CSS module class names (e.g. `dialog_module__content__abc123`).
- Any extra classes provided via `classNames` or `className`.

---

### Why This Is Different from Other Components

Other components (e.g. `Checkbox`, `RadioGroup`, `Accordion`, `Dropdown`) still use Tailwind's `data-[state=...]` variants inside `@apply`, for example:

```css
.root {
  @apply border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground;
}
```

This works fine because:

1. These components mostly toggle **colors and borders**, not transforms.
2. We are not trying to completely hide Tailwind's animation utilities for them.

For `Dialog` specifically, we had **two extra constraints**:

1. We need **transform-based centering** (`translate(-50%, -50%)`) to remain stable.
2. We want to avoid exposing any Tailwind animation utility classes in the DOM of consuming apps.

Mixing Tailwind's transform-based animation utilities (`zoom-in-95`, `slide-in-from-*`) with centering transforms made the dialog fragile. Moving to custom keyframes and attribute selectors in the CSS module solves this cleanly.

---

### Guidelines for Future Work

If you modify or extend dialog animations:

1. **Prefer opacity-only animations** unless you have a strong reason to animate transforms.
2. If you animate `transform`, make sure you:
   - Preserve the centering transform (`translate(-50%, -50%)`) in both the base and animated states.
   - Test on various viewport sizes.
3. Keep animation keyframes and naming **namespaced** (e.g. `ipa-dialog-*`).
4. Continue to use **Radix `data-state` attributes** as the single control point, and wire them via CSS attribute selectors.
5. Avoid reintroducing Tailwind animation utilities such as `animate-in` / `animate-out` into the public `className` props of this component.

If you need a different animation preset (e.g. more pronounced zoom/slide), add new `@keyframes` in this module and update the `[data-state]` rules accordingly, rather than switching back to raw Tailwind animation utilities.
