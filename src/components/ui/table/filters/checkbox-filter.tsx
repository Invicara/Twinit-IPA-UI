import type { Column, Row } from "@tanstack/react-table"
import { CheckIcon } from "lucide-react"
import * as React from "react"

import { cn, mergeStyles } from "../../../../lib/utils"
import { Button } from "../../button"
import { useTableQueryControlsDisabled } from "../table-context"
import styles from "../table.module.css"

export interface TableCheckboxFilterProps<TData> {
  column: Column<TData, unknown>
  title?: string
  styleOverrides?: Record<string, string>
}

function isCheckboxFilterActive(value: unknown) {
  return value !== undefined && value !== null && value !== "" && value !== false
}

/** Fold case and drop spaces/hyphens so `Full-Time` matches stored `fulltime`. */
export function normalizeCheckboxToken(value: string) {
  return value.trim().toLowerCase().replace(/[\s_-]+/g, "")
}

export function resolveCheckboxFilterValue(
  raw: string,
  meta?: { checkedValue?: string | boolean; checkedLabel?: string }
): string | boolean {
  const trimmed = raw.trim()
  const normalized = normalizeCheckboxToken(trimmed)
  if (
    meta?.checkedLabel &&
    normalizeCheckboxToken(meta.checkedLabel) === normalized
  ) {
    return meta.checkedValue ?? true
  }
  if (
    meta?.checkedValue != null &&
    normalizeCheckboxToken(String(meta.checkedValue)) === normalized
  ) {
    return meta.checkedValue
  }
  return trimmed
}

/** Client-side `filterFn`: case-insensitive match, ignoring spaces and hyphens. */
export function tableCheckboxFilterFn<TData>(
  row: Row<TData>,
  columnId: string,
  filterValue: unknown
): boolean {
  if (!isCheckboxFilterActive(filterValue)) return true
  return (
    normalizeCheckboxToken(String(row.getValue(columnId))) ===
    normalizeCheckboxToken(String(filterValue))
  )
}

export function TableCheckboxFilter<TData>({
  column,
  title,
  styleOverrides,
}: TableCheckboxFilterProps<TData>) {
  const s = mergeStyles(styles, styleOverrides)
  const queryControlsDisabled = useTableQueryControlsDisabled()
  const checkedValue = column.columnDef.meta?.checkedValue ?? true
  const filterValue = column.getFilterValue()
  const isChecked = isCheckboxFilterActive(filterValue)
  const isCustomString =
    typeof filterValue === "string" &&
    normalizeCheckboxToken(filterValue) !==
      normalizeCheckboxToken(String(checkedValue))
  const defaultLabel = column.columnDef.meta?.checkedLabel ?? title
  const label = isCustomString ? String(filterValue) : defaultLabel

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      disabled={queryControlsDisabled}
      aria-pressed={isChecked}
      className={cn(s.filterTrigger, isChecked && s.filterTriggerActive)}
      onClick={() =>
        column.setFilterValue(isChecked ? undefined : checkedValue)
      }
    >
      <span
        className={s.filterCheckbox}
        data-state={isChecked ? "checked" : "unchecked"}
        aria-hidden
      >
        {isChecked ? <CheckIcon /> : null}
      </span>
      {label}
    </Button>
  )
}
