# Table implementation plan

Internal roadmap for bringing [tablecn](https://github.com/sadmann7/tablecn)–style tables into `@dtplatform/ipa-ui`.

**Public API:** `Table`, `useTable`, `TableToolbar`, `TableColumnHeader`, `TablePagination`. HTML primitives: `TableRoot`, `TableHeader`, …

---

## Primitive gap analysis

| tablecn / shadcn primitive | IPA-UI status | Notes |
|----------------------------|---------------|-------|
| `table` | **Added** | `TableRoot`, … |
| `button`, `input`, `checkbox`, `dialog`, `slider` | **Exists** | |
| `dropdown` / `select` | **Partial** | `SingleSelect`; `DropdownMenu` added |
| `badge` | **Added** | `Badge` |
| `popover` | **Added** | `Popover` |
| `separator` | **Added** | `Separator` |
| `command` | **Added** | `Command` — filter menu |
| `calendar` | **Added** | `Calendar` — date filters |
| `sortable` / `faceted` | **Added** | Column header menu + faceted/date/slider filters |

---

## Phase 1 — Done

Core table, pagination, toolbar, sort/hide column header menu, Storybook, tests, `docs/table.md`.

---

## Phase 2 — In progress

**Done:** Popover, Badge, Separator, DropdownMenu, Command, Calendar; full `TableColumnHeader` menu (`variant="menu"`); `TableFacetedFilter`, `TableDateFilter`, `TableSliderFilter`, `TableFilterMenu`; toolbar column filters; filter component tests (Track A.1).

**Next (Track A):** range column story, `TableSkeleton`, docs polish. Then Track B: filter list, sort list, filter operators, `useTableUrlState`.

**Server track:** `TableQueryParams` + parsers (done); `useTable({ serverMode })` (done); `useTableQueryState` (done); `TableSkeleton` / loading + Server Mode story (done); `useTableQuerySearchParams` URL adapter with flat filter encoding (done).

**Layout:** table sources grouped under `toolbar/`, `filters/`, `columns/`, `pagination/`, `skeleton/`, `query/`, `primitives/` — public exports unchanged via `table/index.ts`.

---

## File layout

```
src/components/ui/table/          — Table feature
src/components/ui/dropdown-menu/  — column menus, future filter UI
src/components/ui/popover/        — filter popovers, pickers
src/components/ui/badge/          — filter chips (upcoming)
src/components/ui/separator/      — toolbar / menu layout
```

---

## Upstream sync

Watch [tablecn](https://github.com/sadmann7/tablecn); diff registry `data-table` files; port logic; re-apply IPA styling; run tests + Storybook build.

**Known deviations:** query URL key `pageSize` (IPA) vs `perPage` (tablecn) — same meaning; see `docs/table.md`.
