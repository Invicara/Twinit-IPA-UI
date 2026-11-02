import { withFiltering } from "./with-filtering"
import { withPagination } from "./with-pagination"
import { withSorting } from "./with-sorting"
import { composeTableFeatures } from "./compose"
import type { TableFeatureSlice, WithServerModeOptions } from "./types"

/**
 * Manual sorting, filtering, and pagination for server-driven tables.
 * Pass already-sliced `data` and `pageCount`.
 */
export function withServerMode<TData>(
  options: WithServerModeOptions = {}
): TableFeatureSlice<TData> {
  const { pageCount, rowCount, enableFaceting = false, enableMultiSort } = options

  return composeTableFeatures(
    withSorting<TData>({ manual: true, enableMultiSort }),
    withFiltering<TData>({ manual: true, faceting: enableFaceting }),
    withPagination<TData>({ manual: true, pageCount }),
    {
      meta: {
        serverMode: true,
        ...(rowCount !== undefined ? { rowCount } : {}),
      },
    }
  )
}
