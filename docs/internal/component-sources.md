# Component sources

When adding or updating UI primitives in `@dtplatform/ipa-ui`, follow this order:

1. **Radix UI first** — if Radix publishes a primitive for the use case, wrap and style that (e.g. `@radix-ui/react-popover`, `@radix-ui/react-dropdown-menu`).
2. **shadcn/ui second** — when Radix has no equivalent, port the [shadcn/ui](https://ui.shadcn.com) registry implementation and adapt it to IPA conventions (CSS modules, design tokens, `styleOverrides`, existing Button/Input shells).
3. **Direct library only when required** — some shadcn components compose a headless library underneath. Keep that dependency, but still start from the shadcn registry file rather than inventing a one-off wrapper.

## IPA adaptations (all sources)

- No Tailwind in ipa-ui — translate shadcn class strings into CSS modules + tokens.
- Reuse existing IPA components (`Button`, `Input`, `Popover`, etc.) inside ported shadcn files.
- Preserve `styleOverrides`, `data-testid` prefixes (`ipa_*`), and Storybook/docs patterns used elsewhere in this repo.

## Examples

| Component | Source | Notes |
|-----------|--------|-------|
| Popover | Radix `@radix-ui/react-popover` | Direct Radix wrapper |
| DropdownMenu | Radix `@radix-ui/react-dropdown-menu` | Direct Radix wrapper |
| Command | shadcn + `cmdk` | Radix has no command palette |
| **Calendar** | shadcn + `react-day-picker` | Radix has no calendar; port [shadcn Calendar](https://ui.shadcn.com/docs/components/radix/calendar) |
| **DatePicker** | shadcn composition | Popover + Calendar — see [shadcn Date Picker](https://ui.shadcn.com/docs/components/radix/date-picker) |

## Calendar / DatePicker specifically

Radix does not ship a calendar. Our `Calendar` follows the shadcn registry pattern (`DayPicker`, `getDefaultClassNames`, custom `DayButton` using IPA `Button`). `DatePicker` and `DateRangePicker` are the documented shadcn composition: `Popover` trigger + `Calendar` in `PopoverContent`.

When syncing from upstream, diff shadcn's `calendar.tsx` registry file and re-apply IPA styling rather than replacing our CSS module approach with Tailwind.
