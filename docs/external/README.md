# Contributor documentation (external developers)

This folder is for **external contributors** who want to work on `@dtplatform/ipa-ui`. It covers how to run the project, understand the codebase, and submit contributions. **Consumers** of the package should use the [component docs](../) in the parent `docs/` folder.

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

2. **Complex components (classNames)**  
   `Dialog`, `SingleSelect`, `MultiSelect`, `Accordion`, `Breadcrumb` use an interface-based approach with a **`classNames`** prop. Each key maps to a specific sub-component. Classes are merged with defaults using `cn()` (clsx + tailwind-merge). You can override any default by providing that key.

### Component variants (dropdown)

The dropdown is split into **SingleSelect** and **MultiSelect**. They share base components (`DropdownPopup`, `DropdownTrigger`, `DropdownScrollableContent`), shared styles, and keyboard logic (`useDropdownKeyboard`, `dropdown-text-utils`). When changing dropdown behavior, prefer updating the shared base so both variants stay in sync.

---

When adding or changing components, follow existing patterns and keep the [component docs](../) up to date for library users. See [contributing.md](contributing.md) for the full contribution workflow.
