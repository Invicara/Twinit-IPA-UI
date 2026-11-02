# Contributing to ipa-ui

Thank you for considering contributing to `@dtplatform/ipa-ui`. This guide explains how to submit changes and what to expect from the maintainers.

## Overview

This project uses a **dual-repo** setup: this **public** repository ([Twinit-IPA-UI](https://github.com/Invicara/Twinit-IPA-UI)) receives released code on the **releases** branch. Day-to-day development and release flow happen in the private repository ([Internal-IPA-UI](https://github.com/Invicara/Internal-IPA-UI)). When you open a PR here, maintainers will review it and, if accepted, integrate it into the internal pipeline. Your change will appear in the **next release** published to this repo (on the **releases** branch).

## How to contribute

### 1. Fork and clone

Fork the [Twinit-IPA-UI](https://github.com/Invicara/Twinit-IPA-UI) repository on GitHub, then clone your fork:

```bash
git clone https://github.com/YOUR_USERNAME/Twinit-IPA-UI.git
cd Twinit-IPA-UI
```

### 2. Set up

Use Node 22 (`.nvmrc` pins `22.23.4`; run `nvm use`), then:

```bash
npm install
npm run build:css   # generates src/output.css, which Storybook imports
npm run storybook
```

See [README.md](README.md#development) for all scripts.

### 3. Create a branch

The public repository's default branch is **`releases`**; branch from it. Use a **branch naming pattern** so maintainers can see the type of change:

| Prefix   | Use for |
|----------|---------|
| `feature/` | New features or enhancements |
| `fix/`     | Bug fixes |
| `docs/`    | Documentation only |

**Examples:**

- `feature/add-tooltip-component`
- `fix/dialog-focus-trap`
- `docs/update-button-examples`

```bash
git remote add upstream https://github.com/Invicara/Twinit-IPA-UI.git
git fetch upstream
git checkout -b feature/your-change upstream/releases
```

### 4. Make your changes

- Follow existing code and documentation patterns (see [README.md](README.md) for component architecture):
  - Styles go in a CSS module next to the component (`<component>.module.css`) using the design tokens. No Tailwind or utility classes.
  - Compose class names with `cn()` from `src/lib/utils.tsx` (a `clsx` wrapper) and support `styleOverrides` via `mergeStyles()`.
- When adding UI primitives, prefer **Radix UI** wrappers first; if Radix has no equivalent, port from **shadcn/ui** (see [component sources](../internal/component-sources.md)).
- Add or update tests (`<component>.test.tsx`, Jest + Testing Library) and Storybook stories (`<component>.stories.tsx`) when relevant.
- Update the [component docs](../) (e.g. `docs/accordion.md`) if you change a component's API or behavior.
- Run `npm test` and `npm run build` before pushing.

### 5. Commit

We enforce **Conventional Commits**: commitlint runs on each commit through a husky `commit-msg` hook (installed by `npm install`). Rules (see `commitlint.config.js`):

- **Allowed types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`. Other types (e.g. `build:`, `revert:`) are rejected; the default `Revert "..."` message from `git revert` is ignored.
- **Subject** at most 72 characters, e.g. `feat: add tooltip`, `fix(dialog): focus trap`, `docs: update button examples`.
- **Breaking changes:** use `feat!:` or `fix(scope)!:` in the subject, or add a `BREAKING CHANGE:` footer.
- Merge commits (messages starting with `Merge `) are ignored.

### 6. Push and open a PR

Push your branch to your fork and open a **Pull Request** against this repository's **`releases`** branch.

- Describe what you changed and why.
- Reference any related issues if applicable.
- The repository has no CI workflow, so make sure `npm test` and `npm run build` pass locally.

## What happens next

1. **Review** – Maintainers will review your PR, ask for changes if needed, and approve when ready.
2. **Integration** – Approved changes are merged into the **internal** development branch and go through the internal release process (staging, QA, production).
3. **Release** – When the next version is released, this public repo’s **releases** branch is updated with the release. Your change will be included in that release.
4. **PR closure** – The maintainers will close your PR with a comment such as: *“Merged internally and included in v2.0.1. Thank you!”*

You may not see a direct “merge” into the branch you targeted, because the actual merge happens in the private repo. Your contribution is still part of the next published release.

## Questions

If you have questions about contributing or the workflow, open an [issue](https://github.com/Invicara/Twinit-IPA-UI/issues) in this repository and the maintainers will respond.
