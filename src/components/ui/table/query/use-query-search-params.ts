import * as React from "react"

import {
  formatTableQueryExampleUrl,
  parseTableQueryString,
  serializeTableQueryString,
} from "./query"
import type {
  TableQueryKeys,
  TableQueryParams,
} from "./query.types"
import {
  useTableQueryState,
  type UseTableQueryStateOptions,
  type UseTableQueryStateResult,
} from "./use-query-state"

export interface UseTableQuerySearchParamsOptions
  extends UseTableQueryStateOptions {
  /** Override URL key names. */
  queryKeys?: Partial<TableQueryKeys>
  /**
   * When true (default), write `params` to `window.history` via replace/push.
   * Disable in tests or when embedding multiple tables.
   */
  syncUrl?: boolean
  /** History mode when syncing. Default `replace`. */
  history?: "replace" | "push"
  /**
   * Read initial state from this query string instead of `window.location.search`.
   * Useful in Storybook / tests.
   */
  search?: string
  /**
   * Filter URL encoding. Default `flat` (tablecn-style `role=Engineer`).
   * Use `json` for a single `filters=[…]` blob.
   */
  filterUrlStyle?: "flat" | "json"
}

export interface UseTableQuerySearchParamsResult
  extends UseTableQueryStateResult {
  /** Serialized query string without leading `?` (percent-encoded). */
  queryString: string
  /** Readable example: `/items?role=Engineer&q=ada+lovelace` (spaces as `+`). */
  exampleUrl: string
  /** Wire example: `/items?role=Engineer&sort=%5B…%5D` (percent-encoded). */
  exampleUrlEncoded: string
}

function readWindowSearch(): string {
  if (typeof window === "undefined") return ""
  return window.location.search
}

function writeWindowSearch(
  queryString: string,
  historyMode: "replace" | "push"
) {
  if (typeof window === "undefined") return

  const path = window.location.pathname
  const hash = window.location.hash
  const next = queryString ? `${path}?${queryString}${hash}` : `${path}${hash}`
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`
  if (next === current) return

  if (historyMode === "push") {
    window.history.pushState(null, "", next)
  } else {
    window.history.replaceState(null, "", next)
  }
}

/**
 * `useTableQueryState` synced to the URL search string (no router dependency).
 * Uses the same parsers as `parseTableQuery` / `serializeTableQuery`.
 */
export function useTableQuerySearchParams(
  options: UseTableQuerySearchParamsOptions = {}
): UseTableQuerySearchParamsResult {
  const {
    queryKeys,
    syncUrl = true,
    history = "replace",
    search,
    initialState,
    debounceMs,
    filterUrlStyle = "flat",
  } = options

  const serializeOptions = React.useMemo(
    () => ({
      queryKeys,
      filterUrlStyle,
      defaults: {
        page: 1,
        pageSize: initialState?.pageSize ?? 10,
        sorting: [] as TableQueryParams["sorting"],
        filters: [] as TableQueryParams["filters"],
        joinOperator: "and" as const,
      },
      clearOnDefault: true,
    }),
    [queryKeys, filterUrlStyle, initialState?.pageSize]
  )

  const initialFromUrl = React.useMemo(() => {
    const raw = search ?? readWindowSearch()
    if (!raw || raw === "?") {
      return initialState
    }
    return {
      ...initialState,
      ...parseTableQueryString(raw, {
        queryKeys,
        defaults: initialState,
        filterUrlStyle,
      }),
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- hydrate once from URL

  const query = useTableQueryState({
    initialState: initialFromUrl,
    debounceMs,
  })

  const queryString = React.useMemo(
    () => serializeTableQueryString(query.params, serializeOptions),
    [query.params, serializeOptions]
  )

  const exampleUrl = React.useMemo(
    () =>
      formatTableQueryExampleUrl(query.params, {
        ...serializeOptions,
        path: "/items",
        encoded: false,
      }),
    [query.params, serializeOptions]
  )

  const exampleUrlEncoded = React.useMemo(
    () =>
      formatTableQueryExampleUrl(query.params, {
        ...serializeOptions,
        path: "/items",
        encoded: true,
      }),
    [query.params, serializeOptions]
  )

  React.useEffect(() => {
    if (!syncUrl) return
    writeWindowSearch(queryString, history)
  }, [queryString, syncUrl, history])

  React.useEffect(() => {
    if (!syncUrl || typeof window === "undefined") return

    const onPopState = () => {
      const next = parseTableQueryString(window.location.search, {
        queryKeys,
        defaults: initialState,
        filterUrlStyle,
      })
      query.setParams(next)
    }

    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncUrl, queryKeys, initialState, filterUrlStyle])

  return {
    ...query,
    queryString,
    exampleUrl,
    exampleUrlEncoded,
  }
}

/** Format params for diagnostics / Storybook. */
export function formatTableQueryParamsDebug(params: TableQueryParams): string {
  return JSON.stringify(params, null, 2)
}
