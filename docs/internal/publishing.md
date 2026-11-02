# Publishing (internal developers)

This package is published to **GitHub Packages**. Development happens in the **private** repo [Internal-IPA-UI](https://github.com/Invicara/Internal-IPA-UI); releases are synced to the **public** repo [Twinit-IPA-UI](https://github.com/Invicara/Twinit-IPA-UI) on the **releases** branch. Follow these steps to publish a new version.

Where you publish from depends on what you are publishing, per the [git flow](git-flow.md):

| Publishing | Branch | npm dist-tag |
|---|---|---|
| **Prerelease / release candidate** (`2.0.0-1`) | **STAGING** | `staging` |
| **Full release** (`2.0.0`) | **master**, after STAGING → master | `latest` |

A prerelease does **not** go through master. Release candidates are tagged and published from STAGING; only full releases are promoted to master and published as `latest`.

Git commands below push to `Private`, the standard name of the remote for Internal-IPA-UI (see [git flow: Git remotes](git-flow.md#git-remotes)); substitute yours if it differs.

## Quick steps

```bash
# Prerelease, from STAGING (clean working tree)
npm test
# Add/update the CHANGELOG.md entry and commit it first: npm version needs a clean tree
npm version prerelease -m "chore(release): %s"   # 2.0.0 -> 2.0.1-0, commit + tag v2.0.1-0
git push Private STAGING v2.0.1-0
npm publish --tag staging --@dtplatform:registry=https://npm.pkg.github.com

# Full release, from master
git checkout master && git merge --ff-only STAGING
npm run version:suggest                 # dry run, prints the suggested version
npm run changelog:update -- 2.0.1       # then curate CHANGELOG.md by hand and commit it
npm test
npm version 2.0.1                       # commit "2.0.1" + tag v2.0.1
git push Private master v2.0.1
npm publish --@dtplatform:registry=https://npm.pkg.github.com
npm run release:public                  # squashed snapshot -> Public/releases
git checkout STAGING && git merge --ff-only master && git push Private STAGING
```

Both publish flags are required. See [Two flags you cannot omit](#two-flags-you-cannot-omit).

You need a GitHub Personal Access Token with `write:packages` (create at [https://github.com/settings/tokens](https://github.com/settings/tokens)).

## Two flags you cannot omit

**`--tag` is mandatory for a prerelease.** npm refuses outright:

```
npm error You must specify a tag using --tag when publishing a prerelease version.
```

This is a guard worth having: without it a prerelease would become `latest` and be served to
everyone running a plain `npm install @dtplatform/ipa-ui`. Use `--tag staging` for release
candidates, matching the existing `staging` dist-tag.

**`--@dtplatform:registry` is mandatory for every publish.** Developer machines set a scope-wide
*read* registry in `~/.npmrc`:

```
@dtplatform:registry=https://npm.twinit.dev/
```

`@scope:registry` outranks both `publishConfig.registry` in `package.json` **and** an explicit
`--registry` flag on the command line. So a plain `npm publish` targets npm.twinit.dev, which is
a read-through proxy you have no write token for, and fails with:

```
npm notice Publishing to https://npm.twinit.dev/ with tag staging
npm error code E401
npm error Unable to authenticate, your authentication token seems to be invalid.
```

The `E401` is misleading: the token is fine, the registry is wrong. Overriding the scope is the
only form that works:

```bash
npm publish --@dtplatform:registry=https://npm.pkg.github.com
```

Consumers still read from npm.twinit.dev, which proxies GitHub Packages, so a published version
shows up there without any extra step.

## Prerequisites

1. **GitHub token** with `write:packages`.
2. **npm auth for GitHub Packages:** add the token to `~/.npmrc`:
   ```
   //npm.pkg.github.com/:_authToken=<your token>
   ```
   Or run `npm login --registry=https://npm.pkg.github.com` (GitHub username, token as password). Do **not** add `--scope=@dtplatform` to the login: npm then rewrites `@dtplatform:registry` in `~/.npmrc` to GitHub Packages, replacing the npm.twinit.dev read registry described above.
3. **Git remotes:** `Private` (Internal-IPA-UI) and `Public` (Twinit-IPA-UI). `npm run release:public` fails if the `Public` remote is missing (name set in `package.json` `twinitPublish.remote`).

## Publishing steps

Full release, in order. For a prerelease, do steps 3 to 6 on STAGING with `npm version prerelease` and `--tag staging`, and skip the others.

1. **Promote:** on `master`, fast-forward to STAGING: `git merge --ff-only STAGING` (see [git flow](git-flow.md#3-promote-to-master)).
2. **Suggested version:** `npm run version:suggest` (dry run, changes nothing). It analyzes conventional commits since the nearest tag reachable from HEAD (`git describe --tags`) and suggests the next stable version: **major** if any breaking changes, **minor** if any `feat` (and no breaking), **patch** otherwise. Reverted commits and their reverts are not counted. With no commits since that tag it suggests "No release". Note that the nearest tag can be a release candidate: from `v2.0.1-0` it counts only the commits after that RC and bumps from `2.0.1`, so a fix-only range suggests `2.0.2`. In that case the final version is normally the RC's base version (`2.0.1`).
3. **CHANGELOG:** `npm run changelog:update -- <version>` (e.g. `-- 2.0.1`; without it the script uses the `package.json` version, or "Unreleased" if that equals the latest release tag). The script never edits existing entries for full-release tags. It (a) adds missing entries for full-release tags newer than the topmost versioned entry in `CHANGELOG.md`, and (b) creates or refreshes a single "next" entry dated today from **all commits since the latest full-release tag** (conventional commits: `feat`/`docs` → Added, `fix` → Fixed, `!` or `BREAKING CHANGE` → Breaking, everything else → Changed). Prerelease tags are ignored, so the next entry also repeats commits already listed under earlier RC entries.

   > The generated entry needs curating by hand: `git log` is run without `--no-merges`, and any subject that is not a conventional commit lands under **Changed** verbatim. That includes every `Merge pull request #…` / `Merge branch '…'` commit and the bare-version commits from `npm version` (e.g. `2.0.0-1`). Remove those, merge duplicates and reword before committing (e.g. `docs(changelog): add 2.0.1 entry`).
4. **Test:** `npm test` (Jest). Do not tag a release with failing tests.
5. **Version:** `npm version <version>` (e.g. `npm version 2.0.1`; `patch|minor|major` also work) for a full release, or `npm version prerelease -m "chore(release): %s"` for a release candidate on STAGING. It updates `package.json` and `package-lock.json`, commits, and creates the `v<version>` tag. It refuses to run on a dirty working tree, so commit the changelog first.
6. **Push and publish:** push the branch and the tag (`git push Private master v2.0.1`), then `npm publish --@dtplatform:registry=https://npm.pkg.github.com` for a full release, or `npm publish --tag staging --@dtplatform:registry=https://npm.pkg.github.com` for a prerelease. Both flags matter, see [Two flags you cannot omit](#two-flags-you-cannot-omit). `npm run build` runs automatically via `prepublishOnly` and produces `dist/cjs/`, `dist/esm/`, `dist/types.d.ts` and `dist/output.css`. The tarball contains `dist/`, `README.md` and `package.json` (`files` also lists `LICENSE`, but the repo has no LICENSE file).
7. **Sync to public repo (full releases only):** prereleases are not synced to the public repo. From `master` with a clean working tree, run `npm run release:public` (`scripts/sync-to-public.js`). It publishes a **squashed release snapshot** to the **releases** branch of [Twinit-IPA-UI](https://github.com/Invicara/Twinit-IPA-UI): it fetches `Public`, creates a single commit whose tree is an exact snapshot of the current `HEAD`, parented on the current `Public/releases` tip, and pushes it (fast-forward, no force). It also moves a local `releases` branch to that commit if you have one. The public repo gets exactly **one clean commit per release** (`chore(release): v<version>`, version read from `package.json`) and **never receives internal commit history**. The script does not check which branch you are on, so make sure it is `master` at the release commit; it refuses to run with a dirty tree or when `Public/releases` already has the same tree.

   > Do **not** `git merge master` into `releases`: that merge is what dragged the entire internal history onto the public repo. The existing (already-published) history is left as-is to avoid breaking release links; every new release adds just one squashed commit on top. Preview first with `npm run release:public -- --dry-run` (it still runs `git fetch Public`, but creates and pushes nothing). The snapshot is the whole tree, `docs/internal/` included.
8. **Back-merge:** fast-forward STAGING to master and push it (`git checkout STAGING && git merge --ff-only master && git push Private STAGING`), so the next `npm version prerelease` bumps from the released version.
9. **Verify:** `npm view @dtplatform/ipa-ui versions --@dtplatform:registry=https://npm.pkg.github.com` or the [package page](https://github.com/Invicara/Twinit-IPA-UI/packages) on GitHub Packages.

## Installing the published package (consumers)

Consumers normally read through npm.twinit.dev (`@dtplatform:registry=https://npm.twinit.dev/` plus Twinit credentials in `.npmrc`), which proxies GitHub Packages. Reading GitHub Packages directly needs `@dtplatform:registry=https://npm.pkg.github.com` and `//npm.pkg.github.com/:_authToken` instead. Then `npm install @dtplatform/ipa-ui`.

## Troubleshooting

- **Auth errors:** Check token has `write:packages` and `.npmrc` is correct.
- **Build failures:** Run `npm run build` manually for full errors.
- **Version exists:** Bump again (patch/minor/major).
- **Scope:** Package name must be exactly `@dtplatform/ipa-ui`.

