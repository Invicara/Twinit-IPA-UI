# Internal documentation (internal developers only)

This folder is for the **internal team**. It covers release flow, publishing, and implementation details. **External contributors** should use [docs/external/](../external/). **Consumers** of the package should use the [component docs](../) in the parent `docs/` folder.

> These files are **not private**: `npm run release:public` publishes a snapshot of the whole tree, `docs/internal/` included, to the public repo's **releases** branch. Never put tokens, credentials or customer details here.

- **Private repo (development):** [Internal-IPA-UI](https://github.com/Invicara/Internal-IPA-UI)
- **Public repo (releases):** [Twinit-IPA-UI](https://github.com/Invicara/Twinit-IPA-UI) (releases on the **releases** branch)

## Contents

| Doc | Description |
|-----|-------------|
| [component-sources.md](component-sources.md) | Radix-first / shadcn-second policy for new primitives, and which library each component wraps (Radix, cmdk, react-day-picker, TanStack Table, etc.). |
| [table-plan.md](table-plan.md) | tablecn gap analysis, phases, and upstream sync for Table. |
| [git-flow.md](git-flow.md) | Branching and release process: NEXT-RELEASE, STAGING, master, feature branches, release candidates, hotfixes, and the git remotes (`Private`, `Public`). |
| [publishing.md](publishing.md) | Release checklist: version suggestion, changelog, tests, `npm version`, publishing to GitHub Packages, and syncing to the public repo's **releases** branch. |
