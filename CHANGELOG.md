# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-11-02

First stable 2.x release. It contains everything listed under [2.0.0-0] and [2.0.0-1] below (including the breaking Dropdown prop changes and the Tailwind removal), plus the fixes from the release-candidate QA round.

### Fixed

- **Dropdown**: navigation keys are now disabled when keyboard navigation is turned off, in both single- and multi-select (IPAUI-69, IPAUI-70).
- **Table filters**: typed dates in the filter menu are parsed, and date-only ISO strings are read as local midnight rather than UTC.
- **Table filters**: single-date filtering works; numeric range input accepts negative numbers and a single value (converted to a range), and the label reads "to".
- **Table filters**: role filter is case-insensitive, its counts update when pagination settings change, and an unparsable filter returns an empty table instead of erroring.
- **Table filters**: "Full-Time" checkbox filter matches full-time rows; label search tolerance tuned for the filter menu, faceted filter and advanced-sort column search.
- **Table sorting**: a third click on a column header clears the sort.
- **Table**: loading skeleton is stable and visually consistent across columns, selection, pagination and filters.
- **Popover**: content opening above its trigger is no longer truncated.
- **Link**: only the inline variant is underlined.
- **Storybook**: column-visibility controls reset correctly, the broken pie filter story was replaced with a year toggle, and textarea controls work around a Storybook special-character bug.

### Changed

- Node 22.23.4 pinned for Cloudflare Pages Storybook builds.
- Publishing docs corrected: release branch per release type, and the two flags `npm publish` needs.


## [2.0.0-1] - 2026-09-11

### Security

- Resolved all outstanding dependency advisories (25 `npm audit` findings: 14 high, 8 moderate, 3 low), all in `devDependencies`. The production dependency tree was and remains clean, and the published package ships only `dist/`.
- **@rollup/plugin-terser** `^0.4.4` -> `^1.0.0`, pulling patched `serialize-javascript` 7.1.1 (GHSA-5c6j-r48x-rmvq, GHSA-qj8w-gfj5-8c6v).
- Added a scoped `overrides` entry pinning `uuid` to `^11.1.1` under `@storybook/addon-actions` (GHSA-w5hq-g745-h8pq), avoiding the Storybook downgrade npm suggested.
- Transitive patches for `postcss`, `lodash`, `ws`, `svgo`, `js-yaml`, `nanoid`, `qs`, `yaml`, `brace-expansion`, `form-data`, `flatted`, `fast-uri`, `browserslist`, `picomatch`, `colord` and the Babel toolchain.


## [2.0.0-0] - 2026-09-11

### Breaking

- **Dropdown**: prop changes - `disableClickOutside`, `disableIconAnimation`, `enableLongTextAnimation`, `openOnFocus`; keybindings updated.
- **Storybook controls**: expanded controls & argTypes across components (unstable API surface).
- Tailwind fully removed from the build; Node 20 requirement dropped, resulting artifacts fixed.

### Added

- **Table**: new component built on TanStack Table - sorting, advanced multi-sort with drag & drop, column drag/resize/ordering, row selection, pagination, loading skeleton.
- **Table**: filter set - checkbox, faceted, date, rating and slider filters, plus a filter menu and reset control.
- **Table**: server mode with OData query building and URL search-param parsing/state sync.
- **Table**: composable feature hooks (`withSorting`, `withFiltering`, `withPagination`, `withSelection`, `withResizing`, `withColumnOrder`, client/server mode) and control hooks.
- New components: **Badge**, **Calendar** / date picker, **Command**, **Dropdown Menu**, **Popover**, **Separator**.
- Docs for the table and calendar components, plus internal component-source notes.
- `release:public` script that publishes squashed release snapshots to the public repo.

### Changed

- Removed Tailwind CSS, DaisyUI, and `tailwind-merge` from the build. Global styles are plain CSS compiled with PostCSS (`postcss-preset-env`, `autoprefixer`). Use `npm run build:css` / `npm run watch:css` instead of Tailwind CLI.
- `cn()` now uses `clsx` only (no Tailwind-aware class deduplication).
- **Storybook**: pin `storybook` and all `@storybook/*` devDependencies to **8.6.18** so addons match core (removes version-mismatch warnings).
- **Dropdown**: portaled list popup `max-height` is capped to the scroll row cap plus footer (not the full viewport), so the open list matches the intended compact height after Floating UI `size()`.
- **Dropdown**: default `maxVisibleOptions` is now **8** (was 10).

### Removed

- `tailwind.config.js`, `@tailwindcss/*`, `tailwindcss`, `daisyui`, `tailwindcss-animate`, `tailwind-merge`.


## [1.1.6-0] - 2026-04-16

