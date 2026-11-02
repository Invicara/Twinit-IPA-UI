import {
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
} from "@tanstack/react-table"

import { tableDateFilterFn } from "../filters/date-filter"
import { tableSelectFilterFn } from "../filters/faceted-filter"
import { tableRatingFilterFn } from "../filters/rating-filter"
import { tableCheckboxFilterFn } from "../filters/checkbox-filter"
import { tableRangeFilterFn } from "../filters/slider-filter"
import type { TableFeatureSlice, WithFilteringOptions } from "./types"

/** Client or manual filtering, optional faceting models. */
export function withFiltering<TData>(
  options: WithFilteringOptions = {}
): TableFeatureSlice<TData> {
  const { manual = false, faceting = !manual } = options

  const serverSafeFilterFn = Object.assign(() => true, {
    // TanStack auto-picks `inNumberRange` for numeric columns; its autoRemove
    // treats a single timestamp as an empty range and drops the filter.
    autoRemove: () => false,
  })

  return {
    options: {
      manualFiltering: manual,
      getFilteredRowModel: manual ? undefined : getFilteredRowModel(),
      getFacetedRowModel: faceting ? getFacetedRowModel() : undefined,
      getFacetedUniqueValues: faceting ? getFacetedUniqueValues() : undefined,
      getFacetedMinMaxValues: faceting ? getFacetedMinMaxValues() : undefined,
      ...(manual
        ? {
          defaultColumn: {
            filterFn: serverSafeFilterFn,
          },
        }
        : {}),
    },
    mapColumns: manual
      ? undefined
      : (columns) =>
        columns.map((column) => {
          if (column.filterFn) return column
          if (column.meta?.variant === "rating") {
            return { ...column, filterFn: tableRatingFilterFn }
          }
          if (
            column.meta?.variant === "select" ||
            column.meta?.variant === "multiSelect"
          ) {
            return { ...column, filterFn: tableSelectFilterFn }
          }
          if (
            column.meta?.variant === "date" ||
            column.meta?.variant === "dateRange"
          ) {
            return { ...column, filterFn: tableDateFilterFn }
          }
          if (column.meta?.variant === "range" || column.meta?.variant === "number") {
            return { ...column, filterFn: tableRangeFilterFn }
          }
          if (column.meta?.variant === "checkbox") {
            return { ...column, filterFn: tableCheckboxFilterFn }
          }
          return column
        }),
  }
}
