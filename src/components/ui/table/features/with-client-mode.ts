import { composeTableFeatures } from "./compose"
import type { TableFeatureSlice, WithClientModeOptions } from "./types"
import { withFiltering } from "./with-filtering"
import { withPagination } from "./with-pagination"
import { withSorting } from "./with-sorting"

/**
 * Client-side sorting, filtering, and pagination.
 * Optional sugar for listing the three slices by hand.
 */
export function withClientMode<TData>(
  options: WithClientModeOptions = {}
): TableFeatureSlice<TData> {
  const { enableMultiSort, faceting, pageCount } = options

  return composeTableFeatures(
    withSorting<TData>({ enableMultiSort }),
    withFiltering<TData>({ faceting }),
    withPagination<TData>({ pageCount })
  )
}
