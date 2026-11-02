import type { Column, Table } from "@tanstack/react-table"
import { Check, ListFilter, X } from "lucide-react"
import * as React from "react"

import { cn, mergeStyles } from "../../../../lib/utils"
import { Badge } from "../../badge"
import { Button } from "../../button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../command"
import { Input } from "../../input"
import { Popover, PopoverContent, PopoverTrigger } from "../../popover"
import {
  formatTableDate,
  parseTableDateInput,
  parseTableDateRangeInput,
} from "../query/format"
import type { TableFilterOption, TableFilterVariant } from "../table.types"
import { getFilterableColumnsInDisplayOrder } from "../query/utils"
import { useResolvedTable, useTableQueryControlsDisabled } from "../table-context"
import { tableLabelSearchScore } from "../label-search"
import styles from "../table.module.css"
import { TablePopoverClose } from "./popover-close"
import { resolveCheckboxFilterValue } from "./checkbox-filter"
import { parseRatingFilterValue } from "./rating-filter"
import { TableFilterResetButton } from "./reset-button"

function resolveSelectFilterValues(
  raw: string,
  options?: TableFilterOption[]
) {
  return raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const lower = part.toLowerCase()
      const match = options?.find(
        (option) =>
          option.value.toLowerCase() === lower ||
          option.label.toLowerCase() === lower
      )
      return match?.value ?? part
    })
}

const RANGE_NUMBER = /^(\d+(?:\.\d+)?)/

/**
 * Always returns one number to another.
 * `to` is the separator with or without spaces. ` - ` (a gap on both sides) is too.
 * A `-` with digits directly on its right, and no digit directly on its left, is a minus sign.
 * Other dashes are dropped. One remaining number becomes `[n, n]`.
 */
function parseRangeMenuValue(trimmed: string): [number, number] | undefined {
  const numbers: number[] = []
  let index = 0

  while (index < trimmed.length) {
    const char = trimmed[index]

    if (/\s/.test(char) || char === "," || char === "–") {
      index += 1
      continue
    }

    if (isRangeSeparatorWord(trimmed, index)) {
      index += 2
      continue
    }

    if (char === "-") {
      const previous = index > 0 ? trimmed[index - 1] : ""
      const next = index + 1 < trimmed.length ? trimmed[index + 1] : ""
      const gapOnBothSides = /\s/.test(previous) && /\s/.test(next)
      const minusForNextNumber = /\d/.test(next) && !/\d/.test(previous)

      if (gapOnBothSides) {
        index += 1
        continue
      }

      if (minusForNextNumber) {
        const match = RANGE_NUMBER.exec(trimmed.slice(index + 1))
        if (!match) return undefined
        numbers.push(-Number(match[1]))
        index += 1 + match[1].length
        continue
      }

      index += 1
      continue
    }

    const match = RANGE_NUMBER.exec(trimmed.slice(index))
    if (!match) return undefined
    numbers.push(Number(match[1]))
    index += match[1].length
  }

  if (numbers.length === 0) return undefined
  if (numbers.length === 1) return [numbers[0], numbers[0]]
  return [numbers[0], numbers[1]]
}

function isRangeSeparatorWord(input: string, index: number) {
  return input.slice(index, index + 2).toLowerCase() === "to"
}

function formatFilterValue(value: unknown, variant?: TableFilterVariant) {
  if (value === undefined || value === null || value === "") return ""

  if (variant === "date" || variant === "dateRange") {
    if (Array.isArray(value)) {
      const formatted = value
        .map((item) => formatTableDate(item as number | string))
        .filter(Boolean)
        .join(" - ")
      return formatted || value.map(String).join(" - ")
    }
    return formatTableDate(value as number | string) || String(value)
  }

  if (Array.isArray(value)) return value.join(", ")
  return String(value)
}

