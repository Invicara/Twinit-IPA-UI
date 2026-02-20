# Contributing to ipa-ui

Thank you for considering contributing to `@invicara/ipa-ui`. This guide explains how to submit changes and what to expect from the maintainers.

## Overview

This project uses a **dual-repo** setup: the repository you see (public) receives released code. Day-to-day development and release flow happen in a private repository. When you open a PR here, maintainers will review it and, if accepted, integrate it into the internal pipeline. Your change will appear in the **next release** published to this repo.

## How to contribute

### 1. Fork and clone

Fork this repository on GitHub, then clone your fork:

```bash
git clone https://github.com/YOUR_USERNAME/Twinit-IPA-UI.git
cd Twinit-IPA-UI
```

### 2. Create a branch

Branch from the default branch (e.g. `main`). Use a **branch naming pattern** so maintainers can see the type of change:

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
git checkout main
git pull origin main
git checkout -b feature/your-change
```

### 3. Make your changes

- Follow existing code and documentation patterns (see [README.md](README.md) for component architecture).
- Add or update tests and Storybook stories when relevant.
- Update the [component docs](../) (e.g. `docs/accordion.md`) if you change a component’s API or behavior.

### 4. Commit

Use **conventional commits** as much as possible it helps us integrate your code (e.g. `feat: add tooltip`, `fix: dialog focus trap`, `docs: update button examples`). Keep the first line short and clear.

### 5. Push and open a PR

Push your branch to your fork and open a **Pull Request** against this repository’s default branch (e.g. `main`).

- Describe what you changed and why.
- Reference any related issues if applicable.
- Ensure CI (if enabled) passes.

## What happens next

1. **Review** – Maintainers will review your PR, ask for changes if needed, and approve when ready.
2. **Integration** – Approved changes are merged into the **internal** development branch and go through the internal release process (staging, QA, production).
3. **Release** – When the next version is released, the public repo is updated with a release commit. Your change will be included in that release.
4. **PR closure** – The maintainers will close your PR with a comment such as: *“Merged internally and included in v1.0.5. Thank you!”*

You may not see a direct “merge” into the branch you targeted, because the actual merge happens in the private repo. Your contribution is still part of the next published release.

## Questions

If you have questions about contributing or the workflow, open an issue in this repository and the maintainers will respond.
