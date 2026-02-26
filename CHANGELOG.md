# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


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
- Styling: Tailwind CSS with DaisyUI
- Component library: Radix UI primitives