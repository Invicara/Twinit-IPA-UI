import type { Column, Table } from "@tanstack/react-table"
import type * as React from "react"

import type {} from "../table.types"

export function getFilterableColumnsInDisplayOrder<TData>(table: Table<TData>) {
  return table
    .getVisibleLeafColumns()
    .filter((column) => column.getCanFilter())
}

export function getColumnPinningStyle<TData>({
  column,
  resizable = false,
}: {
  column: Column<TData>
  resizable?: boolean
}): React.CSSProperties {
  const isPinned = column.getIsPinned()
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left")
  const isFirstRightPinnedColumn =
    isPinned === "right" && column.getIsFirstColumn("right")
  const columnSize = column.getSize()

  return {
    boxShadow: isLastLeftPinnedColumn
      ? "inset -4px 0 4px -4px var(--neutral-3)"
      : isFirstRightPinnedColumn
        ? "inset 4px 0 4px -4px var(--neutral-3)"
        : undefined,
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    opacity: isPinned ? 0.97 : 1,
    position: isPinned ? "sticky" : resizable ? "relative" : undefined,
    background: isPinned ? "var(--neutral-0)" : undefined,
    boxSizing: "border-box",
    width: column.id === "select" || resizable ? columnSize : undefined,
    minWidth: column.id === "select" || resizable ? columnSize : undefined,
    maxWidth: column.id === "select" || resizable ? columnSize : undefined,
    zIndex: isPinned ? 1 : undefined,
  }
}

/** Selected row count from controlled `rowSelection` (works across pages in serverMode). */
export function getTableSelectedRowCount<TData>(table: Table<TData>) {
  return Object.values(table.getState().rowSelection).filter(Boolean).length
}

/**
 * Selection summary copy. Prefer `meta.rowCount` when set (server totals).
 * In server/manual filtering without `rowCount`, omit the “of N” denominator.
 */
export function getTableSelectionSummaryText<TData>(table: Table<TData>) {
  const selectedCount = getTableSelectedRowCount(table)
  const rowCount = table.options.meta?.rowCount
  const isManualFiltering = table.options.manualFiltering === true

  if (typeof rowCount === "number") {
    return `${selectedCount} of ${rowCount} row(s) selected`
  }

  if (isManualFiltering) {
    return `${selectedCount} row(s) selected`
  }

  return `${selectedCount} of ${table.getFilteredRowModel().rows.length} row(s) selected`
}
