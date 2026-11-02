import type { Column, Table, Row } from "@tanstack/react-table"
import { Check, PlusCircle, X } from "lucide-react"
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
import { Popover, PopoverContent, PopoverTrigger } from "../../popover"
import { Separator } from "../../separator"
import type { TableFilterOption } from "../table.types"
import { useOptionalTableChrome, useTableQueryControlsDisabled } from "../table-context"
import styles from "../table.module.css"
import { TablePopoverClose } from "./popover-close"
import { TableFilterResetButton } from "./reset-button"
import { tableLabelSearchScore } from "../label-search"

export interface TableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  options: TableFilterOption[]
  multiple?: boolean
  styleOverrides?: Record<string, string>
}

function selectedSetFromFilterValue(value: unknown): Set<string> {
  if (Array.isArray(value)) {
    return new Set(value.map(String).filter(Boolean))
  }
  if (typeof value === "string" && value.trim()) {
    return new Set(
      value.split(",").map((part) => part.trim()).filter(Boolean)
    )
  }
  return new Set()
}

/** Counts for the rows on the current page, so they follow the page size. */
function countValuesOnCurrentPage<TData, TValue>(
  table: Table<TData> | undefined,
  column: Column<TData, TValue> | undefined
) {
  if (!table || !column) return undefined
  const counts = new Map<string, number>()
  for (const row of table.getRowModel().rows) {
    for (const value of row.getUniqueValues(column.id)) {
      if (value == null || value === "") continue
      const key = String(value)
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
  }
  return counts
}

function selectedListFromFilterValue(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean)
  if (typeof value === "string" && value.trim()) {
    return value.split(",").map((part) => part.trim()).filter(Boolean)
  }
  return []
}

/** Client-side `filterFn`: case-insensitive equality against one or more selected values. */
export function tableSelectFilterFn<TData>(
  row: Row<TData>,
  columnId: string,
  filterValue: unknown
): boolean {
  const selected = selectedListFromFilterValue(filterValue)
  if (!selected.length) return true
  const cell = String(row.getValue(columnId) ?? "").toLowerCase()
  return selected.some((value) => value.toLowerCase() === cell)
}

export function TableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  multiple = false,
  styleOverrides,
}: TableFacetedFilterProps<TData, TValue>) {
  const s = mergeStyles(styles, styleOverrides)
  const queryControlsDisabled = useTableQueryControlsDisabled()
  const [open, setOpen] = React.useState(false)
  const table = useOptionalTableChrome<TData>()?.table

  React.useEffect(() => {
    if (queryControlsDisabled) setOpen(false)
  }, [queryControlsDisabled])
  const pageCounts = countValuesOnCurrentPage(table, column)
  const columnFilterValue = column?.getFilterValue()
  const selectedValues = selectedSetFromFilterValue(columnFilterValue)

  const onItemSelect = React.useCallback(
    (option: TableFilterOption, isSelected: boolean) => {
      if (!column) return

      if (multiple) {
        const next = new Set(selectedValues)
        if (isSelected) next.delete(option.value)
        else next.add(option.value)
        const values = Array.from(next)
        column.setFilterValue(values.length ? values : undefined)
      } else {
        column.setFilterValue(isSelected ? undefined : [option.value])
        setOpen(false)
      }
    },
    [column, multiple, selectedValues]
  )

  const onReset = React.useCallback(
    (event?: React.MouseEvent) => {
      event?.stopPropagation()
      column?.setFilterValue(undefined)
      setOpen(false)
    },
    [column]
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          disabled={queryControlsDisabled}
          className={cn(
            s.filterTrigger,
            selectedValues.size > 0 && s.filterTriggerActive
          )}
        >
          {selectedValues.size > 0 ? (
            <span
              role="button"
              aria-label={`Clear ${title} filter`}
              tabIndex={0}
              className={cn(s.filterTriggerIcon, s.filterTriggerClear)}
              onClick={onReset}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  onReset()
                }
              }}
            >
              <X aria-hidden />
            </span>
          ) : (
            <span className={s.filterTriggerIcon}>
              <PlusCircle aria-hidden />
            </span>
          )}
          {title}
          {selectedValues.size > 0 ? (
            <>
              <Separator
                orientation="vertical"
                className={s.filterTriggerSeparator}
              />
              <span className={s.filterTriggerBadges}>
                {selectedValues.size > 2 ? (
                  <Badge variant="secondary" className={s.filterTriggerBadge}>
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  Array.from(selectedValues).map((value) => {
                    const option = options.find((item) => item.value === value)
                    return (
                      <Badge
                        variant="secondary"
                        className={s.filterTriggerBadge}
                        key={value}
                      >
                        {option?.label ?? String(value)}
                      </Badge>
                    )
                  })
                )}
              </span>
            </>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        collisionPadding={8}
        stickPlacement
        className={cn(
          s.filterPopoverContent,
          s.searchPopover,
          s.popoverWithClose,
          s.commandListHover
        )}
      >
        <TablePopoverClose styleOverrides={styleOverrides} />
        <Command filter={tableLabelSearchScore}>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value)
                const count = pageCounts
                  ? (pageCounts.get(option.value) ?? 0)
                  : option.count
                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => onItemSelect(option, isSelected)}
                  >
                    <span
                      className={cn(
                        styles.checkSlot,
                        isSelected && styles.checkSlotChecked
                      )}
                    >
                      {isSelected ? <Check aria-hidden size={12} /> : null}
                    </span>
                    <span>{option.label}</span>
                    {count !== undefined ? (
                      <span className={styles.itemCount}>{count}</span>
                    ) : null}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
          {selectedValues.size > 0 ? (
            <div className={s.filterResetFooter}>
              <TableFilterResetButton
                styleOverrides={styleOverrides}
                onClick={() => onReset()}
              />
            </div>
          ) : null}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
