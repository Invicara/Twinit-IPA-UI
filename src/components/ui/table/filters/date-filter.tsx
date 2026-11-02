import type { Column, Row } from "@tanstack/react-table"
import * as React from "react"
import type { DateRange } from "react-day-picker"

import { cn, mergeStyles } from "../../../../lib/utils"
import {
  DatePicker,
  DateRangePicker,
  type DateRangeRelativeFlags,
} from "../../calendar"
import { useTableQueryControlsDisabled } from "../table-context"
import { parseTableDateInput, parseTableDateRangeInput } from "../query/format"
import styles from "../table.module.css"

function endOfDayMs(date: Date): number {
  const end = new Date(date)
  end.setHours(23, 59, 59, 999)
  return end.getTime()
}

const ISO_DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/

function dateFromLocalYmd(
  year: number,
  month: number,
  day: number
): Date | undefined {
  const date = new Date(year, month - 1, day)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined
  }
  return date
}

function coerceFilterDate(value: unknown): Date | undefined {
  if (value === undefined || value === null || value === "") return undefined
  if (typeof value === "number") {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? undefined : date
  }
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  if (!trimmed) return undefined
  if (/^-?\d{11,13}$/.test(trimmed)) {
    const date = new Date(Number(trimmed))
    return Number.isNaN(date.getTime()) ? undefined : date
  }
  // Date-only ISO is UTC in the Date constructor; use local midnight so
  // endOfDayMs (local setHours) covers the same calendar day.
  const isoDateOnly = ISO_DATE_ONLY.exec(trimmed)
  if (isoDateOnly) {
    return dateFromLocalYmd(
      Number(isoDateOnly[1]),
      Number(isoDateOnly[2]),
      Number(isoDateOnly[3])
    )
  }
  const date = new Date(trimmed)
  return Number.isNaN(date.getTime()) ? undefined : date
}

/** Client-side `filterFn`: calendar day or `[from, to]` range. Unparseable values match no rows. */
export function tableDateFilterFn<TData>(
  row: Row<TData>,
  columnId: string,
  filterValue: unknown
): boolean {
  if (filterValue === undefined || filterValue === null || filterValue === "") {
    return true
  }

  const ts = Number(row.getValue(columnId))
  if (Number.isNaN(ts)) return false

  if (Array.isArray(filterValue)) {
    if (!filterValue[0] && !filterValue[1]) return true
    const from = coerceFilterDate(filterValue[0])
    const to = coerceFilterDate(filterValue[1])
    if (filterValue[0] && !from) return false
    if (filterValue[1] && !to) return false
    if (from != null && ts < from.getTime()) return false
    if (to != null && ts > endOfDayMs(to)) return false
    return true
  }

  if (typeof filterValue === "string") {
    const range = parseTableDateRangeInput(filterValue)
    if (!range) return false
    const [from, to] = range
    return ts >= from.getTime() && ts <= endOfDayMs(to)
  }

  const day = coerceFilterDate(filterValue)
  if (!day) return false
  return ts >= day.getTime() && ts <= endOfDayMs(day)
}

Object.assign(tableDateFilterFn, { autoRemove: () => false })

function parseAsDate(value: number | string | undefined): Date | undefined {
  if (value === undefined) return undefined
  if (typeof value === "number") {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? undefined : date
  }
  const trimmed = value.trim()
  if (!trimmed) return undefined
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    const date = new Date(Number(trimmed))
    return Number.isNaN(date.getTime()) ? undefined : date
  }
  return parseTableDateInput(trimmed)
}

function parseColumnFilterValue(value: unknown): Array<number | string | undefined> {
  if (value === null || value === undefined) return []
  if (Array.isArray(value)) return value
  if (typeof value === "string" || typeof value === "number") return [value]
  return []
}

export interface TableDateFilterProps<TData> extends DateRangeRelativeFlags {
  column: Column<TData, unknown>
  title?: string
  multiple?: boolean
  styleOverrides?: Record<string, string>
}

export function TableDateFilter<TData>({
  column,
  title,
  multiple,
  styleOverrides,
  showToday,
  showThisWeek,
  showThisMonth,
  showThisQuarter,
  showThisYear,
}: TableDateFilterProps<TData>) {
  const s = mergeStyles(styles, styleOverrides)
  const queryControlsDisabled = useTableQueryControlsDisabled()
  const isRange =
    multiple ?? column.columnDef.meta?.variant === "dateRange"
  const meta = column.columnDef.meta
  const relativeFlags: DateRangeRelativeFlags = {
    showToday: showToday ?? meta?.showToday,
    showThisWeek: showThisWeek ?? meta?.showThisWeek,
    showThisMonth: showThisMonth ?? meta?.showThisMonth,
    showThisQuarter: showThisQuarter ?? meta?.showThisQuarter,
    showThisYear: showThisYear ?? meta?.showThisYear,
  }
  const columnFilterValue = column.getFilterValue()
  const rawLabel =
    typeof columnFilterValue === "string" &&
      columnFilterValue.trim() !== "" &&
      parseAsDate(columnFilterValue) === undefined
      ? columnFilterValue
      : undefined

  const singleValue = React.useMemo(() => {
    if (isRange || columnFilterValue === undefined || columnFilterValue === null) {
      return undefined
    }
    const timestamps = parseColumnFilterValue(columnFilterValue)
    return parseAsDate(timestamps[0])
  }, [columnFilterValue, isRange])

  const rangeValue = React.useMemo<DateRange | undefined>(() => {
    if (!isRange) return undefined
    if (!columnFilterValue) return undefined

    const timestamps = parseColumnFilterValue(columnFilterValue)
    const from = parseAsDate(timestamps[0])
    const to = parseAsDate(timestamps[1])
    if (!from && !to) return undefined
    return { from, to }
  }, [columnFilterValue, isRange])

  const hasValue = isRange
    ? Boolean(rangeValue?.from || rangeValue?.to || rawLabel)
    : Boolean(singleValue || rawLabel)

  const onClear = React.useCallback(() => {
    column.setFilterValue(undefined)
  }, [column])

  const sharedPickerProps = {
    placeholder: title,
    displayFormat: "MMM d, yyyy",
    size: "sm" as const,
    hideChevron: true,
    showClearTrigger: hasValue,
    onClear,
    clearAriaLabel: `Clear ${title} filter`,
    showPopoverClear: hasValue,
    triggerClassName: cn(s.filterTrigger, hasValue && s.filterTriggerActive),
    popoverContentClassName: s.filterPopoverContentCalendar,
    styleOverrides,
    triggerTestId: "ipa_table_date_filter",
    closeOnSelect: !isRange,
    triggerLabel: rawLabel,
    disabled: queryControlsDisabled,
  }

  if (isRange) {
    return (
      <DateRangePicker
        {...sharedPickerProps}
        {...relativeFlags}
        value={rangeValue}
        numberOfMonths={1}
        closeOnSelect={false}
        onChange={(range) => {
          if (!range) {
            column.setFilterValue(undefined)
            return
          }
          const from = range.from?.getTime()
          const to = range.to?.getTime()
          column.setFilterValue(
            from || to
              ? [
                from != null ? String(from) : "",
                to != null ? String(to) : "",
              ]
              : undefined
          )
        }}
      />
    )
  }

  return (
    <DatePicker
      {...sharedPickerProps}
      value={singleValue}
      onChange={(date) =>
        column.setFilterValue(
          date == null ? undefined : String(date.getTime())
        )
      }
    />
  )
}
