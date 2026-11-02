# Table implementation plan

Internal roadmap for bringing [tablecn](https://github.com/sadmann7/tablecn)–style tables into `@dtplatform/ipa-ui`.

**Public API (2.0):** compound `Table` context root with parts (`Table.Frame`, `Table.Toolbar`, `Table.Search`, `Table.Filters`, `Table.FilterMenu`, `Table.SortList`, `Table.ViewOptions`, `Table.Grid`, `Table.Pagination`, `Table.Footer`); `useTable({ features: [withX()] })`; query state hooks (`useTableQueryState`, `useTableQuerySearchParams`); control hooks; HTML primitives `TableRoot`, `TableHeader`, … Consumer reference: [`docs/table.md`](../table.md).

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
| `command` | **Added** | `Command`: filter menu |
| `calendar` | **Added** | `Calendar`: date filters |
| `sortable` / `faceted` | **Added** | Column header menu, sort list and column reorder (`@dnd-kit`), faceted/date/slider/rating/checkbox filters |

---

## Phase 1: Done

Core table, pagination, toolbar, sort/hide column header menu, Storybook, tests, `docs/table.md`.

---

## Phase 2: Done (shipped in 2.0.0)

**Track A:** Popover, Badge, Separator, DropdownMenu, Command, Calendar; full `TableColumnHeader` menu (`variant="menu"`); `TableFacetedFilter`, `TableDateFilter`, `TableSliderFilter`, `TableRatingFilter`, `TableCheckboxFilter`; Filter menu with chips and typed-value parsing; `TableSkeleton` / loading and fetching states; range column story; filter component tests.

**Track B:** `TableSortList` (multi-sort, drag reorder); `TableViewOptions`; operator config (`tableConfig`); URL state shipped as `useTableQuerySearchParams` (replaces the planned `useTableUrlState`).

**Server track:** `TableQueryParams` + parsers/serializers; `withServerMode`; `useTableQueryState`; `useTableQuerySearchParams` URL adapter with flat filter encoding. Output is a typed params object for the consumer's own fetch (no OData or other backend query building).

**2.0 API rework:** compound parts under a context `Table`; feature slices (`withSorting`, `withFiltering`, `withPagination`, `withSelection`, `withResizing`, `withColumnOrder`, `withClientMode`, `withServerMode`) replacing the old `useTable` flags (now ignored with a dev warning); per-column filter hot-swap (`meta.filter`, `Table.Filters components`); control hooks.

**Layout:** table sources grouped under `toolbar/`, `filters/`, `columns/`, `features/`, `controls/`, `pagination/`, `skeleton/`, `query/`, `primitives/`; public exports via `table/index.ts`.

---

## Open

- **Advanced filter list** (tablecn `data-table-filter-list`): per-row operator UI and `joinOperator` UI. The operator lists and `setJoinOperator` exist, but built-in controls only produce default operators (plus `gte` for rating).
- **Filter value bugs:** `number` variant writes a string but its client `filterFn` is `tableRangeFilterFn` (expects `[min, max]`), so client `number` filters match no rows; `parseRangeMenuValue` in `filters/filter-menu.tsx` (from `0d7ad7a`) is unused, so the Filter menu range input lost minus-number and `to` support (likely a lost merge, like `1d6211c`).
- **Server params:** `fromTanStackState` infers operator/variant from the value shape, not column meta (`range` arrives as `variant: "dateRange"`; an open-ended date range `[fromMs, ""]` arrives as `inArray`).

---

## File layout

```
src/components/ui/table/          - Table feature
src/components/ui/dropdown-menu/  - column header menu
src/components/ui/popover/        - filter popovers, pickers
src/components/ui/badge/          - filter chips, count badges
src/components/ui/separator/      - toolbar / menu layout
```

---

## Upstream sync

Watch [tablecn](https://github.com/sadmann7/tablecn); diff registry `data-table` files; port logic; re-apply IPA styling; run tests + Storybook build.

**Known deviations:** query URL key `pageSize` (IPA) vs `perPage` (tablecn): same meaning; see `docs/table.md`.
