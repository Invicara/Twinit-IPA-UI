# Table

TanStack Table–powered data table for sortable, filterable, paginated lists. Built for `@dtplatform/ipa-ui` with CSS modules and `styleOverrides` (patterns adapted from [tablecn](https://github.com/sadmann7/tablecn)).

> **Work in progress:** Phase 1 — core table, toolbar, sortable headers, pagination, row selection. Advanced filters, column menus, and data grid features are planned. See [internal plan](internal/table-plan.md).

## Import

```tsx
import {
  Table,
  TableToolbar,
  TableColumnHeader,
  TablePagination,
  useTable,
  TableRoot,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@dtplatform/ipa-ui';
```

## Basic usage

```tsx
import type { ColumnDef } from '@tanstack/react-table';
import {
  Table,
  TableColumnHeader,
  TableToolbar,
  useTable,
} from '@dtplatform/ipa-ui';

type Person = { id: string; name: string; email: string };

const columns: ColumnDef<Person>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <TableColumnHeader column={column} label="Name" />,
  },
  { accessorKey: 'email', header: 'Email' },
];

function PeopleTable({ data }: { data: Person[] }) {
  const table = useTable({
    data,
    columns,
    initialState: { pagination: { pageSize: 10, pageIndex: 0 } },
    getRowId: (row) => row.id,
  });

  return (
    <Table table={table}>
      <TableToolbar table={table} />
    </Table>
  );
}
```

## Table props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `table` | `TanstackTable<TData>` | **required** | Instance from `useTable`. |
| `actionBar` | `ReactNode` | — | Shown when rows are selected (e.g. bulk delete). |
| `emptyMessage` | `string` | `'No results'` | Copy when the table has zero rows. |
| `showPagination` | `boolean` | `true` | Toggle pagination footer. |
| `pageSizeOptions` | `number[]` | `[5, 10, 20, 30, 50]` | Page size choices. |
| `styleOverrides` | `Record<string, string>` | — | Slot → class map for table and pagination. |
| `className` | `string` | — | Class on the outermost container. |
| `children` | `ReactNode` | — | Toolbar or other content above the grid (`TableToolbar`, etc.). |
| `isLoading` | `boolean` | `false` | Initial load — body shows `TableSkeleton`. |
| `isFetching` | `boolean` | `false` | Background refetch — keep rows, overlay + progress bar. |

## TableSkeleton

Placeholder body rows sized to visible columns / page size. Used automatically when `Table` has `isLoading`, or render yourself for custom layouts.

## TableToolbar

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `table` | `TanstackTable<TData>` | **required** | Same instance passed to `Table`. |
| `showGlobalFilter` | `boolean` | `true` | Show/hide the filter input. |
| `globalFilterPlaceholder` | `string` | `'Filter rows...'` | Input placeholder. |
| `showColumnFilters` | `boolean` | `false` | Render column filters from `meta.variant`. |
| `showFilterMenu` | `boolean` | `false` | Command-palette filter menu. |
| `children` | `ReactNode` | — | Actions aligned to the toolbar end. |

Column `meta.variant` values include `select`, `multiSelect`, `date`, `dateRange`, `range`, `number`, and `text`. Date columns use the shared [`DatePicker`](calendar.md) / `DateRangePicker` via `TableDateFilter`.

### Typed dates (Filter menu)

The right-aligned **Filter** menu parses free-typed dates for `date` and `dateRange` columns (same parsers as `parseTableDateInput` / `parseTableDateRangeInput`).

Numeric dates are **day-first (D-M-Y)**. Separators may be `-`, space, `.`, or `/`. Day and month may be one or two digits (`9` or `09`, `1` or `01`). Two-digit years map to 20xx (`23` → 2023).

| Input | Reads as |
|-------|----------|
| `14-11-2023` | 14 Nov 2023 |
| `14 11 2023` | 14 Nov 2023 |
| `14.11.2023` | 14 Nov 2023 |
| `14-11-23` | 14 Nov 2023 |
| `9-1-23` / `09.01.2023` | 9 Jan 2023 |

Named months and ISO also work: `Jan 12, 2023`, `12 Jan 2023`, `2023-01-12`.

**Ranges** — type two dates separated by ` - ` (spaces around the dash) or ` to `. Each side can use a different format:

```
14-07-23 - 17-9-2025
14.07.23 to 17 9 2025
```

A single date on a `dateRange` column filters that calendar day only. Text that cannot be parsed is kept as the trigger label and does not filter rows.

## TableColumnHeader

Use `variant="button"` (default) for one-click sort, or `variant="menu"` for Asc / Desc / Reset / Hide dropdown.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `column` | `Column<TData, TValue>` | **required** | TanStack column instance. |
| `label` | `string` | **required** | Visible header text. |
| `variant` | `"button" \| "menu"` | `"button"` | Header interaction style. |

Set `enableHiding: true` on the column def to show **Hide** in the menu variant.

## useTable

Wraps `@tanstack/react-table` with IPA defaults (core, filtered, sorted, paginated, and faceted row models). Does **not** sync state to the URL — use app-level state or a future optional URL hook if needed.

Client-side processing is the default (works with a full in-memory `data` array). For API-backed lists, set `serverMode` and pass already-sliced `data` plus `pageCount`.

| Prop | Default | Description |
|------|---------|-------------|
| `serverMode` | `false` | Opt-in server-driven sort/filter/pagination (sets all three `manual*` flags). Requires `pageCount`. |
| `rowCount` | — | Total matching rows across pages (selection “of N” copy). Stored on `table.options.meta.rowCount`. |
| `enableFaceting` | `!serverMode` | Client faceted unique/min-max models. Off by default in `serverMode`. |
| `manualPagination` | `false` | Server-side pagination only (without full `serverMode`). |
| `manualSorting` | `false` | Server-side sorting only. |
| `manualFiltering` | `false` | Server-side filtering only. |

### useTableQueryState

Memory-backed query state for `serverMode` (URL adapter later). Owns pagination, sorting, filters, and global filter; exposes `params` for your fetch `queryKey` and TanStack `state` / `on*Change` handlers.

- Text / global filters commit after `debounceMs` (default 300); select/array filters apply immediately.
- Changing sort, filters, or page size resets to page 1.
- Pass `onResetFilters={query.resetFilters}` to `TableToolbar` so Reset clears server query state in one shot.

```tsx
const query = useTableQueryState({ initialState: { pageSize: 20 } })
const table = useTable({
  data: rows,
  columns,
  serverMode: true,
  pageCount,
  rowCount,
  state: query.state,
  onPaginationChange: query.onPaginationChange,
  onSortingChange: query.onSortingChange,
  onColumnFiltersChange: query.onColumnFiltersChange,
  onGlobalFilterChange: query.onGlobalFilterChange,
})
// fetch(query.params)
```

### useTableQuerySearchParams

Same as `useTableQueryState`, plus URL sync via `history.replaceState` / `pushState` (no router peer dependency). Hydrates from `window.location.search` (or a `search` override). Exposes `queryString`, `exampleUrl` (readable), and `exampleUrlEncoded`.

Default filter encoding is **`filterUrlStyle: "flat"`** (tablecn-style): simple filters become per-column keys (`role=Engineer,Researcher`, `joinedAt=1843238400000`), and `sort` stays a compact JSON array. Use `filterUrlStyle: "json"` for a single `filters=[…]` blob (heavier percent-encoding). Non-default operators still serialize into `filters` even in flat mode.

### Query URL keys (vs tablecn)

Server/URL query helpers use `pageSize` as the page-length key (aligned with TanStack `pagination.pageSize`). [tablecn](https://github.com/sadmann7/tablecn) uses `perPage` for the same concept — map that key when porting their URL state code.

## HTML primitives

Low-level table elements for custom layouts: `TableRoot`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`, `TableFooter`. The main `Table` component uses these internally.

## Related

- [Internal implementation plan](internal/table-plan.md) — gap checklist, phases, upstream sync
- [tablecn registry](https://github.com/sadmann7/tablecn/blob/main/registry.json) — reference features to port
