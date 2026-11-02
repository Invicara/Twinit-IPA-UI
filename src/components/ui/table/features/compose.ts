import type { ColumnDef, TableOptions } from "@tanstack/react-table"

import type { TableFeatureSlice } from "./types"

function mergeDefaultColumn<TData>(
  base: TableOptions<TData>["defaultColumn"] | undefined,
  next: TableOptions<TData>["defaultColumn"] | undefined
): TableOptions<TData>["defaultColumn"] | undefined {
  if (!base) return next
  if (!next) return base
  return { ...base, ...next }
}

/**
 * Deep-ish merge of feature slices: `state` / `meta` / `defaultColumn` shallow-merge;
 * later slices win on conflicting option keys; `mapColumns` compose left-to-right.
 */
export function composeTableFeatures<TData>(
  ...slices: Array<TableFeatureSlice<TData> | false | null | undefined>
): TableFeatureSlice<TData> {
  const active = slices.filter(Boolean) as TableFeatureSlice<TData>[]

  return active.reduce<TableFeatureSlice<TData>>(
    (acc, slice) => {
      const mapColumns = (() => {
        if (!acc.mapColumns && !slice.mapColumns) return undefined
        return (columns: ColumnDef<TData>[]) => {
          const afterAcc = acc.mapColumns ? acc.mapColumns(columns) : columns
          return slice.mapColumns ? slice.mapColumns(afterAcc) : afterAcc
        }
      })()

      return {
        kind: slice.kind ?? acc.kind,
        options: {
          ...acc.options,
          ...slice.options,
          state: {
            ...acc.options?.state,
            ...slice.options?.state,
          },
          defaultColumn: mergeDefaultColumn(
            acc.options?.defaultColumn,
            slice.options?.defaultColumn
          ),
          meta: {
            ...acc.options?.meta,
            ...slice.options?.meta,
            ...acc.meta,
            ...slice.meta,
          },
        },
        mapColumns,
        meta: {
          ...acc.meta,
          ...slice.meta,
        },
      }
    },
    {}
  )
}
