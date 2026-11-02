## Dialog animations strategy

This document explains why the `Dialog` component uses **custom keyframes and plain CSS** in its module instead of shipping **animation utility class names** in JSX (the pattern some Radix + shadcn examples use with utility-first CSS).

It is intended for **library developers** working on `@dtplatform/ipa-ui`, not for consumers of the package.

---

### Background

Radix UI's `Dialog` primitive exposes open/closed state via `data-state` (`open` | `closed`).

Many app-level examples compose the dialog with **utility classes** in `className` for enter/leave animations. That works in app code, but for a **distributed UI library** it has drawbacks:

1. **Public class names:** Third-party utility names can appear in the DOM and clash with the host app’s CSS or leak implementation choices.
2. **Transforms:** Centering often uses `translate(-50%, -50%)`. Enter/leave animations that also animate `transform` must be authored so they **do not fight** the centering transform.

ipa-ui styles Dialog with a **CSS module** and **library-owned `@keyframes`**, driven by Radix’s `data-state`.

---

### Goals

1. **No animation utility class names** from the design system in public `className` / DOM for this component.
2. **Stable centering** while animating open/close.
3. **Radix `data-state`** remains the single source of truth for animation hooks.

---

### Implementation overview

See `src/components/ui/dialog/dialog.module.css`.

- **Overlay** (`.dialog`): fixed full-screen; fade in/out via `ipa-dialog-overlay-*` keyed off `[data-state]`.
- **Content** (`.content`): fixed, centered with `transform: translate(-50%, -50%)`; open/close uses `ipa-dialog-content-*` keyframes that include **opacity and transform** in a controlled way so centering stays coherent.

#### JSX

`dialog.tsx` applies **CSS module classes** only (`s.dialog`, `s.content`, …) plus optional `styleOverrides` / `className`. Consumers see hashed module class names, not bundled third-party utility strings.

---

### Guidelines for future changes

1. Prefer **opacity** for subtle transitions; if you animate `transform`, keep **centering** correct in `from`/`to` keyframes.
2. Keep keyframe names **namespaced** (e.g. `ipa-dialog-*`).
3. Drive animations from **Radix `data-state`** and CSS attribute selectors.
4. Do not move dialog enter/leave animation back into **public** JSX as long strings of third-party utility class names.

If you need a different preset, add or adjust `@keyframes` in the module and the matching `[data-state="open" | "closed"]` rules.
