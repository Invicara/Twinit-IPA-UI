# Table

Data table built on [TanStack Table v8](https://tanstack.com/table/v8): sorting, filtering, pagination, row selection, column resizing, column reordering, loading states, and server-driven queries. Composed from parts under one `Table` context root, styled with CSS modules and `styleOverrides` (patterns adapted from [tablecn](https://github.com/sadmann7/tablecn)).

## Install

`@tanstack/react-table` (`^8`) is a **required peer dependency**: install it next to the library. You also import its types (`ColumnDef`, `Column`, ...) when you define columns.

```bash
npm install @dtplatform/ipa-ui @tanstack/react-table
```

## Import

```tsx
import {
  Table,
  TableColumnHeader,
  useTable,
  withSorting,
  withFiltering,
  withPagination,
} from '@dtplatform/ipa-ui';
import type { ColumnDef } from '@tanstack/react-table';
```

## Basic usage

```tsx
import type { ColumnDef } from '@tanstack/react-table';
import {
  Table,
  TableColumnHeader,
  useTable,
  withFiltering,
  withPagination,
  withSorting,
} from '@dtplatform/ipa-ui';

type Person = { id: string; name: string; email: string; role: string };

const columns: ColumnDef<Person>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <TableColumnHeader column={column} label="Name" />,
    meta: { label: 'Name', variant: 'text' },
  },
  {
    accessorKey: 'role',
    header: 'Role',
    meta: {
      label: 'Role',
      variant: 'multiSelect',
      options: [
        { label: 'Engineer', value: 'Engineer' },
        { label: 'Researcher', value: 'Researcher' },
      ],
    },
  },
  { accessorKey: 'email', header: 'Email', enableColumnFilter: false },
];

function PeopleTable({ data }: { data: Person[] }) {
  const table = useTable({
    data,
    columns,
    features: [withSorting(), withFiltering(), withPagination()],
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
    getRowId: (row) => row.id,
  });

  return (
    <Table table={table}>
      <Table.Frame>
        <Table.Toolbar>
          <Table.Search />
          <Table.Filters />
        </Table.Toolbar>
        <Table.Grid />
        <Table.Pagination />
      </Table.Frame>
    </Table>
  );
}
```

`Table` renders no DOM of its own: it only provides context. Put the parts you want inside it (usually wrapped in `Table.Frame` for the default shell). Without `Table.Grid` no rows are rendered.

## Parts

Every part reads the table from the `Table` context, or from its own `table` prop when used outside one. Each part is also exported under its own name.

| Part | Export | Renders |
|------|--------|---------|
| `Table` | `Table` | Context root (no DOM). |
| `Table.Frame` | `TableFrame` | Styled outer shell (`data-testid="ipa_table"`) with a polite live region announcing "Loading table" / "Updating table". |
| `Table.Toolbar` | `TableToolbar` | Toolbar that lays out the parts below and shows a **Reset** button while any filter is active. |
| `Table.Search` | `TableSearch` | Global filter input. |
| `Table.Filters` | `TableFilters` | One filter control per filterable visible column, chosen by `meta.variant`. |
| `Table.FilterMenu` | `TableToolbarFilterMenu` | **Filter** button: pick a column, type a value. Shows active filters as removable chips when `Table.Filters` is not used. |
| `Table.SortList` | `TableSortList` | **Sort** popover: add, reorder (drag), change direction, remove sort rules. Backspace / Delete removes. |
| `Table.ViewOptions` | `TableViewOptions` | **View** popover: searchable column visibility toggles, hidden-count badge, Reset. |
| `Table.Grid` | `TableGrid` | The `<table>`: headers, rows, empty row, skeleton, fetching bar, resize and drag handles. |
| `Table.Pagination` | `TablePagination` | Rows-per-page select, page indicator, first/previous/next/last buttons, selection summary, action bar. |
| `Table.Footer` | `TableChromeFooter` | Plain footer wrapper for a custom pager or actions. |

## Table props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `table` | `Table<TData>` (TanStack) | **required** | Instance from `useTable`. |
| `children` | `ReactNode` | - | Parts and layout. |
| `emptyMessage` | `string` | `'No results'` | Copy in the grid when there are zero rows. |
| `isLoading` | `boolean` | `false` | Initial load: grid body becomes `TableSkeleton`, and search, filters, sort, header sort buttons, select-all and pagination controls are disabled. |
| `isFetching` | `boolean` | `false` | Refetch: rows stay, an indeterminate progress bar shows above the grid, controls stay enabled. Ignored while `isLoading`. |
| `styleOverrides` | `Record<string, string>` | - | Slot to class map shared through context (see [Style overrides](#style-overrides)). |

`Table.Frame` and `Table.Footer` also accept standard `<div>` attributes (e.g. `className`).

## useTable

Wraps TanStack `useReactTable`. Accepts every TanStack table option (`data`, `columns`, `state`, `initialState`, `on*Change`, `getRowId`, `meta`, ...) except the ones owned by feature slices, plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `features` | `Array<TableFeatureSlice \| false \| null \| undefined>` | `[]` | Feature slices to enable. Empty means core row model only (no sorting, filtering or pagination applied to rows). Use `condition && withX()` to toggle. |
| `rowCount` | `number` | - | Total matching rows across pages (server tables). Stored on `table.options.meta.rowCount` for the "N of M row(s) selected" summary. |
| `pageCount` | `number` | - | Total pages. Required with `withServerMode` / `withPagination({ manual: true })` (dev warning otherwise). Wins over a `pageCount` given to a slice. |

Behaviour:

- These TanStack options are set by slices and **ignored** if passed directly (dev-mode console warning): `enableRowSelection`, `enableColumnResizing`, `columnResizeMode`, `manualPagination`, `manualSorting`, `manualFiltering`, `enableMultiSort`. The older flags `selectable`, `resizable`, `draggable`, `serverMode` and `enableFaceting` are ignored the same way.
- Any column filter change clears the current row selection.
- `useTable` holds state in TanStack (or yours, via `state` / `on*Change`). It does not touch the URL; for that use [`useTableQuerySearchParams`](#usetablequerysearchparams).
- Without `withSorting()` (or server mode), `TableColumnHeader` still toggles sort state but rows are not reordered.

### Feature slices

| Factory | Options (default) | Effect |
|---------|-------------------|--------|
| `withSorting(options?)` | `manual` (`false`), `enableMultiSort` (TanStack default) | Client sorted row model, or manual sorting. |
| `withFiltering(options?)` | `manual` (`false`), `faceting` (`!manual`) | Client filtered row model, or manual filtering. In client mode, columns without a `filterFn` get one from `meta.variant` (see [Filters](#filters)). Faceting adds faceted unique / min-max models (used for slider bounds). |
| `withPagination(options?)` | `manual` (`false`), `pageCount` | Client pagination row model, or manual pagination with already-sliced `data`. |
| `withSelection(options?)` | `column` (`true`) | Enables row selection and prepends a checkbox column (`id: 'select'`, select-all toggles the current page). `column: false` keeps selection state without the column. |
| `withResizing(options?)` | `columnResizeMode` (`'onChange'`) | Column resizing with resize handles in the grid (double-click resets). Default column `size: 180`, `minSize: 80`, `maxSize: 800`. |
| `withColumnOrder(options?)` | `handles` (`true`) | Column-order state owned by `useTable` (or controlled via `state.columnOrder` + `onColumnOrderChange`) and drag handles in the headers. `handles: false` keeps the state without handles. The selection column is not draggable. |
| `withClientMode(options?)` | `enableMultiSort`, `faceting`, `pageCount` | Shorthand for `withSorting()`, `withFiltering()`, `withPagination()`. |
| `withServerMode(options?)` | `pageCount`, `rowCount`, `enableFaceting` (`false`), `enableMultiSort` | Manual sorting, filtering and pagination; sets `meta.serverMode`. Pass the current page as `data`. |

`composeTableFeatures(...slices)` merges slices into one (later slices win; `state`, `meta`, `defaultColumn` shallow-merge; column mappers chain). `useColumnOrder` is the hook `useTable` uses for `withColumnOrder`; you rarely need it directly. Types: `TableFeatureSlice`, `With*Options`, `UseColumnOrderOptions`.

Column pinning uses plain TanStack state (e.g. `initialState: { columnPinning: { left: ['name'] } }`); the grid makes pinned cells sticky.

## Column meta

The library extends TanStack `ColumnMeta`:

| Key | Type | Description |
|-----|------|-------------|
| `label` | `string` | Display name in filters, chips, sort list, view options. Falls back to the column id. |
| `placeholder` | `string` | Placeholder for text / number filters and the Filter menu input. |
| `variant` | `TableFilterVariant` | Filter control and value shape (below). Default `'text'`. |
| `options` | `TableFilterOption[]` (`{ label, value, count? }`) | Choices for `select` / `multiSelect`. |
| `range` | `[number, number]` | Slider bounds for `range` (else faceted min/max, else `0`-`100`). For `rating`, `range[1]` is the star count (default 5). |
| `unit` | `string` | Suffix on range inputs (e.g. `hr`). |
| `step` | `number` | Slider step for `range` (auto from the bounds when unset). |
| `checkedValue` | `string \| boolean` | Value written by a `checkbox` filter when on (default `true`). |
| `checkedLabel` | `string` | Label on the `checkbox` filter button. |
| `showToday`, `showThisWeek`, `showThisMonth`, `showThisQuarter`, `showThisYear` | `boolean` | Relative shortcuts on a `dateRange` picker. Off by default. |
| `filter` | `ComponentType<TableColumnFilterRenderProps>` | Replaces the filter control for this column (see [Custom filters](#custom-filters)). |

A column is filterable when it has an accessor and `enableColumnFilter` is not `false` (TanStack default `true`), so `Table.Filters` renders a text filter for every accessor column unless you opt out.

## Filters

| `variant` | Control (`Table.Filters`) | Column filter value | Client `filterFn` |
|-----------|---------------------------|---------------------|-------------------|
| `text` | Text input | `string` | TanStack auto |
| `number` | Number input | `string` | `tableRangeFilterFn` |
| `boolean` | Text input | `string` | TanStack auto |
| `select` | `TableFacetedFilter` (single) | `string[]` (one item) | `tableSelectFilterFn` |
| `multiSelect` | `TableFacetedFilter` (multiple) | `string[]` | `tableSelectFilterFn` |
| `date` | `TableDateFilter` (`DatePicker`) | `string` (ms timestamp) | `tableDateFilterFn` |
| `dateRange` | `TableDateFilter` (`DateRangePicker`) | `[fromMs, toMs]` strings | `tableDateFilterFn` |
| `range` | `TableSliderFilter` (slider + inputs) | `[min, max]` numbers | `tableRangeFilterFn` |
| `rating` | `TableRatingFilter` (stars) | `{ operator: 'gte', value, variant: 'rating', filterId }` | `tableRatingFilterFn` (`>= n`) |
| `checkbox` | `TableCheckboxFilter` (toggle button) | `meta.checkedValue` | `tableCheckboxFilterFn` |

- Select and checkbox matching is case-insensitive; checkbox matching also ignores spaces, `-` and `_` (`Full-Time` matches `fulltime`).
- Date filters match whole local calendar days (`dateRange` is inclusive of the end day).
- Option counts in `TableFacetedFilter` are counted from the rows on the current page when inside `Table`; outside a `Table`, `option.count` is shown.
- `tableRangeFilterFn` expects `[min, max]`, so a single typed value on a `number` column currently matches no rows in client mode. Give `number` columns your own `filterFn` (or use `range`) until this is fixed.
- A column's own `filterFn` always wins. In manual (server) filtering no client `filterFn` runs.

Filter components and helpers are exported for custom layouts: `TableFacetedFilter`, `TableDateFilter`, `TableSliderFilter` (alias `TableRangeFilter`), `TableRatingFilter`, `TableRatingStars` (read-only or interactive stars for cells), `TableCheckboxFilter`, `TableColumnFilter`, the filter functions above, `parseRatingFilterValue`, `resolveCheckboxFilterValue`.

### Custom filters

Resolution order for a column's control: `meta.filter`, then `components[variant]` on `Table.Filters`, then the built-in default (`defaultTableFilterComponents`, exposed via `resolveColumnFilterComponent`). A custom control receives `{ column, title, styleOverrides }` and must write the same value shape as its `variant` (so client `filterFn`s and server params keep working). `useColumnFilterControls(column)` gives `{ value, setValue, clear, isActive, id, label, canFilter }`.

```tsx
import {
  useColumnFilterControls,
  type TableColumnFilterProps,
} from '@dtplatform/ipa-ui';

function LastYearToggle({ column }: TableColumnFilterProps<Person>) {
  const filter = useColumnFilterControls<Person, string[]>(column);
  const yearAgo = String(Date.now() - 365 * 24 * 60 * 60 * 1000);
  return (
    <button
      type="button"
      aria-pressed={filter.isActive}
      onClick={() =>
        filter.isActive ? filter.clear() : filter.setValue([yearAgo, String(Date.now())])
      }
    >
      Last 12 months
    </button>
  );
}

// column def: meta: { label: 'Joined', variant: 'dateRange', filter: LastYearToggle }
```

### Typed values (Filter menu)

`Table.FilterMenu` parses the typed value by the column's variant:

- `select` / `multiSelect`: comma-separated; each part matches an option value or label case-insensitively.
- `range`: two numbers separated by `-`, `–` or `,` (`4-12`). Anything else is kept as the chip label and matches no rows.
- `rating`: a number of stars, stored as `>= n`.
- `checkbox` / `boolean`: `meta.checkedLabel` or `meta.checkedValue` spelling maps to `checkedValue`.
- `date` / `dateRange`: parsed with `parseTableDateInput` / `parseTableDateRangeInput` (rules below). Unparseable text is kept as the label and matches no rows.
- Anything else: the raw string.

Numeric dates are **day-first (D-M-Y)**. Separators may be `-`, space, `.`, or `/`. Day and month may be one or two digits (`9` or `09`, `1` or `01`). Two-digit years map to 20xx (`23` → 2023).

| Input | Reads as |
|-------|----------|
| `14-11-2023` | 14 Nov 2023 |
| `14 11 2023` | 14 Nov 2023 |
| `14.11.2023` | 14 Nov 2023 |
| `14-11-23` | 14 Nov 2023 |
| `9-1-23` / `09.01.2023` | 9 Jan 2023 |

Named months and ISO also work: `Jan 12, 2023`, `12 Jan 2023`, `2023-01-12`.

**Ranges:** type two dates separated by ` - ` (spaces around the dash) or ` to `. Each side can use a different format:

```
14-07-23 - 17-9-2025
14.07.23 to 17 9 2025
```

A single date on a `dateRange` column filters that calendar day only. `formatTableDate(value, format = 'MMM d, yyyy')` formats a timestamp for display.

## TableToolbar

With no children it renders `Table.Search`. With children, recognised parts are placed in fixed slots: `Table.Search` on its own top row; `Table.Filters` (or filter chips when only `Table.FilterMenu` is used) and the Reset button at the start of the second row; `Table.SortList`, `Table.ViewOptions`, `Table.FilterMenu` and any other children at the end. The toolbar passes its `table` and `styleOverrides` to the parts. Also accepts standard `<div>` attributes.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `table` | `Table<TData>` | context | Table instance outside a `Table` root. |
| `globalFilterPlaceholder` | `string` | `'Filter rows...'` | Placeholder of the default search when there are no children. |
| `onResetFilters` | `() => void` | clears column filters and global filter | Reset button handler. Pass `query.resetFilters` in server mode. |
| `styleOverrides` | `Record<string, string>` | context | Slot to class map. |

### Toolbar parts

| Part | Prop | Type | Default | Description |
|------|------|------|---------|-------------|
| `TableSearch` | `placeholder` | `string` | `'Filter rows...'` | Input placeholder (`aria-label="Filter table rows"`). |
| `TableSearch` | `className` | `string` | - | Extra class on the search input. |
| `TableFilters` | `components` | `TableFilterComponentMap` | - | Per-variant component overrides. |
| `TableFilters` | `renderColumnFilters` | `({ table, columns }) => ReactNode` | - | Render the filter row yourself. |
| `TableFilters` | `className` | `string` | - | When set, wraps the filters in a `<div>` with this class. |
| `TableSortList` | `disabled` | `boolean` | `false` | Disable the Sort button. |
| `TableViewOptions` | `disabled` | `boolean` | `false` | Disable the View button. |

All parts also take `table` and `styleOverrides`. `TableFilterChips` and `TableFilterMenuTrigger` are exported separately; `TableFilterMenu` (chips + trigger in one) is **deprecated**.

## TableColumnHeader

Use as a column `header`. `variant="button"` (default) toggles sort on click; `variant="menu"` opens a menu with **Asc**, **Desc**, **Hide** and, when sorted, **Reset**. Hide appears unless the column sets `enableHiding: false`. A column that can neither sort nor hide renders a plain label.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `column` | `Column<TData, TValue>` | **required** | TanStack column from the header context. |
| `label` | `string` | **required** | Visible header text. |
| `variant` | `'button' \| 'menu'` | `'button'` | Header interaction style. |
| `className` | `string` | - | Class on the header element. |
| `styleOverrides` | `Record<string, string>` | - | Slot to class map (not inherited from `Table`). |

## TablePagination

Also accepts standard `<div>` attributes.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `table` | `Table<TData>` | context | Table instance outside a `Table` root. |
| `pageSizeOptions` | `number[]` | `[5, 10, 20, 30, 50]` | Rows-per-page choices. |
| `showControls` | `boolean` | `true` | Show page size, page indicator and page buttons. |
| `showSelectionSummary` | `boolean` | on when row selection is enabled | "N of M row(s) selected" (uses `rowCount` when set; in server mode without it, just "N row(s) selected"). |
| `actionBar` | `ReactNode` | - | Shown while at least one row is selected (e.g. bulk delete). |
| `styleOverrides` | `Record<string, string>` | - | Slot to class map (not inherited from `Table`). |

The initial page size comes from your table state (`initialState.pagination.pageSize`, TanStack default 10), not from `pageSizeOptions`.

## TableGrid and TableSkeleton

`Table.Grid` takes optional `table`, `emptyMessage`, `isLoading`, `isFetching` and `styleOverrides` to override the context values, plus standard `<div>` attributes.

`TableSkeleton` is the placeholder `<tbody>` the grid shows while `isLoading`. Render it yourself in custom layouts: `table` (**required**), `rowCount` (default: current page size, between 1 and 20), `styleOverrides`.

## Server mode and query state

Server mode turns table state into a typed **`TableQueryParams`** object for **your own fetch**. The library does not call any API and does not build OData or any other backend query language: map the params to your endpoint yourself.

```ts
interface TableQueryParams {
  page: number;              // 1-based
  pageSize: number;
  sorting: { id: string; desc: boolean }[];
  filters: TableQueryFilter[];
  joinOperator: 'and' | 'or';
  globalFilter?: string;
}

interface TableQueryFilter {
  id: string;                // column id
  operator: TableFilterOperator;
  value: string | boolean | string[] | [string, string] | null;
  variant: TableQueryFilterVariant;
  filterId: string;          // e.g. 'role-inArray'
}
```

`TableQueryResult<TData>` (`{ rows, pageCount, rowCount?, facets? }`) is a suggested response shape.

Two hooks own this state; both return the same API:

| Hook | State lives in | URL |
|------|----------------|-----|
| `useTableQueryState` | React state | Not synced. |
| `useTableQuerySearchParams` | React state | Hydrated from and written to `window.location.search`. |

```tsx
import {
  Table,
  useTable,
  useTableQuerySearchParams,
  withServerMode,
} from '@dtplatform/ipa-ui';

function PeopleTable() {
  const query = useTableQuerySearchParams({ initialState: { pageSize: 20 } });
  // Your data hook: fetch with query.params (e.g. as a query key).
  const { result, isLoading, isFetching } = usePeople(query.params);

  const table = useTable({
    data: result?.rows ?? [],
    columns,
    features: [withServerMode()],
    pageCount: result?.pageCount ?? 0,
    rowCount: result?.rowCount,
    state: query.state,
    onPaginationChange: query.onPaginationChange,
    onSortingChange: query.onSortingChange,
    onColumnFiltersChange: query.onColumnFiltersChange,
    onGlobalFilterChange: query.onGlobalFilterChange,
    getRowId: (row) => row.id,
  });

  return (
    <Table table={table} isLoading={isLoading} isFetching={isFetching}>
      <Table.Frame>
        <Table.Toolbar onResetFilters={query.resetFilters}>
          <Table.Search />
          <Table.Filters />
        </Table.Toolbar>
        <Table.Grid />
        <Table.Pagination />
      </Table.Frame>
    </Table>
  );
}
```

### useTableQueryState

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `initialState` | `Partial<TableQueryParams>` | `page: 1`, `pageSize: 10`, no sort or filters, `joinOperator: 'and'` | Starting params. |
| `debounceMs` | `number` | `300` (`TABLE_QUERY_STATE_DEFAULT_DEBOUNCE_MS`) | Delay before text-like filter and search changes reach `params`. |

Returns `params` (for your fetch), `state` (controlled TanStack slice: `pagination`, `sorting`, `columnFilters`, `globalFilter`), `onPaginationChange`, `onSortingChange`, `onColumnFiltersChange`, `onGlobalFilterChange`, `setJoinOperator`, `setParams`, `resetFilters` (clears filters and search, back to page 1) and `resetAll` (back to `initialState`).

- `state` updates immediately so inputs stay responsive; `params` is what is debounced. A filter change is debounced when every active column filter value is a string (text, number, date, string `checkedValue`, rating); if any value is an array or boolean (select, multiSelect, dateRange, range, default checkbox) it commits at once. Search is debounced, but clearing it commits at once.
- Changing sort, filters, search, page size or join operator resets to page 1.
- Operator and variant are **inferred from the value shape**, not from column meta. Once a column has a filter, it keeps that operator and variant while its value changes.

| Column filter value | `operator` | `variant` |
|---------------------|------------|-----------|
| Object with an `operator` (the rating filter writes `gte` / `rating`) | as given | as given |
| Two numbers or digit strings (`range`, `dateRange`) | `isBetween` | `dateRange` |
| Other arrays (`select`, `multiSelect`) | `inArray` | `multiSelect` |
| Boolean (`checkbox` with the default `checkedValue: true`) | `eq` | `boolean` |
| Timestamp (number `>= 1e11` or 11+ digit string, `date`) | `eq` | `date` |
| Any other string (`text`, `number`, `checkbox` with a string `checkedValue`) | `iLike` | `text` |

So a `range` filter arrives as `variant: 'dateRange'`: branch on the column id and `operator`, not on `variant`.

### useTableQuerySearchParams

`useTableQueryState` plus URL sync through `history.replaceState` / `pushState` (no router dependency). Reads the URL once on mount, re-reads it on `popstate`, and writes it whenever `params` change. Extra options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `syncUrl` | `boolean` | `true` | Write to `window.history` and listen to `popstate`. Turn off in tests or when several tables share a page. |
| `history` | `'replace' \| 'push'` | `'replace'` | History mode when writing. |
| `search` | `string` | `window.location.search` | Initial query string to hydrate from (Storybook, tests, SSR). |
| `queryKeys` | `Partial<TableQueryKeys>` | `tableQueryKeys` | Rename the reserved URL keys. |
| `filterUrlStyle` | `'flat' \| 'json'` | `'flat'` | Filter encoding (below). |

Extra return values: `queryString` (no leading `?`, percent-encoded), `exampleUrl` (readable `/items?...`, spaces as `+`) and `exampleUrlEncoded`.

The hook owns the whole search string: it replaces `location.search` with the table query, so other params on the same URL are not preserved (in `flat` mode they are read back as text filters). Use it on pages where the table is the only URL state.

### URL format

Reserved keys (`tableQueryKeys`): `page`, `pageSize`, `sort`, `filters`, `joinOperator`, and `q` for the global filter. Values equal to the defaults are omitted (`page=1`, the initial page size, no sort, no filters, `joinOperator=and`). `sort` is a JSON array.

- **`flat`** (default, tablecn-style): a filter whose operator is the variant default becomes its own key: `role=Engineer,Researcher`, `joinedAt=1673481600000`, `joinedAt=1673481600000,1676073600000`, `name=ada`. Other filters (e.g. rating `gte`) go into a JSON `filters` param. On read, every non-reserved key is treated as a column filter.
- **`json`**: all filters in one `filters=[...]` JSON param (heavier percent-encoding).

Example (shown unencoded):

```
/people?page=2&sort=[{"id":"name","desc":false}]&role=Engineer&q=ada
```

URL keys use `pageSize` (aligned with TanStack `pagination.pageSize`). tablecn uses `perPage` for the same thing: rename that key when porting tablecn URL code.

### Query helpers

Framework-free functions behind the hooks, for server code or custom routers:

| Function | Description |
|----------|-------------|
| `parseTableQuery(searchParams, options?)` | `URLSearchParams` or a plain record to `TableQueryParams`. Options: `queryKeys`, `columnIds` (drop unknown columns), `defaults`, `filterUrlStyle`. |
| `parseTableQueryString(query, options?)` | Same, from a string (leading `?` optional). |
| `serializeTableQuery(params, options?)` | `TableQueryParams` to `URLSearchParams`. Options: `queryKeys`, `defaults`, `clearOnDefault` (`true`), `filterUrlStyle`. |
| `serializeTableQueryString(params, options?)` | Same, as a string. |
| `formatTableQueryExampleUrl(params, options?)` | `/items?...` example URL; `path`, `encoded`. |
| `toTanStackState(params)` / `fromTanStackState(input)` | Convert between `TableQueryParams` and TanStack state (`page` is 1-based, `pageIndex` 0-based). |
| `formatTableQueryParamsDebug(params)` | Pretty JSON for debugging. |

Constants from the query config: `tableQueryKeys`, `TABLE_QUERY_DEFAULT_PAGE` (`1`), `TABLE_QUERY_DEFAULT_PAGE_SIZE` (`10`), `TABLE_QUERY_DEFAULT_JOIN_OPERATOR` (`'and'`), `tableFilterVariants`, `tableFilterOperators` (`iLike`, `notILike`, `eq`, `ne`, `inArray`, `notInArray`, `isEmpty`, `isNotEmpty`, `lt`, `lte`, `gt`, `gte`, `isBetween`, `isRelativeToToday`), `tableJoinOperators`, labelled operator lists per type (`tableTextOperators`, `tableNumericOperators`, `tableDateOperators`, `tableSelectOperators`, `tableMultiSelectOperators`, `tableBooleanOperators`), `tableSortOrders`, and `tableConfig` (all of them). The built-in controls only produce the operators in the table above; the full list is there for your own filter UI and backend mapping.

## Control hooks

For custom chrome (e.g. inside `Table.Footer`):

| Hook | Returns |
|------|---------|
| `useTablePaginationControls(table)` | `page` (1-based), `pageCount`, `pageSize`, `disabled` (true while loading), `canPreviousPage`, `canNextPage`, `setPage`, `setPageSize`, `firstPage`, `previousPage`, `nextPage`, `lastPage`. |
| `useTableSortControls(table)` | `sorting`, `setSorting`, `toggleSort(columnId, desc?)`, `clearSorting`, `isSorted(columnId)`. |
| `useColumnFilterControls(column)` | `value`, `setValue`, `clear`, `isActive`, `id`, `label`, `canFilter`. |

Context hooks: `useTableContext()` (throws outside `Table`; `useTableChrome` is a deprecated alias), `useOptionalTableChrome()`, `useResolvedTable(tableProp?)`, `useTableQueryControlsDisabled()` (true while `isLoading`). `TableProvider` is the provider `Table` renders.

Other helpers: `getTableSelectedRowCount(table)`, `getTableSelectionSummaryText(table)`, `getColumnPinningStyle({ column, resizable })`, `createSelectionColumn()`, `TableHeaderCell`.

## HTML primitives

Styled table elements for fully custom layouts: `TableRoot` (wraps `<table>` in a scroll wrapper), `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`. They forward refs and accept standard attributes; `TableRoot`, `TableHeader`, `TableFooter`, `TableHead`, `TableCell` and `TableCaption` also take `styleOverrides`. `Table.Grid` is built from these. Note that `TableRoot` here is the `<table>` primitive, not the `Table` context root.

## Style overrides

`styleOverrides` maps slot names to class names (plain object, or pass a CSS module directly). See [Custom Style Overrides](../README.md#custom-style-overrides). The value on `Table` reaches `Table.Frame`, `Table.Grid` (and the primitives inside it), `Table.Toolbar` and the parts placed in it, `Table.Search`, `Table.Filters` and `Table.Footer`. `Table.Pagination`, `TableColumnHeader`, and `Table.SortList` / `Table.ViewOptions` placed outside the toolbar take their own `styleOverrides`.

Main slots: `root`, `toolbar`, `toolbarSearchRow`, `toolbarRow`, `toolbarStart`, `toolbarEnd`, `globalFilter`, `tableContainer`, `tableContainerFetching`, `tableFetchingBar`, `headerRow`, `emptyCell`, `columnHeader`, `columnHeaderLabel`, `columnHeaderIcon`, `filterTrigger`, `filterTriggerActive`, `filterChip`, `skeletonRow`, `skeletonCell`, `pagination`, `paginationControls`, `pageSize`, `pageIndicator`, `pageButtons`, `actionBar`, `selectionSummary`, `footer`; primitives: `tableWrapper`, `tableRoot`, `header`, `headerRow`, `headCell`, `bodyRow`, `bodyCell`, `emptyCell`, `footer`, `caption`.

## Test ids and data attributes

| `data-testid` | Element |
|---------------|---------|
| `ipa_table` | `Table.Frame` |
| `ipa_table_status` | Live region inside the frame |
| `ipa_table_toolbar` | Toolbar |
| `ipa_table_fetching` | Progress bar while `isFetching` |
| `ipa_table_skeleton` | Skeleton `<tbody>` |
| `ipa_table_pagination` | Pagination |
| `ipa_table_column_header` | `TableColumnHeader` |
| `ipa_table_draggable_head_cell` | Header cell with a drag handle |
| `ipa_table_column_resize_handle` | Resize handle (`data-resizing="true"` while dragging) |
| `ipa_table_selection_cell_inner` | Selection checkbox wrapper |
| `ipa_table_date_filter` | Date filter trigger |
| `ipa_table_root_wrapper`, `ipa_table_root`, `ipa_table_header`, `ipa_table_body`, `ipa_table_footer`, `ipa_table_row`, `ipa_table_head_cell`, `ipa_table_body_cell`, `ipa_table_caption` | Primitives |

Selected body rows have `data-state="selected"`.

## Related

- [Calendar](calendar.md): `DatePicker` / `DateRangePicker` used by date filters
- [Internal implementation plan](internal/table-plan.md): status, upstream sync
- [tablecn](https://github.com/sadmann7/tablecn): upstream reference
