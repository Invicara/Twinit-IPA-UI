# Publishing (internal developers)

This package is published to **GitHub Packages**. Follow these steps to publish a new version. Ensure the release has gone through the [git flow](git-flow.md) (STAGING → PRODUCTION) before publishing.

## Quick steps

```bash
npm login --registry=https://npm.pkg.github.com --scope=@invicara
npm version patch   # or minor / major
# Update CHANGELOG.md with your changes
npm publish
```

You need a GitHub Personal Access Token with `write:packages` (create at https://github.com/settings/tokens).

## Prerequisites

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

## Publishing steps

1. **Breaking changes:** Run `npm run release:breaking` to list commits since the last tag that contain breaking changes (`feat!:` / `fix!:` or `BREAKING CHANGE:` footer). Use the output to draft the "Breaking" subsection in CHANGELOG and to decide version bump: **major** if there are breaking changes, otherwise minor/patch per semver.
2. **Version:** `npm version patch|minor|major` (updates `package.json`, creates commit and tag).
3. **CHANGELOG:** Document changes in `CHANGELOG.md` (Keep a Changelog format).
4. **Build:** `npm run build` (runs automatically via `prepublishOnly`). Produces `dist/cjs/`, `dist/esm/`, types, CSS.
5. **Publish:** `npm publish`. Publishes to GitHub Packages; only `dist/`, `README.md`, `LICENSE` are included (see `package.json` `files`).
6. **Verify:** `npm view @invicara/ipa-ui versions` or https://github.com/Invicara/Twinit-IPA-UI/packages.

## Installing the published package (consumers)

Consumers need `.npmrc` with `@invicara:registry` and `//npm.pkg.github.com/:_authToken`, then `npm install @invicara/ipa-ui`.

## Troubleshooting

- **Auth errors:** Check token has `write:packages` and `.npmrc` is correct.
- **Build failures:** Run `npm run build` manually for full errors.
- **Version exists:** Bump again (patch/minor/major).
- **Scope:** Package name must be exactly `@invicara/ipa-ui`.
