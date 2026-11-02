import type {
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  SortingState,
  Updater,
} from "@tanstack/react-table"
import * as React from "react"

import {
  TABLE_QUERY_DEFAULT_JOIN_OPERATOR,
  TABLE_QUERY_DEFAULT_PAGE,
  TABLE_QUERY_DEFAULT_PAGE_SIZE,
} from "./config"
import { fromTanStackState, toTanStackState } from "./query"
import type {
  TableJoinOperator,
  TableQueryFilter,
  TableQueryParams,
  TableQueryTanStackState,
} from "./query.types"
import { useDebouncedCallback } from "./use-debounced-callback"

export const TABLE_QUERY_STATE_DEFAULT_DEBOUNCE_MS = 300

function functionalUpdate<T>(updater: Updater<T>, current: T): T {
  return typeof updater === "function"
    ? (updater as (old: T) => T)(current)
    : updater
}

function resolveInitialParams(
  initialState?: Partial<TableQueryParams>
): TableQueryParams {
  return {
    page: initialState?.page ?? TABLE_QUERY_DEFAULT_PAGE,
    pageSize: initialState?.pageSize ?? TABLE_QUERY_DEFAULT_PAGE_SIZE,
    sorting: initialState?.sorting ?? [],
    filters: initialState?.filters ?? [],
    joinOperator:
      initialState?.joinOperator ?? TABLE_QUERY_DEFAULT_JOIN_OPERATOR,
    ...(initialState?.globalFilter !== undefined &&
    initialState.globalFilter !== ""
      ? { globalFilter: initialState.globalFilter }
      : {}),
  }
}

function shouldDebounceColumnFilters(filters: ColumnFiltersState): boolean {
  if (filters.length === 0) return false

  return filters.every((filter) => {
    const value = filter.value
    if (value === undefined || value === null) return false
    if (typeof value === "string") return true
    if (
      typeof value === "object" &&
      !Array.isArray(value) &&
      value !== null &&
      "value" in value
    ) {
      const inner = (value as TableQueryFilter).value
      return typeof inner === "string"
    }
    return false
  })
}

export interface UseTableQueryStateOptions {
  /** Initial query params (1-based `page`). */
  initialState?: Partial<TableQueryParams>
  /**
   * Debounce for text-like column filters and global filter commits.
   * Select/array/boolean filters apply immediately. Default 300.
   */
  debounceMs?: number
}

export interface UseTableQueryStateResult {
  /** Stable query DTO for fetch `queryKey` / API mapping. */
  params: TableQueryParams
  /** Controlled TanStack state slice for `useTable({ state, on*Change })`. */
  state: TableQueryTanStackState
  onPaginationChange: OnChangeFn<PaginationState>
  onSortingChange: OnChangeFn<SortingState>
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>
  onGlobalFilterChange: OnChangeFn<string>
  setJoinOperator: (joinOperator: TableJoinOperator) => void
  setParams: (
    next: TableQueryParams | ((prev: TableQueryParams) => TableQueryParams)
  ) => void
  /** Clears filters + global filter; resets to page 1. */
  resetFilters: () => void
  /** Restores `initialState` defaults (or built-in defaults). */
  resetAll: () => void
}

/**
 * Memory-backed table query state for serverMode (and URL adapters later).
 * Owns pagination, sorting, filters, and global filter; resets page when
 * sort / filters / page size change.
 */
