import { getSortedRowModel } from "@tanstack/react-table"

import type { TableFeatureSlice, WithSortingOptions } from "./types"

/** Client or manual sorting row-model / flags. */
export function withSorting<TData>(
  options: WithSortingOptions = {}
): TableFeatureSlice<TData> {
  const { manual = false, enableMultiSort } = options

  return {
    options: {
      manualSorting: manual,
      ...(enableMultiSort !== undefined ? { enableMultiSort } : {}),
      getSortedRowModel: manual ? undefined : getSortedRowModel(),
    },
  }
}
