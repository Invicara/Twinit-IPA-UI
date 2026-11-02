import type {
  ColumnDef,
  ColumnResizeMode,
  TableOptions,
} from "@tanstack/react-table"

/**
 * A composable slice of TanStack table configuration.
 * Spread/merge via {@link composeTableFeatures} into {@link useTable}.
 */
export type TableFeatureSlice<TData> = {
  /** Identifies slices that need hook-owned state (e.g. column order). */
  kind?: string
  /** Partial `useReactTable` options contributed by this feature. */
  options?: Partial<TableOptions<TData>>
  /** Transform columns (e.g. prepend selection column). */
  mapColumns?: (columns: ColumnDef<TData>[]) => ColumnDef<TData>[]
  /** Shallow-merged into table `meta` (including chrome hints). */
  meta?: Record<string, unknown>
}

export type WithSortingOptions = {
  /** Skip client sorted row model; sorting is applied server-side. */
  manual?: boolean
  enableMultiSort?: boolean
}

export type WithFilteringOptions = {
  /** Skip client filtered row model; filters are applied server-side. */
  manual?: boolean
  /**
   * Attach faceted row models for filter option counts.
   * Defaults to `true` when not manual, else `false`.
   */
  faceting?: boolean
}

export type WithPaginationOptions = {
  /** Skip client pagination row model; pass already-sliced `data`. */
  manual?: boolean
  /** Required when `manual` is true (total page count). */
  pageCount?: number
}

export type WithResizingOptions = {
  columnResizeMode?: ColumnResizeMode
}

export type WithSelectionOptions = {
  /**
   * When false, enables row-selection state without injecting the checkbox
   * column (card / custom selection chrome).
   */
  column?: boolean
}

export type WithColumnOrderOptions = {
  /** When false, owns column-order state but Grid will not render drag handles. */
  handles?: boolean
}

export type WithServerModeOptions = {
  pageCount?: number
  /** Total matching rows (selection summary / “of N”). */
  rowCount?: number
  enableFaceting?: boolean
  enableMultiSort?: boolean
}

export type WithClientModeOptions = {
  enableMultiSort?: boolean
  faceting?: boolean
  pageCount?: number
}