export function applyFilterMenuValue<TData>(
  column: Column<TData, unknown>,
  raw: string
) {
  const trimmed = raw.trim()
  if (!trimmed) return

  const variant = column.columnDef.meta?.variant ?? "text"

  if (variant === "multiSelect" || variant === "select") {
    column.setFilterValue(
      resolveSelectFilterValues(trimmed, column.columnDef.meta?.options)
    )
    return
  }

  if (variant === "rating") {
    const parsed = parseRatingFilterValue(trimmed)
    if (parsed <= 0) {
      column.setFilterValue(undefined)
      return
    }
    column.setFilterValue({
      operator: "gte",
      value: String(parsed),
      variant: "rating",
      filterId: `${column.id}-gte`,
    })
    return
  }

  if (variant === "range") {
    const parts = trimmed.split(/[,–-]/).map((part) => part.trim()).filter(Boolean)
    if (
      parts.length === 2 &&
      parts.every((part) => /^-?\d+(\.\d+)?$/.test(part))
    ) {
      column.setFilterValue([Number(parts[0]), Number(parts[1])])
      return
    }
    column.setFilterValue(trimmed)
    return
  }

  if (variant === "checkbox" || variant === "boolean") {
    column.setFilterValue(
      resolveCheckboxFilterValue(trimmed, column.columnDef.meta)
    )
    return
  }

  if (variant === "dateRange") {
    const range = parseTableDateRangeInput(trimmed)
    if (!range) {
      column.setFilterValue(trimmed)
      return
    }
    column.setFilterValue([
      String(range[0].getTime()),
      String(range[1].getTime()),
    ])
    return
  }

  if (variant === "date") {
    const day = parseTableDateInput(trimmed)
    if (!day) {
      column.setFilterValue(trimmed)
      return
    }
    column.setFilterValue(String(day.getTime()))
    return
  }

  column.setFilterValue(trimmed)
}

export interface TableFilterChipsProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table?: Table<TData>
  styleOverrides?: Record<string, string>
}

export function TableFilterChips<TData>({
  table: tableProp,
  className,
  styleOverrides,
  ...props
}: TableFilterChipsProps<TData>) {
  const table = useResolvedTable(tableProp)
  const s = mergeStyles(styles, styleOverrides)
  const activeFilters = table.getState().columnFilters
  const filterableColumnOrder = React.useMemo(
    () =>
      getFilterableColumnsInDisplayOrder(table).map((column) => column.id),
    [table, table.getState().columnOrder, table.getState().columnVisibility]
  )

  const orderedActiveFilters = React.useMemo(
    () =>
      [...activeFilters].sort(
        (left, right) =>
          filterableColumnOrder.indexOf(left.id) -
          filterableColumnOrder.indexOf(right.id)
      ),
    [activeFilters, filterableColumnOrder]
  )

  const onRemoveFilter = React.useCallback(
    (columnId: string) => {
      table.getColumn(columnId)?.setFilterValue(undefined)
    },
    [table]
  )

  if (!orderedActiveFilters.length) return null

  return (
    <div className={cn(s.filterChipList, className)} {...props}>
      {orderedActiveFilters.map((filter) => {
        const column = table.getColumn(filter.id)
        const label = column?.columnDef.meta?.label ?? filter.id
        return (
          <Badge key={filter.id} variant="secondary" className={s.filterChip}>
            {label}: {formatFilterValue(filter.value, column?.columnDef.meta?.variant)}
            <button
              type="button"
              className={s.filterChipRemove}
              aria-label={`Remove ${label} filter`}
              onClick={() => onRemoveFilter(filter.id)}
            >
              <X size={12} aria-hidden />
            </button>
          </Badge>
        )
      })}
    </div>
  )
}

export interface TableFilterMenuTriggerProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table?: Table<TData>
  styleOverrides?: Record<string, string>
}

