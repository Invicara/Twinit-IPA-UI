import type { Column } from "@tanstack/react-table"
import * as React from "react"

import { cn, mergeStyles } from "../../../../lib/utils"
import { Input } from "../../input"
import type { TableFilterVariant } from "../table.types"
import { useTableQueryControlsDisabled } from "../table-context"
import styles from "../table.module.css"
import { TableDateFilter } from "./date-filter"
import { TableFacetedFilter } from "./faceted-filter"
import { TableSliderFilter } from "./slider-filter"
import { TableCheckboxFilter } from "./checkbox-filter"
import { TableRatingFilter } from "./rating-filter"

export interface TableColumnFilterProps<TData> {
  column: Column<TData, unknown>
  title?: string
  styleOverrides?: Record<string, string>
}

export type TableFilterComponent<TData = unknown> = React.ComponentType<
  TableColumnFilterProps<TData>
>

export type TableFilterComponentMap<TData = unknown> = Partial<
  Record<TableFilterVariant, TableFilterComponent<TData>>
>

function TableTextFilter<TData>({
  column,
  title,
  styleOverrides,
}: TableColumnFilterProps<TData>) {
  const s = mergeStyles(styles, styleOverrides)
  const queryControlsDisabled = useTableQueryControlsDisabled()
  const columnMeta = column.columnDef.meta
  const variant = columnMeta?.variant
  const label = title ?? columnMeta?.label ?? column.id

  const raw = column.getFilterValue()
  const text =
    typeof raw === "string" || typeof raw === "number" ? String(raw) : ""

  return (
    <Input
      clearable
      fitContent
      size="sm"
      className={cn(
        s.filterTextInput,
        variant === "number" && s.filterNumberInput,
        text.length > 0 && s.filterInputFilled
      )}
      type={variant === "number" ? "number" : "text"}
      placeholder={columnMeta?.placeholder ?? label}
      value={text}
      disabled={queryControlsDisabled}
      onChange={(event) => column.setFilterValue(event.target.value)}
      aria-label={`Filter ${label}`}
    />
  )
}

function TableSelectFilter<TData>({
  column,
  title,
  styleOverrides,
}: TableColumnFilterProps<TData>) {
  const columnMeta = column.columnDef.meta
  return (
    <TableFacetedFilter
      column={column}
      title={title ?? columnMeta?.label ?? column.id}
      options={columnMeta?.options ?? []}
      multiple={columnMeta?.variant === "multiSelect"}
      styleOverrides={styleOverrides}
    />
  )
}

function TableDateRangeFilterAdapter<TData>({
  column,
  title,
  styleOverrides,
}: TableColumnFilterProps<TData>) {
  const columnMeta = column.columnDef.meta
  return (
    <TableDateFilter
      column={column}
      title={title ?? columnMeta?.label ?? column.id}
      multiple={columnMeta?.variant === "dateRange"}
      styleOverrides={styleOverrides}
    />
  )
}

function TableRangeFilterAdapter<TData>({
  column,
  title,
  styleOverrides,
}: TableColumnFilterProps<TData>) {
  const columnMeta = column.columnDef.meta
  return (
    <TableSliderFilter
      column={column}
      title={title ?? columnMeta?.label ?? column.id}
      styleOverrides={styleOverrides}
    />
  )
}

/** Default variant → filter component map used by {@link TableToolbar}. */
export const defaultTableFilterComponents: TableFilterComponentMap = {
  text: TableTextFilter,
  number: TableTextFilter,
  boolean: TableTextFilter,
  select: TableSelectFilter,
  multiSelect: TableSelectFilter,
  date: TableDateRangeFilterAdapter,
  dateRange: TableDateRangeFilterAdapter,
  range: TableRangeFilterAdapter,
  rating: TableRatingFilter,
  checkbox: TableCheckboxFilter,
}

/**
 * Resolve which filter component to render for a column:
 * 1. `column.columnDef.meta.filter` (hot-swap per column)
 * 2. `components[variant]` override map
 * 3. built-in default for `meta.variant` (falls back to text)
 */
export function resolveColumnFilterComponent<TData>(
  column: Column<TData, unknown>,
  components?: TableFilterComponentMap<TData>
): TableFilterComponent<TData> {
  const metaFilter = column.columnDef.meta?.filter
  if (metaFilter) {
    return metaFilter as TableFilterComponent<TData>
  }

  const variant = column.columnDef.meta?.variant ?? "text"
  const fromMap = components?.[variant] ?? defaultTableFilterComponents[variant]
  return (fromMap ?? TableTextFilter) as TableFilterComponent<TData>
}

export function TableColumnFilter<TData>({
  column,
  components,
  styleOverrides,
}: {
  column: Column<TData, unknown>
  components?: TableFilterComponentMap<TData>
  styleOverrides?: Record<string, string>
}) {
  const Filter = resolveColumnFilterComponent(column, components)
  const title = column.columnDef.meta?.label ?? column.id
  return (
    <Filter column={column} title={title} styleOverrides={styleOverrides} />
  )
}
