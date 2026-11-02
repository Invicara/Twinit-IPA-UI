import type { SortingState, Table } from "@tanstack/react-table"
import * as React from "react"

export interface TableSortControls {
  sorting: SortingState
  setSorting: (sorting: SortingState) => void
  toggleSort: (columnId: string, desc?: boolean) => void
  clearSorting: () => void
  isSorted: (columnId: string) => false | "asc" | "desc"
}

/** UI-friendly sorting bindings for custom sort chrome. */
export function useTableSortControls<TData>(
  table: Table<TData>
): TableSortControls {
  const sorting = table.getState().sorting

  return React.useMemo(
    () => ({
      sorting,
      setSorting: (next) => table.setSorting(next),
      toggleSort: (columnId, desc) => {
        const column = table.getColumn(columnId)
        if (!column) return
        if (desc === undefined) {
          column.toggleSorting()
          return
        }
        column.toggleSorting(desc)
      },
      clearSorting: () => table.resetSorting(),
      isSorted: (columnId) => {
        const column = table.getColumn(columnId)
        return column?.getIsSorted() ?? false
      },
    }),
    [table, sorting]
  )
}
