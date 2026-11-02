import type { Column } from "@tanstack/react-table"
import * as React from "react"

export interface ColumnFilterControls<TValue = unknown> {
  value: TValue | undefined
  setValue: (value: TValue | undefined) => void
  clear: () => void
  isActive: boolean
  id: string
  label: string
  canFilter: boolean
}

/**
 * UI-friendly bindings for a single column filter.
 * Custom filter chrome (calendar, toggle select, etc.) should read/write via this
 * (or `column.getFilterValue` / `setFilterValue`) so query/table semantics stay intact.
 */
export function useColumnFilterControls<TData, TValue = unknown>(
  column: Column<TData, unknown>
): ColumnFilterControls<TValue> {
  const value = column.getFilterValue() as TValue | undefined
  const label = column.columnDef.meta?.label ?? column.id
  const canFilter = column.getCanFilter()

  const setValue = React.useCallback(
    (next: TValue | undefined) => {
      column.setFilterValue(next)
    },
    [column]
  )

  const clear = React.useCallback(() => {
    column.setFilterValue(undefined)
  }, [column])

  return React.useMemo(
    () => ({
      value,
      setValue,
      clear,
      isActive: value !== undefined && value !== null && value !== "",
      id: column.id,
      label,
      canFilter,
    }),
    [value, setValue, clear, column.id, label, canFilter]
  )
}
