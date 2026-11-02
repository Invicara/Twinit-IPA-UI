import type { Column, RowData } from "@tanstack/react-table"
import type * as React from "react"

export type TableFilterVariant =
  | "text"
  | "number"
  | "range"
  | "rating"
  | "date"
  | "dateRange"
  | "boolean"
  | "checkbox"
  | "select"
  | "multiSelect"

export interface TableFilterOption {
  label: string
  value: string
  count?: number
}

/** Props passed to custom / registered column filter components. */
export interface TableColumnFilterRenderProps<TData> {
  column: Column<TData, unknown>
  title?: string
  styleOverrides?: Record<string, string>
}

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    label?: string
    placeholder?: string
    variant?: TableFilterVariant
    options?: TableFilterOption[]
    /** Inclusive `[min, max]` for `variant: "range"`. Falls back to faceted min/max.
     * For `variant: "rating"`, `range[1]` is the star count (default 5). */
    range?: [number, number]
    /** Suffix shown on range inputs (e.g. `hr`, `kg`, `%`). */
    unit?: string
    /** Slider / stepper increment for `variant: "range"`. */
    step?: number
    /** Value written when `variant: "checkbox"` is checked (e.g. `"fulltime"`). */
    checkedValue?: string | boolean
    /** Label shown on the checkbox filter trigger (e.g. `"Full-time"`). */
    checkedLabel?: string
    /** Show a Today shortcut on `variant: "dateRange"`. Off by default. */
    showToday?: boolean
    showThisWeek?: boolean
    showThisMonth?: boolean
    showThisQuarter?: boolean
    showThisYear?: boolean
    /**
     * Hot-swap the filter control for this column (same toolbar slot).
     * Must read/write `column.getFilterValue` / `setFilterValue` using the
     * value shape for `variant` (e.g. dateRange → `[fromMs, toMs]` strings).
     */
    filter?: React.ComponentType<TableColumnFilterRenderProps<TData>>
  }

  interface TableMeta<TData extends RowData> {
    /** When true, table was created with `withServerMode` (manual sort/filter/page). */
    serverMode?: boolean
    /** Total matching rows across all pages (for selection / “of N” copy). */
    rowCount?: number
    /** When true, Grid renders the injected selection checkbox column. */
    selectionColumn?: boolean
    /** When true, Grid renders column drag handles. */
    columnDrag?: boolean
    /** When true, Grid renders column resize handles. */
    columnResize?: boolean
  }
}

export interface TableStyleOverrides extends Record<string, string> {}
