# Internal documentation (internal developers only)

This folder is for **internal team** only. It covers release flow, publishing, and implementation details that are not published or shared with external contributors. **External contributors** should use [docs/external/](../external/). **Consumers** of the package should use the [component docs](../) in the parent `docs/` folder.

- **Private repo (development):** [Internal-IPA-UI](https://github.com/Invicara/Internal-IPA-UI)
- **Public repo (releases):** [Twinit-IPA-UI](https://github.com/Invicara/Twinit-IPA-UI) (releases on the **releases** branch)

## Contents

| Doc | Description |
|-----|-------------|
| [git-flow.md](git-flow.md) | Branching and release process: NEXT-RELEASE, STAGING, master, feature branches, release candidates, hotfixes. |
| [publishing.md](publishing.md) | How to publish the package to GitHub Packages and sync to the public repo’s **releases** branch. |
