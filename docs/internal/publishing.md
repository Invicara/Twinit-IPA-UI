# Publishing (internal developers)

This package is published to **GitHub Packages**. Follow these steps to publish a new version. Ensure the release has gone through the [git flow](git-flow.md) (STAGING → master) before publishing.

## Quick steps

```bash
npm login --registry=https://npm.pkg.github.com --scope=@dtplatform
npm version patch   # or minor / major
# Update CHANGELOG.md with your changes
npm publish
```

You need a GitHub Personal Access Token with `write:packages` (create at https://github.com/settings/tokens).

## Prerequisites

1. **GitHub token** with `write:packages`.
2. **npm auth:**
   ```bash
   npm login --registry=https://npm.pkg.github.com --scope=@dtplatform
   ```
   Use your GitHub username and the token as password. Or set `~/.npmrc`:
   ```
   @dtplatform:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
   ```

## Publishing steps

1. **Suggested version:** Run `npm run version:suggest` (dry-run). It analyzes conventional commits since the last tag and suggests the next stable version: **major** if any breaking changes, **minor** if any `feat` (and no breaking), **patch** otherwise. With no commits since last tag it suggests "No release". Use the output to run `npm version major|minor|patch` in the next step.
2. **CHANGELOG:** Run `npm run changelog:update` to add or refresh the entry from commits since the last tag (conventional commits → Added / Changed / Fixed / Breaking). Optionally pass the next version so the entry uses it: `npm run changelog:update -- 1.0.4`. Otherwise the script uses the version in `package.json`. Edit `CHANGELOG.md` by hand if you need to adjust wording or add items.
3. **Version:** `npm version patch|minor|major` (updates `package.json`, creates commit and tag).
4. **Build:** `npm run build` (runs automatically via `prepublishOnly`). Produces `dist/cjs/`, `dist/esm/`, types, CSS.
5. **Publish:** `npm publish`. Publishes to GitHub Packages; only `dist/`, `README.md`, `LICENSE` are included (see `package.json` `files`).
6. **Verify:** `npm view @dtplatform/ipa-ui versions` or https://github.com/Invicara/Twinit-IPA-UI/packages.

## Installing the published package (consumers)

Consumers need `.npmrc` with `@dtplatform:registry` and `//npm.pkg.github.com/:_authToken`, then `npm install @dtplatform/ipa-ui`.

## Troubleshooting

- **Auth errors:** Check token has `write:packages` and `.npmrc` is correct.
- **Build failures:** Run `npm run build` manually for full errors.
- **Version exists:** Bump again (patch/minor/major).
- **Scope:** Package name must be exactly `@dtplatform/ipa-ui`.
