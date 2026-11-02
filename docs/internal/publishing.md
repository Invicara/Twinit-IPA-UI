# Publishing (internal developers)

This package is published to **GitHub Packages**. Development happens in the **private** repo [Internal-IPA-UI](https://github.com/Invicara/Internal-IPA-UI); releases are synced to the **public** repo [Twinit-IPA-UI](https://github.com/Invicara/Twinit-IPA-UI) on the **releases** branch. Follow these steps to publish a new version.

Where you publish from depends on what you are publishing, per the [git flow](git-flow.md):

| Publishing | Branch | npm dist-tag |
|---|---|---|
| **Prerelease / release candidate** (`2.0.0-1`) | **STAGING** | `staging` |
| **Full release** (`2.0.0`) | **master**, after STAGING → master | `latest` |

A prerelease does **not** go through master. Release candidates are tagged and published from STAGING; only full releases are promoted to master and published as `latest`.

## Quick steps

```bash
npm login --registry=https://npm.pkg.github.com --scope=@dtplatform

# Prerelease, from STAGING
npm version prerelease          # 2.0.0-0 -> 2.0.0-1
# Update CHANGELOG.md with your changes
npm publish --tag staging --@dtplatform:registry=https://npm.pkg.github.com

# Full release, from master
npm version patch               # or minor / major
npm publish --@dtplatform:registry=https://npm.pkg.github.com
```

Both flags are required. See [Two flags you cannot omit](#two-flags-you-cannot-omit).

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
2. **npm auth:**
  ```bash
   npm login --registry=https://npm.pkg.github.com --scope=@dtplatform
  ```
   Use your GitHub username and the token as password. Or set `~/.npmrc`:

## Publishing steps

1. **Suggested version:** Run `npm run version:suggest` (dry-run). It analyzes conventional commits since the last tag and suggests the next stable version: **major** if any breaking changes, **minor** if any `feat` (and no breaking), **patch** otherwise. With no commits since last tag it suggests "No release". Use the output to run `npm version major|minor|patch` in the next step.
2. **CHANGELOG:** Run `npm run changelog:update` to update the changelog. The script never edits existing entries for tagged (full-release) versions; it only (a) adds missing entries for tags that don’t yet have a changelog entry (between the first release in the changelog and the latest tag), and (b) creates or refreshes a single “next” entry (Unreleased or the next version) from commits since the last tag (conventional commits → Added / Changed / Fixed / Breaking). Only full-release tags (e.g. `1.1.1`) are considered; prerelease tags (e.g. `1.1.1-0`) are ignored. Optionally pass the next version: `npm run changelog:update -- 1.0.4`; otherwise the script uses the version in `package.json` (or “Unreleased” if that matches the latest tag). Edit `CHANGELOG.md` by hand if you need to adjust wording or add items.
3. **Version:** `npm version prerelease` for a release candidate on STAGING, or `npm version patch|minor|major` for a full release on master (updates `package.json`, creates commit and tag).
4. **Build:** `npm run build` (runs automatically via `prepublishOnly`). Produces `dist/cjs/`, `dist/esm/`, types, CSS.
5. **Publish:** `npm publish --tag staging --@dtplatform:registry=https://npm.pkg.github.com` for a prerelease, or the same without `--tag` for a full release. Both flags matter, see [Two flags you cannot omit](#two-flags-you-cannot-omit). Only `dist/`, `README.md` and `LICENSE` are included (see `package.json` `files`).
6. **Sync to public repo (full releases only):** Prereleases are not synced to the public repo. For a full release, from `master` (clean working tree), run `npm run release:public`. This publishes a **squashed release snapshot** to the **releases** branch of [Twinit-IPA-UI](https://github.com/Invicara/Twinit-IPA-UI): it creates a single commit whose tree is an exact snapshot of `master` at this version, parented on the current public `releases` tip, and pushes it (fast-forward, no force). The public repo gets exactly **one clean commit per release** (`chore(release): v<version>`, version read from `package.json`) and **never receives internal commit history**.

   > ⚠️ Do **not** `git merge master` into `releases` anymore — that merge is what dragged the entire internal history onto the public repo. The existing (already-published) history is left as-is to avoid breaking release links; from now on every new release adds just one squashed commit on top. Preview first with `npm run release:public -- --dry-run`.
7. **Verify:** `npm view @dtplatform/ipa-ui versions` or the [package page](https://github.com/Invicara/Twinit-IPA-UI/packages) on GitHub Packages.

## Installing the published package (consumers)

Consumers need `.npmrc` with `@dtplatform:registry` and `//npm.pkg.github.com/:_authToken`, then `npm install @dtplatform/ipa-ui`.

## Troubleshooting

- **Auth errors:** Check token has `write:packages` and `.npmrc` is correct.
- **Build failures:** Run `npm run build` manually for full errors.
- **Version exists:** Bump again (patch/minor/major).
- **Scope:** Package name must be exactly `@dtplatform/ipa-ui`.

