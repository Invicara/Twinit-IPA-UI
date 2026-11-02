import type { Table } from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import * as React from "react"

import { cn, mergeStyles } from "../../../../lib/utils"
import { Button } from "../../button"
import { SingleSelect } from "../../dropdown"
import { getTableSelectedRowCount, getTableSelectionSummaryText } from "../query/utils"
import { useResolvedTable, useTableQueryControlsDisabled } from "../table-context"
import styles from "../table.module.css"

export interface TablePaginationProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table?: Table<TData>
  pageSizeOptions?: number[]
  actionBar?: React.ReactNode
  showControls?: boolean
  /** When true, shows the selected row count summary. Defaults to on when row selection is enabled. */
  showSelectionSummary?: boolean
  styleOverrides?: Record<string, string>
}

export function TablePagination<TData>({
  table: tableProp,
  pageSizeOptions = [5, 10, 20, 30, 50],
  actionBar,
  showControls = true,
  showSelectionSummary,
  className,
  styleOverrides,
  ...props
}: TablePaginationProps<TData>) {
  const table = useResolvedTable(tableProp)
  const s = mergeStyles(styles, styleOverrides)
  const queryControlsDisabled = useTableQueryControlsDisabled()
  const pageSize = table.getState().pagination.pageSize
  const pageSizeValue = String(pageSize)
  const pageCount = table.getPageCount()
  const pageIndex = table.getState().pagination.pageIndex
  const canPrevious = !queryControlsDisabled && table.getCanPreviousPage()
  const canNext = !queryControlsDisabled && table.getCanNextPage()
  const pageLabel =
    queryControlsDisabled && pageCount <= 0
      ? "Loading"
      : `Page ${pageIndex + 1} of ${pageCount}`
  const selectedCount = getTableSelectedRowCount(table)
  const selectionEnabled = Boolean(table.options.enableRowSelection)
  const showSummary = showSelectionSummary ?? selectionEnabled
  const showActionBar = Boolean(actionBar && selectedCount > 0)

  return (
    <div
      data-testid="ipa_table_pagination"
      className={cn(s.pagination, className)}
      {...props}
    >
      <div className={s.paginationStart}>
        {showActionBar ? <div className={s.actionBar}>{actionBar}</div> : null}
        {showSummary ? (
          <div className={s.selectionSummary}>
            {getTableSelectionSummaryText(table)}
          </div>
        ) : null}
      </div>
      {showControls ? (
        <div className={s.paginationControls}>
          <div className={s.pageSize}>
            <span>Rows per page</span>
            <SingleSelect
              className={s.pageSizeSelect}
              styleOverrides={{
                trigger: s.pageSizeSelect,
                triggerBase: s.pageSizeSelect,
                triggerIconButton: s.pageSizeSelectIconButton,
                itemBase: s.pageSizeItemBase,
                itemHover: s.pageSizeItemHover,
                itemFocused: s.pageSizeItemFocused,
              }}
              options={pageSizeOptions.map((size) => ({
                value: String(size),
                label: String(size),
              }))}
              value={pageSizeValue}
              disabled={queryControlsDisabled}
              onChange={(value) => {
                if (queryControlsDisabled) return
                table.setPageSize(Number(value))
              }}
              hideFooter
            />
          </div>
          <div className={s.pageIndicator}>{pageLabel}</div>
          <div className={s.pageButtons}>
            <Button
              aria-label="Go to first page"
              variant="secondary"
              size="icon"
              className={s.pageButtonHiddenLg}
              onClick={() => table.setPageIndex(0)}
              disabled={!canPrevious}
            >
              <ChevronsLeft />
            </Button>
            <Button
              aria-label="Go to previous page"
              variant="secondary"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!canPrevious}
            >
              <ChevronLeft />
            </Button>
            <Button
              aria-label="Go to next page"
              variant="secondary"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!canNext}
            >
              <ChevronRight />
            </Button>
            <Button
              aria-label="Go to last page"
              variant="secondary"
              size="icon"
              className={s.pageButtonHiddenLg}
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!canNext}
            >
              <ChevronsRight />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
