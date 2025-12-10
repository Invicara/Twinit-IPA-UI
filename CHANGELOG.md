# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1-0] - 2025-10-31

### Added
- Initial project setup and configuration
- Package structure with TypeScript support
- Storybook integration for component documentation and development
- Testing setup with Jest and React Testing Library
- Rollup build configuration for package publishing
- Tailwind CSS integration with DaisyUI
- Radix UI components integration as primitives
- Initial set of UI components:
  - Accordion component with Storybook stories
  - Breadcrumb component with Storybook stories
  - Button component with tests and Storybook stories
  - Checkbox component with Storybook stories
  - Dialog component with Storybook stories
  - Dropdown component (70% complete) with custom icon import functionality
  - Input component with tests and Storybook stories
  - Link component with tests and Storybook stories
  - Radio Group component with tests and Storybook stories
  - Slider component with tests and Storybook stories
- Custom X Icon component
- Icon library support (Lucide React, Radix UI Icons)
- Dropdown component features:
  - Custom icon import functionality
  - Parameterised theme/behaviour options
  - Basic dropdown functionality

### Changed
- Component scaffolding and code structure (initially unfinished, later refined)

### Fixed
- Fixed rollup configuration to allow publishing the package

## [1.0.1-1] - 2025-12-10

### Added
- Remix Icons support and integration
- Detailed tests for components
- Comprehensive documentation
- Dropdown component progress to 90% completion
- New structure for swappable styles
- Customized dropdown theme example
- Atomic behavioural props fully customizable via simple booleans
- Dropdown component enhancements:
  - Refactored base & variants structure
  - Filter mode functionality
  - Keyboard navigation support
  - Ellipsis handling for long text
  - Enhanced theme customization capabilities
  - PopAbove functionality

### Changed
- All components now use generic 'brand' colours, customizable by developers
- Defaults to digitaltwin brand colours
- Refactored dialog component with new code structure
- Improved dialog component with tweaks and enhancements

### Fixed
- Fixed double chevron bug after popAbove feature was added
- Removed storybook-static from Git tracking
- Removed tailwind output file from Git tracking

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