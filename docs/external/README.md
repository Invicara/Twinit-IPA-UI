# Contributor documentation (external developers)

This folder is for **external contributors** who want to work on `@dtplatform/ipa-ui`. This is the **public** repo ([Twinit-IPA-UI](https://github.com/Invicara/Twinit-IPA-UI)); released code lives on the **releases** branch. Day-to-day development happens in the private repo [Internal-IPA-UI](https://github.com/Invicara/Internal-IPA-UI). It covers how to run the project, understand the codebase, and submit contributions. **Consumers** of the package should use the [component docs](../) in the parent `docs/` folder.

## Contents

| Doc | Description |
|-----|-------------|
| [contributing.md](contributing.md) | How to contribute: fork, branch naming, opening a PR, and what to expect after review. |
| [dialog-animations.md](dialog-animations.md) | Why Dialog uses custom keyframes and CSS attribute selectors instead of Tailwind animation utilities. |

---

## Development

### Running the project

```bash
npm install
npm run storybook      # Component documentation and testing
npm run build-storybook
npm run build          # Build the library
npm test               # Run tests
npm run testv          # Verbose tests
npm run test-watch     # Watch mode
npm run tailwind-dev   # Watch Tailwind (globals.css → output.css)
```

### Codebase layout

- **Component types:** `*.types.ts` next to each component
- **Examples and prop docs:** `*.stories.tsx` (Storybook)
- **Usage patterns:** `*.test.tsx`

---

## Component architecture (for contributors)

### Styling patterns

1. **Simple components (CVA)**  
   `Button`, `Input`, `Checkbox`, `RadioGroup`, `Slider`, `Link` use **Class Variance Authority (CVA)** with a limited set of variants/sizes. Use `variant` and `size` props; expose a `*Variants` export (e.g. `buttonVariants`) for advanced use.

2. **Complex components (styleOverrides)**
   `SingleSelect`, `MultiSelect`, `Dialog`, `Accordion`, `Breadcrumb`, `Input`, `Button`, `Link`, `Checkbox`, `RadioGroup`, and `Slider` use **`styleOverrides`**: pass a CSS module or plain object mapping slot names to class names. The component merges your classes with the defaults via `mergeStyles`. **Import your override file last** in your app so override CSS appears after the library’s and wins. See [data-attributes.md](../data-attributes.md#customising-with-css-modules-styleoverrides), [dropdown.md](../dropdown.md#styling), and [README Custom Style Overrides](../README.md#custom-style-overrides).

### Component variants (dropdown)

The dropdown is split into **SingleSelect** and **MultiSelect**. They share base components (`DropdownPopup`, `DropdownTrigger`, `DropdownScrollableContent`), shared styles, and keyboard logic (`useDropdownKeyboard`, `dropdown-text-utils`). When changing dropdown behavior, prefer updating the shared base so both variants stay in sync.

---

When adding or changing components, follow existing patterns and keep the [component docs](../) up to date for library users. See [contributing.md](contributing.md) for the full contribution workflow.
