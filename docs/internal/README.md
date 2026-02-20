# Internal documentation (library developers)

This folder is for **maintainers and contributors** working on `@invicara/ipa-ui` itself. It covers implementation details, build, release, and contribution patterns. **Consumers of the package** should use the [component docs](../) in the parent `docs/` folder.

## Contents

| Doc | Description |
|-----|-------------|
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
   `Dialog`, `SingleSelect`, `MultiSelect`, `Accordion`, `Breadcrumb` use an interface-based approach with a **`classNames`** prop. Each key maps to a specific sub-component. Classes are merged with defaults using `cn()` (clsx + tailwind-merge): `className={cn(defaultStyles, classNames?.key)}`. You can override any default by providing that key.

### Component variants (dropdown)

The dropdown is split into **SingleSelect** and **MultiSelect**. They share:

- Base components: `DropdownPopup`, `DropdownTrigger`, `DropdownScrollableContent`
- Shared styles and keyboard logic: `useDropdownKeyboard`, `dropdown-text-utils`

When adding or changing dropdown behavior, prefer updating the shared base so both variants stay in sync.

---

## Publishing

This package is published to **GitHub Packages**. Follow these steps to publish a new version.

### Quick steps

```bash
npm login --registry=https://npm.pkg.github.com --scope=@invicara
npm version patch   # or minor / major
# Update CHANGELOG.md with your changes
npm publish
```

You need a GitHub Personal Access Token with `write:packages` (create at https://github.com/settings/tokens).

### Prerequisites

1. **GitHub token** with `write:packages`.
2. **npm auth:**
   ```bash
   npm login --registry=https://npm.pkg.github.com --scope=@invicara
   ```
   Use your GitHub username and the token as password. Or set `~/.npmrc`:
   ```
   @invicara:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
   ```

### Publishing steps

1. **Version:** `npm version patch|minor|major` (updates `package.json`, creates commit and tag).
2. **CHANGELOG:** Document changes in `CHANGELOG.md` (Keep a Changelog format).
3. **Build:** `npm run build` (runs automatically via `prepublishOnly`). Produces `dist/cjs/`, `dist/esm/`, types, CSS.
4. **Publish:** `npm publish`. Publishes to GitHub Packages; only `dist/`, `README.md`, `LICENSE` are included (see `package.json` `files`).
5. **Verify:** `npm view @invicara/ipa-ui versions` or https://github.com/Invicara/Twinit-IPA-UI/packages.

### Installing the published package (consumers)

Consumers need `.npmrc` with `@invicara:registry` and `//npm.pkg.github.com/:_authToken`, then `npm install @invicara/ipa-ui`.

### Troubleshooting

- **Auth errors:** Check token has `write:packages` and `.npmrc` is correct.
- **Build failures:** Run `npm run build` manually for full errors.
- **Version exists:** Bump again (patch/minor/major).
- **Scope:** Package name must be exactly `@invicara/ipa-ui`.

---

## Contributing

When adding or changing components:

1. **Simple components** → CVA pattern with `variant` / `size` and a `*Variants` export.
2. **Complex components** → Interface pattern with `classNames` prop for sub-component overrides.
3. **Variants (e.g. SingleSelect / MultiSelect)** → Share base components and utilities; keep API consistent.
4. **Composition** → Prefer `ReactNode` (e.g. `footer`, `children`) for flexible composition.

Follow existing patterns in the codebase and keep component docs in `docs/` up to date for library users.