export function TableFilterMenuTrigger<TData>({
  table: tableProp,
  className,
  styleOverrides,
  ...props
}: TableFilterMenuTriggerProps<TData>) {
  const table = useResolvedTable(tableProp)
  const s = mergeStyles(styles, styleOverrides)
  const queryControlsDisabled = useTableQueryControlsDisabled()
  const [open, setOpen] = React.useState(false)
  const [selectedColumn, setSelectedColumn] = React.useState<Column<TData> | null>(
    null
  )
  const [inputValue, setInputValue] = React.useState("")

  const filterableColumns = React.useMemo(
    () => getFilterableColumnsInDisplayOrder(table),
    [table, table.getState().columnOrder, table.getState().columnVisibility]
  )
  const columnFilters = table.getState().columnFilters
  const hasActiveFilters = columnFilters.length > 0

  React.useEffect(() => {
    if (queryControlsDisabled) setOpen(false)
  }, [queryControlsDisabled])

  const onOpenChange = React.useCallback((nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      setSelectedColumn(null)
      setInputValue("")
    }
  }, [])

  const onResetFilters = React.useCallback(() => {
    table.resetColumnFilters()
    setSelectedColumn(null)
    setInputValue("")
    onOpenChange(false)
  }, [onOpenChange, table])

  const onApplyFilter = React.useCallback(() => {
    if (!selectedColumn || !inputValue.trim()) return
    applyFilterMenuValue(selectedColumn, inputValue)
    onOpenChange(false)
  }, [inputValue, onOpenChange, selectedColumn])

  return (
    <div className={cn(s.filterMenuTriggerWrap, className)} {...props}>
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            className={cn(
              s.filterTrigger,
              s.filterMenuTrigger,
              hasActiveFilters && s.filterTriggerActive
            )}
            aria-label="Filter"
            disabled={queryControlsDisabled}
          >
            <ListFilter aria-hidden />
            <span className={s.filterMenuTriggerLabel}>Filter</span>
            {hasActiveFilters ? (
              <Badge variant="secondary" className={s.sortCountBadge}>
                {columnFilters.length}
              </Badge>
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          collisionPadding={8}
          stickPlacement
          className={cn(
            s.filterCommandPopover,
            s.searchPopover,
            s.popoverWithClose,
            s.commandListHover
          )}
        >
          <TablePopoverClose styleOverrides={styleOverrides} />
          {!selectedColumn ? (
            <Command filter={tableLabelSearchScore}>
              <CommandInput placeholder="Filter by column..." />
              <CommandList>
                <CommandEmpty>No columns found.</CommandEmpty>
                <CommandGroup>
                  {filterableColumns.map((column) => {
                    const isFiltered = column.getIsFiltered()
                    return (
                      <CommandItem
                        key={column.id}
                        value={column.columnDef.meta?.label ?? column.id}
                        className={s.filterMenuItem}
                        onSelect={() => {
                          if (isFiltered) {
                            column.setFilterValue(undefined)
                            return
                          }
                          setSelectedColumn(column)
                          setInputValue("")
                        }}
                      >
                        <span className={s.filterMenuItemLabel}>
                          {column.columnDef.meta?.label ?? column.id}
                        </span>
                        {isFiltered ? (
                          <Check aria-hidden className={s.menuItemCheck} />
                        ) : null}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </CommandList>
              {hasActiveFilters ? (
                <div className={s.filterResetFooter}>
                  <TableFilterResetButton
                    styleOverrides={styleOverrides}
                    onClick={onResetFilters}
                  />
                </div>
              ) : null}
            </Command>
          ) : (
            <div className={s.filterMenuForm}>
              <p className={s.filterFieldLabel}>
                {selectedColumn.columnDef.meta?.label ?? selectedColumn.id}
              </p>
              <Input
                className={s.filterTextInputWide}
                placeholder={
                  selectedColumn.columnDef.meta?.placeholder ?? "Enter value..."
                }
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") onApplyFilter()
                }}
                autoFocus
              />
              <div className={s.filterMenuActions}>
                <Button variant="tertiary" size="sm" onClick={() => setSelectedColumn(null)}>
                  Back
                </Button>
                <Button variant="default" size="sm" onClick={onApplyFilter}>
                  Apply
                </Button>
              </div>
              {hasActiveFilters ? (
                <div className={s.filterResetFooter}>
                  <TableFilterResetButton
                    styleOverrides={styleOverrides}
                    onClick={onResetFilters}
                  />
                </div>
              ) : null}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}

export interface TableFilterMenuProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table?: Table<TData>
  styleOverrides?: Record<string, string>
}

/** @deprecated Prefer `TableFilterChips` + `TableFilterMenuTrigger` in `Table.Toolbar`. */
export function TableFilterMenu<TData>({
  table: tableProp,
  className,
  styleOverrides,
  ...props
}: TableFilterMenuProps<TData>) {
  const table = useResolvedTable(tableProp)
  const s = mergeStyles(styles, styleOverrides)

  return (
    <div className={cn(s.filterMenuList, className)} {...props}>
      <TableFilterChips table={table} styleOverrides={styleOverrides} />
      <TableFilterMenuTrigger table={table} styleOverrides={styleOverrides} />
    </div>
  )
}
