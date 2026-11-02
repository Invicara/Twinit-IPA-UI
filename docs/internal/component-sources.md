# Component sources

When adding or updating UI primitives in `@dtplatform/ipa-ui`, follow this order:

1. **Radix UI first:** if Radix publishes a primitive for the use case, wrap and style that (e.g. `@radix-ui/react-popover`, `@radix-ui/react-dropdown-menu`).
2. **shadcn/ui second:** when Radix has no equivalent, port the [shadcn/ui](https://ui.shadcn.com) registry implementation and adapt it to IPA conventions (CSS modules, design tokens, `styleOverrides`, existing Button/Input shells).
3. **Direct library only when required:** some shadcn components compose a headless library underneath. Keep that dependency, but still start from the shadcn registry file rather than inventing a one-off wrapper.

## IPA adaptations (all sources)

- No Tailwind in ipa-ui: translate shadcn class strings into CSS modules + tokens. `cn()` in `src/lib/utils.tsx` is plain `clsx` (no `tailwind-merge`); slot overrides go through `mergeStyles(styles, styleOverrides)`.
- Reuse existing IPA components (`Button`, `Input`, `Popover`, etc.) inside ported shadcn files.
- Preserve `styleOverrides`, `data-testid` prefixes (`ipa_*`), and Storybook/docs patterns used elsewhere in this repo.

## Current components

| Component | Source | Notes |
|-----------|--------|-------|
| Popover | Radix `@radix-ui/react-popover` | Direct Radix wrapper |
| DropdownMenu | Radix `@radix-ui/react-dropdown-menu` | Direct Radix wrapper |
| Dialog | Radix `@radix-ui/react-dialog` | Acknowledgment "OK" footer uses IPA `Button` |
| Accordion, Checkbox, RadioGroup, Slider, Separator | Radix (`react-accordion`, `react-checkbox`, `react-radio-group`, `react-slider`, `react-separator`) | Direct Radix wrappers |
| Button, Breadcrumb (`BreadcrumbLink`) | Custom, with Radix `@radix-ui/react-slot` for `asChild` | |
| Command | shadcn + `cmdk` | Radix has no command palette |
| **Calendar** | shadcn + `react-day-picker` | Radix has no calendar; port of [shadcn Calendar](https://ui.shadcn.com/docs/components/radix/calendar) |
| **DatePicker**, **DateRangePicker** | shadcn composition | Popover + Calendar (+ `date-fns` for formatting); see [shadcn Date Picker](https://ui.shadcn.com/docs/components/radix/date-picker) |
| SingleSelect, MultiSelect | Custom | Positioned with `@floating-ui/react`; not Radix Select |
| Table | [tablecn](https://github.com/sadmann7/tablecn) style on `@tanstack/react-table` | Column reordering with `@dnd-kit`; see [table-plan.md](table-plan.md) |
| Input, Link, Badge | Custom | No headless library |

## Calendar / DatePicker specifically

Radix does not ship a calendar. Our `Calendar` follows the shadcn registry pattern (`DayPicker`, `getDefaultClassNames`, custom `DayButton` component `CalendarDayButton`). Unlike shadcn, `CalendarDayButton` renders a native `<button>` styled by `calendar.module.css` (with `data-*` state attributes), not the IPA `Button`. `DatePicker` and `DateRangePicker` are the documented shadcn composition: `Popover` trigger (an IPA `Button`) + `Calendar` in `PopoverContent`.

When syncing from upstream, diff shadcn's `calendar.tsx` registry file and re-apply IPA styling rather than replacing our CSS module approach with Tailwind.
