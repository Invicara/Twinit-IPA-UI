import type { Table as TanstackTable } from "@tanstack/react-table"
import * as React from "react"

import { cn, mergeStyles } from "../../../lib/utils"
import { TablePagination } from "./pagination/pagination"
import { TableProvider, useOptionalTableChrome, useTableContext } from "./table-context"
import { TableGrid } from "./table-grid"
import {
  TableFilters,
  TableSearch,
  TableToolbar,
  TableToolbarFilterMenu,
} from "./toolbar/toolbar"
import { TableSortList } from "./toolbar/sort-list"
import { TableViewOptions } from "./toolbar/view-options"
import styles from "./table.module.css"

export interface TableProps<TData> {
  table: TanstackTable<TData>
  children?: React.ReactNode
  emptyMessage?: string
  isLoading?: boolean
  isFetching?: boolean
  styleOverrides?: Record<string, string>
}

/**
 * Context root for table chrome. Renders no DOM — wrap parts in {@link TableFrame}
 * for the default shell, or supply your own layout.
 */
function TableRoot<TData>({
  table,
  children,
  emptyMessage = "No results",
  isLoading = false,
  isFetching = false,
  styleOverrides,
}: TableProps<TData>) {
  return (
    <TableProvider
      table={table}
      emptyMessage={emptyMessage}
      isLoading={isLoading}
      isFetching={isFetching}
      styleOverrides={styleOverrides}
    >
      {children}
    </TableProvider>
  )
}

export interface TableFrameProps
  extends React.HTMLAttributes<HTMLDivElement> {
  styleOverrides?: Record<string, string>
}

/** Styled chrome shell (`data-testid="ipa_table"`). */
export function TableFrame({
  children,
  className,
  styleOverrides: styleOverridesProp,
  ...props
}: TableFrameProps) {
  const ctx = useTableContext()
  const styleOverrides = styleOverridesProp ?? ctx.styleOverrides
  const s = mergeStyles(styles, styleOverrides)

  const status = ctx.isLoading
    ? "Loading table"
    : ctx.isFetching
      ? "Updating table"
      : ""

  return (
    <div
      data-testid="ipa_table"
      className={cn(s.root, className)}
      {...props}
    >
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={s.srOnly}
        data-testid="ipa_table_status"
      >
        {status}
      </div>
      {children}
    </div>
  )
}

/** Footer region wrapper for custom pagers / action bars. */
export function TableChromeFooter({
  children,
  className,
  styleOverrides: styleOverridesProp,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  styleOverrides?: Record<string, string>
}) {
  const ctx = useOptionalTableChrome()
  const s = mergeStyles(styles, styleOverridesProp ?? ctx?.styleOverrides)
  return (
    <div className={cn(s.footer, className)} {...props}>
      {children}
    </div>
  )
}

export const Table = Object.assign(TableRoot, {
  Frame: TableFrame,
  Toolbar: TableToolbar,
  Search: TableSearch,
  Filters: TableFilters,
  SortList: TableSortList,
  ViewOptions: TableViewOptions,
  FilterMenu: TableToolbarFilterMenu,
  Grid: TableGrid,
  Pagination: TablePagination,
  Footer: TableChromeFooter,
})
