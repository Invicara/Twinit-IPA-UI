import {
  getCoreRowModel,
  type ColumnFiltersState,
  type OnChangeFn,
  type TableOptions,
  useReactTable,
} from "@tanstack/react-table"
import * as React from "react"

import {
  composeTableFeatures,
  isColumnOrderSlice,
  useColumnOrder,
  type TableFeatureSlice,
} from "./features"
import type {} from "./table.types"

const LEGACY_USE_TABLE_FLAGS = [
  "selectable",
  "resizable",
  "draggable",
  "serverMode",
  "enableFaceting",
  "manualPagination",
  "manualSorting",
  "manualFiltering",
  "enableRowSelection",
  "enableColumnResizing",
  "columnResizeMode",
  "enableMultiSort",
] as const

type LegacyUseTableFlag = (typeof LEGACY_USE_TABLE_FLAGS)[number]

type LegacyUseTableProps<TData> = UseTableProps<TData> &
  Partial<Record<LegacyUseTableFlag, unknown>>

function warnLegacyUseTableFlags(props: object) {
  if (process.env.NODE_ENV === "production") return

  const found = LEGACY_USE_TABLE_FLAGS.filter(
    (key) =>
      Object.prototype.hasOwnProperty.call(props, key) &&
      (props as Record<string, unknown>)[key] !== undefined
  )
  if (!found.length) return

  console.warn(
    `[ipa-ui useTable] ${found.join(", ")} ${
      found.length === 1 ? "is" : "are"
    } ignored. Enable features with withX() in \`features\` (or omit a slice / use \`condition && withX()\`).`
  )
}

export interface UseTableProps<TData>
  extends Omit<
    TableOptions<TData>,
    | "getCoreRowModel"
    | "getFilteredRowModel"
    | "getPaginationRowModel"
    | "getSortedRowModel"
    | "getFacetedRowModel"
    | "getFacetedUniqueValues"
    | "getFacetedMinMaxValues"
    | "enableRowSelection"
    | "enableColumnResizing"
    | "columnResizeMode"
    | "manualPagination"
    | "manualSorting"
    | "manualFiltering"
    | "enableMultiSort"
  > {
  /**
   * Feature slices to enable. Omitted or empty means core row model only.
   * Disable a feature by leaving it out, or `condition && withX()`.
   *
   * Typed loosely so feature factories do not widen `TData` inference from
   * `data` / `columns`.
   */
  features?: Array<TableFeatureSlice<any> | false | null | undefined>
  /** Total matching rows across all pages (server tables). Overlay for selection summary. */
  rowCount?: number
}

export function useTable<TData>(props: UseTableProps<TData>) {
  warnLegacyUseTableFlags(props)

  const {
    features: featuresProp,
    selectable: _selectable,
    resizable: _resizable,
    draggable: _draggable,
    serverMode: _serverMode,
    enableFaceting: _enableFaceting,
    manualPagination: _manualPagination,
    manualSorting: _manualSorting,
    manualFiltering: _manualFiltering,
    enableRowSelection: _enableRowSelection,
    enableColumnResizing: _enableColumnResizing,
    columnResizeMode: _columnResizeMode,
    enableMultiSort: _enableMultiSort,
    columns,
    defaultColumn,
    onColumnOrderChange,
    onColumnFiltersChange: userOnColumnFiltersChange,
    state,
    meta,
    pageCount,
    rowCount,
    ...tableProps
  } = props as LegacyUseTableProps<TData>

  const featureList = (featuresProp ?? []).filter(
    Boolean
  ) as TableFeatureSlice<TData>[]

  const wantsColumnOrder = featureList.some(isColumnOrderSlice)

  const presetFeatures = composeTableFeatures<TData>(...featureList)

  const mappedColumns = React.useMemo(
    () =>
      presetFeatures.mapColumns
        ? presetFeatures.mapColumns(columns)
        : columns,
    [columns, presetFeatures]
  )

  const columnOrderFeature = useColumnOrder({
    columns: mappedColumns,
    enabled: wantsColumnOrder,
    columnOrder: state?.columnOrder,
    onColumnOrderChange,
  })

  const composed = wantsColumnOrder
    ? composeTableFeatures(presetFeatures, columnOrderFeature)
    : presetFeatures

  const resolvedManualPagination = Boolean(
    composed.options?.manualPagination
  )

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return
    if (!resolvedManualPagination) return
    if (typeof pageCount === "number" && pageCount >= 0) return
    if (
      typeof composed.options?.pageCount === "number" &&
      composed.options.pageCount >= 0
    ) {
      return
    }

    console.warn(
      "[ipa-ui useTable] withServerMode / withPagination({ manual: true }) expects `pageCount` (total pages, >= 0)."
    )
  }, [resolvedManualPagination, pageCount, composed.options?.pageCount])

  const resolvedDefaultColumn = React.useMemo(() => {
    const merged = {
      ...composed.options?.defaultColumn,
      ...defaultColumn,
    }
    return Object.keys(merged).length > 0 ? merged : undefined
  }, [composed.options?.defaultColumn, defaultColumn])

  const resolvedMeta = React.useMemo(
    () => ({
      ...composed.meta,
      ...composed.options?.meta,
      ...meta,
      ...(rowCount !== undefined ? { rowCount } : {}),
    }),
    [composed.meta, composed.options?.meta, meta, rowCount]
  )

  const featureState = composed.options?.state
  const {
    state: _omitFeatureState,
    defaultColumn: _omitDefaultColumn,
    meta: _omitMeta,
    columns: _omitColumns,
    onColumnOrderChange: featureOnColumnOrderChange,
    enableRowSelection: featureEnableRowSelection,
    enableColumnResizing: featureEnableColumnResizing,
    columnResizeMode: featureColumnResizeMode,
    pageCount: featurePageCount,
    ...featureRest
  } = composed.options ?? {}

  const tableRef = React.useRef<ReturnType<typeof useReactTable<TData>> | null>(
    null
  )

  const onColumnFiltersChange = React.useCallback<
    OnChangeFn<ColumnFiltersState>
  >(
    (updater) => {
      const instance = tableRef.current
      if (
        instance &&
        Object.keys(instance.getState().rowSelection).length > 0
      ) {
        instance.resetRowSelection()
      }
      if (userOnColumnFiltersChange) {
        userOnColumnFiltersChange(updater)
        return
      }
      instance?.setState((old) => ({
        ...old,
        columnFilters:
          typeof updater === "function"
            ? updater(old.columnFilters)
            : updater,
      }))
    },
    [userOnColumnFiltersChange]
  )

  const table = useReactTable({
    ...tableProps,
    ...featureRest,
    columns: mappedColumns,
    pageCount: pageCount ?? featurePageCount,
    meta: resolvedMeta,
    state: {
      ...featureState,
      ...state,
      ...(wantsColumnOrder
        ? {
            columnOrder:
              state?.columnOrder ?? featureState?.columnOrder ?? [],
          }
        : {}),
    },
    onColumnOrderChange: wantsColumnOrder
      ? (featureOnColumnOrderChange ?? onColumnOrderChange)
      : onColumnOrderChange,
    onColumnFiltersChange,
    enableRowSelection: featureEnableRowSelection,
    enableColumnResizing: featureEnableColumnResizing,
    columnResizeMode: featureColumnResizeMode,
    defaultColumn: resolvedDefaultColumn,
    getCoreRowModel: getCoreRowModel(),
  })

  tableRef.current = table

  return table
}