### Breaking
- dropdown converted, styleOverrides pattern, docs refined, added standard attribs
- all but dropdown converted, missing tests added, bug fixing, renaming things
- first 2 comps remove tailwind, use data-state, cleanup props
### Changed
- 1.1.5-0
- generated v1.1.5 changelog
- Merge pull request #3 from Invicara/remove-tailwind-refactor
- Merge remote-tracking branch 'origin/master' into remove-tailwind-refactor
### Fixed
- portal + Floating UI for dropdowns (DBM-4722)



## [v1.1.5] - 2026-03-13

### Changed
- **Dropdown** (`SingleSelect` / `MultiSelect`): options list is portaled and positioned with `@floating-ui/react` (flip, shift, size) so it is not clipped by `overflow` ancestors; optional `portalContainer` and `floatingZIndex`; `popAbove` is now a placement preference with automatic flip; `data-position` on the listbox reflects the resolved side after flip.
- **Dropdown**: optional `maxVisibleOptions` (default `10`, or `false` for no row cap before scrolling) limits list height before the options area scrolls.

### Breaking
- dropdown converted, styleOverrides pattern, docs refined, added standard attribs
- all but dropdown converted, missing tests added, bug fixing, renaming things
- first 2 comps remove tailwind, use data-state, cleanup props
### Changed
- Merge pull request #3 from Invicara/remove-tailwind-refactor
- Merge remote-tracking branch 'origin/master' into remove-tailwind-refactor



## [1.1.4] - 2026-03-09

### Fixed
- drop darwin-arm64 oxide dep to fix Cloudflare (Linux x64) build



## [1.1.3] - 2026-02-26

### Changed
- 1.1.3
- 1.1.3-0
- fixed tailwind optional dependencies



## [1.1.2] - 2026-02-26

### Changed
- updated change:update script to avoid rewriting old entries
- lockfile updated to use @dtplatform
- adding missing 1.1.1 in changelog


## [1.1.1] - 2026-02-26

### Changed
- use @dtplatform registry, master branch, and add beta disclaimer
- document release sync (master→releases) and add repo links



## [1.1.0] - 2026-02-24

### Added
- add optional version arg to changelog:update
- run changelog update before npm version
- split docs into external and internal, add git-flow and publishing
- add component user docs and internal/ for library developers
### Changed
- updated package registry to dtplatform
- replace release:breaking with version:suggest
- add changelog:update script and document in publishing
- add commitlint, husky, and release:breaking script



## [1.0.3] - 2026-02-18

### Added
- Added missing cutomClassName slot for single-select



## [1.0.2] - 2026-02-18

### Added
- Added portal container for dialog
- Documented new styling customization process

### Changed
- Using data attribute to scope invicara theme + putting output.css in final build
- Removing layers everywhere
- Removed button styling from layer to try if it stops getting overridden by external ui libs
- chore(dialog): remove redundant comment, already documented in dialog-animations.md

### Fixed
- resolve double vertical offset caused by translate + transform composition
- Fixed button's export


## [1.0.1] - 2026-02-03

### Added
- update all stories with explicit props

### Changed
- Moved styling to CSS modules
- Changed className strategy to wrap utility classes in a single semantic class per element
- Updated rollup to include css in packaged lib
- css modules: dropdown only. also some updates to filter keyboard actions.
- Updated publishing documentation
- Removed extract from rollup to attempt fixing missing css

### Fixed
- fix storybook props connection
- Fixed the dialog's animation
- Removed empty index.css
- Fixed tests
- Fixed issue with dropdown container not being the same size as trigger
- Fixed a couple of issues with missing utility classes due to the change from in-js utilities to in-css

---

## Component Status

### Components Included in v1.0.1-1
- **Accordion** - Fully implemented with Storybook stories
- **Breadcrumb** - Fully implemented with Storybook stories
- **Button** - Fully implemented with tests and Storybook stories
- **Checkbox** - Fully implemented with Storybook stories
- **Dialog** - Fully implemented with tests, stories, and refactored structure
- **Dropdown** - ~90% complete with single-select, multi-select, keyboard navigation, filtering, theme customization, and popAbove functionality
- **Input** - Fully implemented with tests and Storybook stories
- **Link** - Fully implemented with tests and Storybook stories
- **Radio Group** - Fully implemented with tests and Storybook stories
- **Slider** - Fully implemented with tests and Storybook stories

### Icons
- **X Icon** - Custom icon component
- **Lucide React** - Icon library support
- **Radix UI Icons** - Icon library support
- **Remix Icons** - Icon library support added

---

## Development Notes

- Project uses Storybook for component documentation and development
- Testing framework: Jest with React Testing Library
- Build tool: Rollup
- Styling: CSS modules + design tokens in `globals.css`, built with PostCSS (no Tailwind)
- Component library: Radix UI primitives