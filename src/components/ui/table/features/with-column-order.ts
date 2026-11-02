import type { TableFeatureSlice, WithColumnOrderOptions } from "./types"

export const COLUMN_ORDER_KIND = "columnOrder"

/** Column-order state; `useTable` owns the React state for this slice. */
export function withColumnOrder<TData>(
  options: WithColumnOrderOptions = {}
): TableFeatureSlice<TData> {
  const { handles = true } = options

  return {
    kind: COLUMN_ORDER_KIND,
    meta: {
      columnDrag: handles,
    },
  }
}

export function isColumnOrderSlice<TData>(
  slice: TableFeatureSlice<TData>
): boolean {
  return slice.kind === COLUMN_ORDER_KIND
}