export function useTableQueryState(
  options: UseTableQueryStateOptions = {}
): UseTableQueryStateResult {
  const { initialState, debounceMs = TABLE_QUERY_STATE_DEFAULT_DEBOUNCE_MS } =
    options

  const initialParamsRef = React.useRef(resolveInitialParams(initialState))
  const [params, setParams] = React.useState<TableQueryParams>(
    () => initialParamsRef.current
  )

  const committedState = React.useMemo(() => toTanStackState(params), [params])

  const [draftColumnFilters, setDraftColumnFilters] =
    React.useState<ColumnFiltersState>(committedState.columnFilters)
  const [draftGlobalFilter, setDraftGlobalFilter] = React.useState(
    committedState.globalFilter
  )

  // Sync drafts when params change from pagination/sort/reset/setParams.
  React.useEffect(() => {
    setDraftColumnFilters(committedState.columnFilters)
    setDraftGlobalFilter(committedState.globalFilter)
  }, [committedState.columnFilters, committedState.globalFilter])

  const commitFilterParams = React.useCallback(
    (columnFilters: ColumnFiltersState, globalFilter: string) => {
      setParams((prev) =>
        fromTanStackState({
          pagination: {
            pageIndex: 0,
            pageSize: prev.pageSize,
          },
          sorting: prev.sorting,
          columnFilters,
          globalFilter,
          previousFilters: prev.filters,
          joinOperator: prev.joinOperator,
        })
      )
    },
    []
  )

  const debouncedCommitFilters = useDebouncedCallback(
    (columnFilters: ColumnFiltersState, globalFilter: string) => {
      commitFilterParams(columnFilters, globalFilter)
    },
    debounceMs
  )

  const onPaginationChange = React.useCallback<OnChangeFn<PaginationState>>(
    (updater) => {
      setParams((prev) => {
        const current = toTanStackState(prev).pagination
        const next = functionalUpdate(updater, current)
        const pageSizeChanged = next.pageSize !== current.pageSize
        return fromTanStackState({
          pagination: {
            pageIndex: pageSizeChanged ? 0 : next.pageIndex,
            pageSize: next.pageSize,
          },
          sorting: prev.sorting,
          columnFilters: toTanStackState(prev).columnFilters,
          globalFilter: prev.globalFilter,
          previousFilters: prev.filters,
          joinOperator: prev.joinOperator,
        })
      })
    },
    []
  )

  const onSortingChange = React.useCallback<OnChangeFn<SortingState>>(
    (updater) => {
      setParams((prev) => {
        const current = toTanStackState(prev).sorting
        const next = functionalUpdate(updater, current)
        return fromTanStackState({
          pagination: {
            pageIndex: 0,
            pageSize: prev.pageSize,
          },
          sorting: next,
          columnFilters: toTanStackState(prev).columnFilters,
          globalFilter: prev.globalFilter,
          previousFilters: prev.filters,
          joinOperator: prev.joinOperator,
        })
      })
    },
    []
  )

  const onColumnFiltersChange = React.useCallback<
    OnChangeFn<ColumnFiltersState>
  >(
    (updater) => {
      const next = functionalUpdate(updater, draftColumnFilters)
      setDraftColumnFilters(next)

      if (shouldDebounceColumnFilters(next)) {
        debouncedCommitFilters(next, draftGlobalFilter)
        return
      }

      commitFilterParams(next, draftGlobalFilter)
    },
    [
      commitFilterParams,
      debouncedCommitFilters,
      draftColumnFilters,
      draftGlobalFilter,
    ]
  )

  const onGlobalFilterChange = React.useCallback<OnChangeFn<string>>(
    (updater) => {
      const next = functionalUpdate(updater, draftGlobalFilter)
      setDraftGlobalFilter(next)

      // Clearing search should commit immediately so Reset feels instant.
      if (next === "") {
        commitFilterParams(draftColumnFilters, next)
        return
      }

      debouncedCommitFilters(draftColumnFilters, next)
    },
    [
      commitFilterParams,
      debouncedCommitFilters,
      draftColumnFilters,
      draftGlobalFilter,
    ]
  )

  const setJoinOperator = React.useCallback((joinOperator: TableJoinOperator) => {
    setParams((prev) => ({
      ...prev,
      page: TABLE_QUERY_DEFAULT_PAGE,
      joinOperator,
    }))
  }, [])

  const resetFilters = React.useCallback(() => {
    setDraftColumnFilters([])
    setDraftGlobalFilter("")
    setParams((prev) => ({
      page: TABLE_QUERY_DEFAULT_PAGE,
      pageSize: prev.pageSize,
      sorting: prev.sorting,
      filters: [],
      joinOperator: prev.joinOperator,
    }))
  }, [])

  const resetAll = React.useCallback(() => {
    const next = resolveInitialParams(initialParamsRef.current)
    setDraftColumnFilters(toTanStackState(next).columnFilters)
    setDraftGlobalFilter(toTanStackState(next).globalFilter)
    setParams(next)
  }, [])

  const setParamsExternal = React.useCallback(
    (
      next: TableQueryParams | ((prev: TableQueryParams) => TableQueryParams)
    ) => {
      setParams(next)
    },
    []
  )

  const state = React.useMemo<TableQueryTanStackState>(
    () => ({
      pagination: committedState.pagination,
      sorting: committedState.sorting,
      columnFilters: draftColumnFilters,
      globalFilter: draftGlobalFilter,
    }),
    [
      committedState.pagination,
      committedState.sorting,
      draftColumnFilters,
      draftGlobalFilter,
    ]
  )

  return {
    params,
    state,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onGlobalFilterChange,
    setJoinOperator,
    setParams: setParamsExternal,
    resetFilters,
    resetAll,
  }
}
