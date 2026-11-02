import { getPaginationRowModel } from "@tanstack/react-table"

import type { TableFeatureSlice, WithPaginationOptions } from "./types"

/** Client or manual pagination row-model / flags. */
export function withPagination<TData>(
  options: WithPaginationOptions = {}
): TableFeatureSlice<TData> {
  const { manual = false, pageCount } = options

  return {
    options: {
      manualPagination: manual,
      ...(pageCount !== undefined ? { pageCount } : {}),
      getPaginationRowModel: manual ? undefined : getPaginationRowModel(),
    },
  }
}
