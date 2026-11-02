import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table"

import type {
  tableFilterOperators,
  tableFilterVariants,
  tableJoinOperators,
  tableQueryKeys,
} from "./config"

export type TableFilterOperator = (typeof tableFilterOperators)[number]
export type TableJoinOperator = (typeof tableJoinOperators)[number]
export type TableQueryFilterVariant = (typeof tableFilterVariants)[number]

export type TableQueryKeys = {
  [K in keyof typeof tableQueryKeys]: string
}

/** Filter value shapes accepted in the query DTO (URL / API boundary). */
export type TableQueryFilterValue =
  | string
  | boolean
  | string[]
  | [string, string]
  | null

export interface TableQuerySort {
  id: string
  desc: boolean
}

export interface TableQueryFilter {
  id: string
  operator: TableFilterOperator
  value: TableQueryFilterValue
  variant: TableQueryFilterVariant
  /** Stable id for advanced filter rows (multiple filters on one column). */
  filterId: string
}

/**
 * Framework-agnostic table query DTO.
 * `page` is 1-based (URL / API). Map to TanStack `pageIndex` with `toTanStackState`.
 */
export interface TableQueryParams {
  page: number
  pageSize: number
  sorting: TableQuerySort[]
  filters: TableQueryFilter[]
  joinOperator: TableJoinOperator
  globalFilter?: string
}

/** Typical list API response shape for server-driven tables. */
export interface TableQueryResult<TData> {
  rows: TData[]
  pageCount: number
  rowCount?: number
  facets?: Record<
    string,
    Array<{
      value: string
      count: number
      label?: string
    }>
  >
}

export interface TableQueryParseOptions {
  /** Override URL key names (and optionally namespace via prefix). */
  queryKeys?: Partial<TableQueryKeys>
  /** When set, filter/sort entries whose `id` is not in this set are dropped. */
  columnIds?: ReadonlySet<string> | readonly string[]
  /** Defaults merged when params are missing or invalid. */
  defaults?: Partial<TableQueryParams>
  /**
   * How filters are read from the URL.
   * - `flat` (default): tablecn-style `role=Engineer,Researcher` plus optional JSON `filters`
   * - `json`: only the `filters` JSON blob
   */
  filterUrlStyle?: "flat" | "json"
}

export interface TableQuerySerializeOptions {
  queryKeys?: Partial<TableQueryKeys>
  /** Omit keys that equal these defaults (cleaner URLs). */
  defaults?: Partial<TableQueryParams>
  clearOnDefault?: boolean
  /**
   * How filters are written to the URL.
   * - `flat` (default): per-column keys when the operator is the variant default
   * - `json`: single `filters=[...]` JSON param (verbose / heavily encoded)
   */
  filterUrlStyle?: "flat" | "json"
}

/** Slice of TanStack table state derived from / written to {@link TableQueryParams}. */
export interface TableQueryTanStackState {
  pagination: PaginationState
  sorting: SortingState
  columnFilters: ColumnFiltersState
  globalFilter: string
}
