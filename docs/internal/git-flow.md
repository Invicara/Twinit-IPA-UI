# Git flow (internal developers)

This document describes the branching and release process for **internal** development of `@invicara/ipa-ui`. The long-lived branches are **NEXT-RELEASE** (develop), **STAGING** (pre-production testing), and **PRODUCTION** (releases). Feature work and hotfixes follow the patterns below.

## Commit message format

We use **Conventional Commits**; [commitlint](https://commitlint.js.org/) runs on every commit (via husky). Use types such as `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`. For breaking changes, use `feat!:` or `fix(scope)!:` in the subject, or a footer line `BREAKING CHANGE: description`. Merge commits are ignored. At release time, run `npm run release:breaking` to list breaking commits and update CHANGELOG (see [publishing.md](publishing.md)).

## Branch roles

| Branch | Role | Purpose |
|--------|------|---------|
| **NEXT-RELEASE** | Develop | Integration branch. All feature work merges here first. |
| **STAGING** | Pre-production | Test the next release. Tag release candidates here (e.g. `v1.0.4-0`, `v1.0.4-1`). |
| **PRODUCTION** | Production | Live releases only. Tag final versions here (e.g. `v1.0.4`). |

---

## Feature work (normal development)

1. **Branch from NEXT-RELEASE**  
   Use a descriptive branch name:
   - `feature/short-description` (e.g. `feature/docs-component-docs`)
   - `fix/short-description`
   - `docs/short-description`

2. **Develop and commit**  
   Work on your branch. Use **Conventional Commits**; commitlint enforces the format on every commit. For breaking changes, use `feat!:` or `fix(scope)!:` in the subject, or add a `BREAKING CHANGE:` footer. Merge commits are ignored by commitlint. At release time, run `npm run release:breaking` (see [publishing.md](publishing.md)) to list breaking changes for CHANGELOG and version bump.

3. **Merge into NEXT-RELEASE**  
   Open a PR (or merge) into **NEXT-RELEASE**. Do not merge feature branches directly into STAGING or PRODUCTION.

```
feature/xyz  ──►  NEXT-RELEASE
```

---

## Preparing a release (NEXT-RELEASE → STAGING → PRODUCTION)

### 1. Promote to STAGING

When NEXT-RELEASE is ready for QA:

- **Merge NEXT-RELEASE into STAGING** (or deploy STAGING from NEXT-RELEASE so STAGING reflects the release candidate).

### 2. Tag release candidates on STAGING

Tag **release candidates** on STAGING so QA and automation can point to a specific build:

- First candidate: `v1.0.4-0`
- If QA finds issues: fix on STAGING, then tag the next build: `v1.0.4-1`, `v1.0.4-2`, etc.

Use a **new tag per build** (e.g. `v1.0.4-0`, `v1.0.4-1`) so you keep a clear history of what was tested.

```bash
# On STAGING, after merging or deploying
git tag v1.0.4-0
git push origin v1.0.4-0
```

### 3. Promote to PRODUCTION

When QA signs off on a release candidate (e.g. `v1.0.4-2`):

1. **Merge STAGING into PRODUCTION.**
2. **Tag the final version** on PRODUCTION (no suffix):

   ```bash
   git checkout PRODUCTION
   git pull
   git tag v1.0.4
   git push origin v1.0.4
   ```

3. **Publish** the package (see [publishing.md](publishing.md)). Then sync the release to the **public** repo if you use a dual-repo release process.

```
NEXT-RELEASE  ──►  STAGING (v1.0.4-0, v1.0.4-1, …)  ──►  PRODUCTION (v1.0.4)
```

---

## Hotfixes (production-only fixes)

When a critical fix is needed on PRODUCTION without waiting for the next full release:

1. **Branch from PRODUCTION**  
   Name: `hotfix/short-description`  
   Example: `hotfix/critical-dialog-crash`

2. **Make the fix and test**  
   Commit only the minimal change needed.

3. **Merge back**  
   - Merge **hotfix** into **PRODUCTION** and tag the new version (e.g. `v1.0.3` → `v1.0.4`).
   - Merge **hotfix** into **NEXT-RELEASE** so the fix is not lost in the next release.
   - Optionally merge into **STAGING** so staging stays aligned.

```
PRODUCTION  ──►  hotfix/xyz  ──►  PRODUCTION (tag)
                    │
                    └──────────►  NEXT-RELEASE  (and optionally STAGING)
```

---

## Summary diagram

```
feature/*  ──►  NEXT-RELEASE  ──►  STAGING (RC tags: v1.0.4-0, -1, …)  ──►  PRODUCTION (v1.0.4)
                   ▲                    ▲                      ▲
                   │                    │                      │
hotfix/*  ────────┴────────────────────┴──────────────────────┘
```

- **Feature work:** always via NEXT-RELEASE, then STAGING, then PRODUCTION.
- **Release candidates:** tagged on STAGING; iterate with new tags (e.g. -0, -1) until QA passes.
- **Final release:** merge STAGING → PRODUCTION and tag `v1.0.4` (no suffix).
- **Hotfixes:** branch from PRODUCTION, merge back to PRODUCTION and NEXT-RELEASE (and optionally STAGING).
