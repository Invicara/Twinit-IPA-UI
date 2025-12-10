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

---

## Component Status

### Components Included in v1.0.1-0
- **Accordion** - Implemented with Storybook stories
- **Breadcrumb** - Implemented with Storybook stories
- **Button** - Implemented with tests and Storybook stories
- **Checkbox** - Implemented with Storybook stories
- **Dialog** - Implemented with Storybook stories
- **Dropdown** - ~70% complete with custom icon import and theme/behaviour parameterisation
- **Input** - Implemented with tests and Storybook stories
- **Link** - Implemented with tests and Storybook stories
- **Radio Group** - Implemented with tests and Storybook stories
- **Slider** - Implemented with tests and Storybook stories

### Icons
- **X Icon** - Custom icon component
- **Lucide React** - Icon library support
- **Radix UI Icons** - Icon library support

---

## Development Notes

- Project uses Storybook for component documentation and development
- Testing framework: Jest with React Testing Library
- Build tool: Rollup
- Styling: Tailwind CSS with DaisyUI
- Component library: Radix UI primitives