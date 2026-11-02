# Contributor documentation (external developers)

This folder is for **external contributors** who want to work on `@dtplatform/ipa-ui`. This is the **public** repo ([Twinit-IPA-UI](https://github.com/Invicara/Twinit-IPA-UI)); released code lives on the **releases** branch. Day-to-day development happens in the private repo [Internal-IPA-UI](https://github.com/Invicara/Internal-IPA-UI). It covers how to run the project, understand the codebase, and submit contributions. **Consumers** of the package should use the [component docs](../) in the parent `docs/` folder.

## Contents

| Doc | Description |
|-----|-------------|
| [contributing.md](contributing.md) | How to contribute: fork, branch naming, opening a PR, and what to expect after review. |
| [dialog-animations.md](dialog-animations.md) | Why Dialog uses custom keyframes and CSS modules instead of animation utility classes in JSX. |

---

## Development

### Requirements

- **Node 22.** `.nvmrc` pins `22.23.4` (the version the Storybook site is built with); run `nvm use`. `package.json` has no `engines` field, so other versions are not blocked, but 22 is the pinned version.
- **npm** (the repo ships a `package-lock.json`).

### Running the project

```bash
npm install
npm run build:css        # Compile src/styles/globals.css -> src/output.css (run once before Storybook)
npm run watch:css        # Same, in watch mode
npm run storybook        # Storybook dev server on http://localhost:6006
npm run build-storybook  # Static Storybook build (runs build:css first)
npm run build            # Build the library: build:css + build:js (rollup) + copy output.css to dist/
npm test                 # Run tests (Jest)
npm run testv            # Verbose tests
npm run test-watch       # Watch mode
```

`src/output.css` is generated and git-ignored, and Storybook imports it, so on a fresh clone run `npm run build:css` (or keep `npm run watch:css` running) before `npm run storybook`.

CSS is processed by PostCSS only (`postcss-preset-env` and `autoprefixer`, see `postcss.config.js`). There is no Tailwind in the project.

### Codebase layout

- **Components:** `src/components/ui/<component>/`, usually with:
  - `<component>.tsx`: the component. Prop types are normally declared in this file; only Dropdown and Table have separate `*.types.ts` files.
  - `<component>.module.css`: the component's styles (CSS modules).
  - `<component>.stories.tsx`: Storybook examples and prop docs.
  - `<component>.test.tsx`: Jest + Testing Library tests (jsdom).
  - `index.ts`: re-exports, picked up by `src/components/ui/index.ts`.
- **Icons:** `src/components/icons/`.
- **Utilities:** `src/lib/utils.tsx`: `cn()` (a thin wrapper around `clsx`, no `tailwind-merge`) and `mergeStyles()`.
- **Global CSS:** `src/styles/globals.css`, compiled to `src/output.css` and shipped as `dist/output.css`.

---

## Component architecture (for contributors)

### Styling patterns

1. **CSS modules, no utility classes**
   Every component imports its own `*.module.css` and composes class names with `cn()`. Variants and sizes (e.g. Button `variant` / `size`) are exposed as `data-variant` / `data-size` attributes and styled in the CSS module; there is no Class Variance Authority (CVA) and no `*Variants` export.

2. **`styleOverrides`**
   Components accept a **`styleOverrides`** prop: a CSS module or plain object mapping slot names to class names. The component merges your classes with the defaults via `mergeStyles` (`const s = mergeStyles(styles, styleOverrides)`). New components should follow the same pattern. Consumers make overrides win by importing them after ipa-ui or raising specificity (see the README [Override convention](../../README.md#override-convention-make-your-rule-win-the-cascade)). See [data-attributes.md](../data-attributes.md#customising-with-styleoverrides), the `styleOverrides` rows in [dropdown.md](../dropdown.md), and [README Custom Style Overrides](../../README.md#custom-style-overrides).

### Component variants (dropdown)

The dropdown is split into **SingleSelect** and **MultiSelect**. They share base components (`DropdownPopup`, `DropdownTrigger`, `DropdownScrollableContent`), shared styles, positioning (`useDropdownFloating`) and keyboard logic (`useDropdownKeyboard`, `dropdown-text-utils`) in `src/components/ui/dropdown/shared/`. When changing dropdown behavior, prefer updating the shared base so both variants stay in sync.

---

When adding or changing components, follow existing patterns and keep the [component docs](../) up to date for library users. See [contributing.md](contributing.md) for the full contribution workflow.
