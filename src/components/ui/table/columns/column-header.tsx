import type { Column } from "@tanstack/react-table"
import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  EyeOff,
  X,
} from "lucide-react"
import * as React from "react"

import { cn, mergeStyles } from "../../../../lib/utils"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../dropdown-menu"
import { useTableQueryControlsDisabled } from "../table-context"
import styles from "../table.module.css"

export type TableColumnHeaderVariant = "button" | "menu"

export interface TableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>
  label: string
  /** `button` = one-click sort toggle; `menu` = dropdown with sort/hide actions. */
  variant?: TableColumnHeaderVariant
  className?: string
  styleOverrides?: Record<string, string>
}

export function TableColumnHeader<TData, TValue>({
  column,
  label,
  variant = "button",
  className,
  styleOverrides,
}: TableColumnHeaderProps<TData, TValue>) {
  const s = mergeStyles(styles, styleOverrides)
  const queryControlsDisabled = useTableQueryControlsDisabled()
  const canSort = column.getCanSort()
  const canHide = column.getCanHide()
  // Keep the real sort in table state. While the skeleton is up, every
  // header draws the unsorted icon so a held load does not look applied.
  const sorted = queryControlsDisabled ? false : column.getIsSorted()

  if (!canSort && !canHide) {
    return (
      <div
        data-testid="ipa_table_column_header"
        className={cn(s.columnHeader, className)}
      >
        <span className={s.columnHeaderLabel}>{label}</span>
      </div>
    )
  }

  const SortIcon =
    sorted === "asc" ? ChevronUp : sorted === "desc" ? ChevronDown : ChevronsUpDown

  if (variant === "button" && canSort) {
    return (
      <button
        type="button"
        data-testid="ipa_table_column_header"
        className={cn(s.columnHeader, s.columnHeaderSortable, className)}
        onClick={() => column.toggleSorting()}
        disabled={queryControlsDisabled}
        aria-label={`Sort by ${label}`}
      >
        <span className={s.columnHeaderLabel}>{label}</span>
        <SortIcon
          className={cn(s.columnHeaderIcon, sorted && s.columnHeaderIconActive)}
          aria-hidden
        />
      </button>
    )
  }

  if (variant === "button") {
    return (
      <div
        data-testid="ipa_table_column_header"
        className={cn(s.columnHeader, className)}
      >
        <span className={s.columnHeaderLabel}>{label}</span>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        data-testid="ipa_table_column_header"
        className={cn(s.columnHeader, s.columnHeaderTrigger, className)}
        aria-label={`Column menu for ${label}`}
        disabled={queryControlsDisabled}
      >
        <span className={s.columnHeaderLabel}>{label}</span>
        {canSort && (
          <SortIcon
            className={cn(s.columnHeaderIcon, sorted && s.columnHeaderIconActive)}
            aria-hidden
          />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className={s.columnHeaderMenu}>
        {canSort && (
          <>
            <DropdownMenuCheckboxItem
              checked={sorted === "asc"}
              onSelect={() => column.toggleSorting(false)}
            >
              <ChevronUp aria-hidden />
              Asc
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={sorted === "desc"}
              onSelect={() => column.toggleSorting(true)}
            >
              <ChevronDown aria-hidden />
              Desc
            </DropdownMenuCheckboxItem>
          </>
        )}
        {canHide && (
          <DropdownMenuCheckboxItem
            checked={!column.getIsVisible()}
            onSelect={() => column.toggleVisibility(false)}
          >
            <EyeOff aria-hidden />
            Hide
          </DropdownMenuCheckboxItem>
        )}
        {canSort && sorted && (
          <DropdownMenuItem onSelect={() => column.clearSorting()}>
            <X aria-hidden />
            Reset
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
