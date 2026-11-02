import { createSelectionColumn } from "../columns/selection-column"
import type { TableFeatureSlice, WithSelectionOptions } from "./types"

/** Enables row selection. Prepends the checkbox column unless `column: false`. */
export function withSelection<TData>(
  options: WithSelectionOptions = {}
): TableFeatureSlice<TData> {
  const { column = true } = options

  return {
    options: {
      enableRowSelection: true,
    },
    mapColumns: column
      ? (columns) => [createSelectionColumn<TData>(), ...columns]
      : undefined,
    meta: {
      selectionColumn: column,
    },
  }
}
