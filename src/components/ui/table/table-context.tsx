import type { Table as TanstackTable } from "@tanstack/react-table"
import * as React from "react"

export interface TableChromeContextValue<TData> {
  table: TanstackTable<TData>
  emptyMessage: string
  isLoading: boolean
  isFetching: boolean
  styleOverrides?: Record<string, string>
}

const TableChromeContext =
  React.createContext<TableChromeContextValue<unknown> | null>(null)

export function TableProvider<TData>({
  table,
  emptyMessage = "No results",
  isLoading = false,
  isFetching = false,
  styleOverrides,
  children,
}: TableChromeContextValue<TData> & { children: React.ReactNode }) {
  const value = React.useMemo(
    () => ({
      table,
      emptyMessage,
      isLoading,
      isFetching,
      styleOverrides,
    }),
    [table, emptyMessage, isLoading, isFetching, styleOverrides]
  )

  return (
    <TableChromeContext.Provider
      value={value as TableChromeContextValue<unknown>}
    >
      {children}
    </TableChromeContext.Provider>
  )
}

export function useTableContext<TData>(): TableChromeContextValue<TData> {
  const ctx = React.useContext(TableChromeContext)
  if (!ctx) {
    throw new Error("useTableContext must be used within Table")
  }
  return ctx as TableChromeContextValue<TData>
}

/** @deprecated Use {@link useTableContext}. */
export const useTableChrome = useTableContext

export function useOptionalTableChrome<TData>(): TableChromeContextValue<TData> | null {
  return React.useContext(TableChromeContext) as TableChromeContextValue<TData> | null
}

/**
 * True while the body is a skeleton (`isLoading`).
 *
 * Page, page size, search, filter, and sort controls are unavailable until
 * rows exist. `aria-busy` only tells assistive tech to wait; it does not
 * disable controls, so those controls use the native `disabled` attribute.
 * A refetch (`isFetching`) keeps the current rows and leaves the controls
 * available.
 */
export function useTableQueryControlsDisabled(): boolean {
  return useOptionalTableChrome()?.isLoading ?? false
}

export function useResolvedTable<TData>(
  tableProp?: TanstackTable<TData>
): TanstackTable<TData> {
  const ctx = useOptionalTableChrome<TData>()
  const table = tableProp ?? ctx?.table
  if (!table) {
    throw new Error(
      "Table parts require a `table` prop or a parent Table"
    )
  }
  return table
}
