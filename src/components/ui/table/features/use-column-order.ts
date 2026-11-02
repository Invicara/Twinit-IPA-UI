import type { ColumnDef, OnChangeFn, Updater } from "@tanstack/react-table"
import * as React from "react"

import type { TableFeatureSlice } from "./types"

function getColumnIds<TData>(columns: ColumnDef<TData>[]) {
  return columns
    .map((column) => {
      if (column.id) return column.id
      if ("accessorKey" in column && typeof column.accessorKey === "string") {
        return column.accessorKey
      }
      return undefined
    })
    .filter((columnId): columnId is string => Boolean(columnId))
}

function sameOrder(a: string[], b: string[]) {
  return a.length === b.length && a.every((id, index) => id === b[index])
}

export type UseColumnOrderOptions<TData> = {
  columns: ColumnDef<TData>[]
  /** When false, does not sync or own column-order state. */
  enabled?: boolean
  /** Controlled column order (skips internal state when set with `onColumnOrderChange`). */
  columnOrder?: string[]
  onColumnOrderChange?: OnChangeFn<string[]>
}

/**
 * Owns (or accepts) column order state for drag-reorder.
 * Returns a feature slice for {@link composeTableFeatures} / {@link useTable}.
 */
export function useColumnOrder<TData>(
  options: UseColumnOrderOptions<TData>
): TableFeatureSlice<TData> {
  const {
    columns,
    enabled = true,
    columnOrder: controlledOrder,
    onColumnOrderChange,
  } = options
  const columnIds = React.useMemo(() => getColumnIds(columns), [columns])

  const [internalOrder, setInternalOrder] = React.useState<string[]>(
    () => columnIds
  )

  React.useEffect(() => {
    if (!enabled) return
    if (controlledOrder !== undefined) return

    setInternalOrder((prevOrder) => {
      const nextOrder = prevOrder.filter((columnId) =>
        columnIds.includes(columnId)
      )
      for (const columnId of columnIds) {
        if (!nextOrder.includes(columnId)) {
          nextOrder.push(columnId)
        }
      }
      const resolved = nextOrder.length > 0 ? nextOrder : columnIds
      return sameOrder(prevOrder, resolved) ? prevOrder : resolved
    })
  }, [columnIds, controlledOrder, enabled])

  const setInternalOrderStable = React.useCallback<OnChangeFn<string[]>>(
    (updater) => {
      setInternalOrder((prev) =>
        typeof updater === "function" ? updater(prev) : updater
      )
    },
    []
  )

  const resolvedOrder = controlledOrder ?? internalOrder
  const resolvedOnChange = onColumnOrderChange ?? setInternalOrderStable

  return React.useMemo(() => {
    if (!enabled) return {}
    return {
      options: {
        state: { columnOrder: resolvedOrder },
        onColumnOrderChange: resolvedOnChange,
      },
    }
  }, [enabled, resolvedOrder, resolvedOnChange])
}
