# Git flow (internal developers)

This document describes the branching and release process for **internal** development of `@dtplatform/ipa-ui`. Development happens in the **private** repo [Internal-IPA-UI](https://github.com/Invicara/Internal-IPA-UI); the **public** repo [Twinit-IPA-UI](https://github.com/Invicara/Twinit-IPA-UI) receives releases on its **releases** branch. The long-lived branches in the private repo are **NEXT-RELEASE** (develop), **STAGING** (pre-production testing), and **master** (releases). Feature work and hotfixes follow the patterns below.

## Git remotes

A standard checkout has two remotes, and the commands in these docs use these names (not `origin`):

| Remote | Repo | Used for |
|--------|------|----------|
| **`Private`** | `git@github.com:Invicara/Internal-IPA-UI.git` | All development branches and tags |
| **`Public`** | `git@github.com:Invicara/Twinit-IPA-UI.git` | Only written by `npm run release:public` (branch **releases**) |

Check yours with `git remote -v`. If your remote for Internal-IPA-UI has another name, substitute it. `Public` is the name `npm run release:public` expects (`twinitPublish.remote` in `package.json`):

```bash
git remote add Public git@github.com:Invicara/Twinit-IPA-UI.git
```

## Commit message format

We use **Conventional Commits**; [commitlint](https://commitlint.js.org/) runs on every commit (husky `commit-msg` hook). Rules from `commitlint.config.js`:

- Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`. Anything else (e.g. `build:`, `revert:`) is rejected; the default `Revert "..."` message from `git revert` is ignored.
- Subject at most 72 characters.
- Breaking changes: `feat!:` or `fix(scope)!:` in the subject, or a footer line `BREAKING CHANGE: description`.
- Merge commits (messages starting with `Merge `) are ignored, as are the bare-version commits `npm version` creates (e.g. `2.0.0`).

At release time, run `npm run version:suggest` to get the suggested next version (see [publishing.md](publishing.md)).

## Branch roles

| Branch | Role | Purpose |
|--------|------|---------|
| **NEXT-RELEASE** | Develop | Integration branch. All feature work merges here first. |
| **STAGING** | Pre-production | Test the next release. Release candidates are versioned and tagged here (e.g. `v2.0.1-0`, `v2.0.1-1`) and published with the `staging` dist-tag. |
| **master** | Production | Live releases only. Final versions are tagged here (e.g. `v2.0.1`). |

---

## Feature work (normal development)

1. **Branch from NEXT-RELEASE**
   Use a descriptive branch name:
   - `feature/short-description` (e.g. `feature/docs-component-docs`)
   - `fix/short-description`
   - `docs/short-description`

2. **Develop and commit**
   Work on your branch, following the [commit message format](#commit-message-format).

3. **Merge into NEXT-RELEASE**
   Open a PR into **NEXT-RELEASE**. Do not merge feature branches directly into STAGING or master.

```
feature/xyz  ──►  NEXT-RELEASE
```

---

## Preparing a release (NEXT-RELEASE → STAGING → master)

### 1. Promote to STAGING

When NEXT-RELEASE is ready for QA, **merge NEXT-RELEASE into STAGING**.

### 2. Release candidates on STAGING

Create each release candidate with `npm version prerelease` on STAGING. It bumps `package.json`, commits and creates the `v<version>` tag in one step (no manual `git tag`); then publish it with the `staging` dist-tag (see [publishing.md](publishing.md)).

- First candidate after `2.0.0`: `v2.0.1-0`.
- If QA finds issues: fix them in `fix/...` branches PR'd into **STAGING**, then cut the next candidate: `v2.0.1-1`, `v2.0.1-2`, etc.

Use a **new version per build** so you keep a clear history of what was tested.

```bash
# On STAGING
npm version prerelease -m "chore(release): %s"   # 2.0.0 -> 2.0.1-0, commit + tag v2.0.1-0
git push Private STAGING v2.0.1-0
```

### 3. Promote to master

When QA signs off on a release candidate (e.g. `v2.0.1-2`):

1. **Fast-forward master to STAGING:**

   ```bash
   git checkout master
   git pull Private master
   git merge --ff-only STAGING
   ```

2. **Release from master** following [publishing.md](publishing.md): changelog entry, `npm test`, `npm version 2.0.1` (commit + `v2.0.1` tag, no suffix), push master and the tag to `Private`, `npm publish`, then `npm run release:public` to sync the **releases** branch of the [public repo](https://github.com/Invicara/Twinit-IPA-UI).

3. **Fast-forward STAGING to master** so STAGING contains the release commit and the next `npm version prerelease` bumps from the released version:

   ```bash
   git checkout STAGING
   git merge --ff-only master
   git push Private STAGING
   ```

```
NEXT-RELEASE  ──►  STAGING (v2.0.1-0, v2.0.1-1, …)  ──ff──►  master (v2.0.1)  ──ff──►  STAGING
```

---

## Hotfixes (production-only fixes)

When a critical fix is needed on master without waiting for the next full release:

1. **Branch from master**
   Name: `hotfix/short-description`
   Example: `hotfix/critical-dialog-crash`

2. **Make the fix and test**
   Commit only the minimal change needed, and run `npm test`.

3. **Merge back**
   - Merge **hotfix** into **master** and release it as a new version following [publishing.md](publishing.md) (e.g. `v2.0.0` → `v2.0.1` with `npm version patch`).
   - Merge **hotfix** into **NEXT-RELEASE** so the fix is not lost in the next release.
   - Optionally merge into **STAGING** so staging stays aligned.

```
master  ──►  hotfix/xyz  ──►  master (tag)
                    │
                    └──────────►  NEXT-RELEASE  (and optionally STAGING)
```

---

## Summary diagram

```
feature/*  ──►  NEXT-RELEASE  ──►  STAGING (RC tags: v2.0.1-0, -1, …)  ──►  master (v2.0.1)
                   ▲                    ▲                      ▲
                   │                    │                      │
hotfix/*  ────────┴────────────────────┴──────────────────────┘
```

- **Feature work:** always via NEXT-RELEASE, then STAGING, then master.
- **Release candidates:** `npm version prerelease` on STAGING; iterate (-0, -1, …) until QA passes.
- **Final release:** fast-forward master to STAGING, tag `v2.0.1` (no suffix) with `npm version`, publish, then fast-forward STAGING back to master.
- **Hotfixes:** branch from master, merge back to master and NEXT-RELEASE (and optionally STAGING).
