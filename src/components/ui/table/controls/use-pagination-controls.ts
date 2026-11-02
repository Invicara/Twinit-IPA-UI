import type { Table } from "@tanstack/react-table"
import * as React from "react"

import { useTableQueryControlsDisabled } from "../table-context"

export interface TablePaginationControls {
  /** 1-based page number for UI. */
  page: number
  pageCount: number
  pageSize: number
  /** True during skeleton load. Disable the page-size control with the page buttons. */
  disabled: boolean
  canPreviousPage: boolean
  canNextPage: boolean
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  firstPage: () => void
  previousPage: () => void
  nextPage: () => void
  lastPage: () => void
}

/** UI-friendly pagination bindings for custom pagers. */
export function useTablePaginationControls<TData>(
  table: Table<TData>
): TablePaginationControls {
  const { pageIndex, pageSize } = table.getState().pagination
  const pageCount = table.getPageCount()
  const disabled = useTableQueryControlsDisabled()

  return React.useMemo(
    () => ({
      page: pageIndex + 1,
      pageCount,
      pageSize,
      disabled,
      canPreviousPage: !disabled && table.getCanPreviousPage(),
      canNextPage: !disabled && table.getCanNextPage(),
      setPage: (page: number) => {
        if (disabled) return
        table.setPageIndex(Math.max(0, page - 1))
      },
      setPageSize: (size: number) => {
        if (disabled) return
        table.setPageSize(size)
      },
      firstPage: () => {
        if (disabled) return
        table.setPageIndex(0)
      },
      previousPage: () => {
        if (disabled) return
        table.previousPage()
      },
      nextPage: () => {
        if (disabled) return
        table.nextPage()
      },
      lastPage: () => {
        if (disabled) return
        table.setPageIndex(Math.max(0, pageCount - 1))
      },
    }),
    [table, pageIndex, pageSize, pageCount, disabled]
  )
}
