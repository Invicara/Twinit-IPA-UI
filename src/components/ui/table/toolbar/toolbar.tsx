import type { Column, Table } from "@tanstack/react-table"
import { X } from "lucide-react"
import * as React from "react"

import { cn, mergeStyles } from "../../../../lib/utils"
import { Button } from "../../button"
import { Input } from "../../input"
import {
  TableFilterChips,
  TableFilterMenuTrigger,
  type TableFilterMenuTriggerProps,
} from "../filters/filter-menu"
import {
  TableColumnFilter,
  type TableFilterComponentMap,
} from "../filters/filter-registry"
import { getFilterableColumnsInDisplayOrder } from "../query/utils"
import {
  useOptionalTableChrome,
  useResolvedTable,
  useTableQueryControlsDisabled,
} from "../table-context"
import { getTablePartSlot, markTablePart } from "../table-part"
import { TableSortList } from "./sort-list"
import { TableViewOptions } from "./view-options"
import styles from "../table.module.css"

export interface TableSearchProps<TData> {
  table?: Table<TData>
  placeholder?: string
  className?: string
  styleOverrides?: Record<string, string>
}

export function TableSearch<TData>({
  table: tableProp,
  placeholder = "Filter rows...",
  className,
  styleOverrides: styleOverridesProp,
}: TableSearchProps<TData>) {
  const ctx = useOptionalTableChrome<TData>()
  const table = useResolvedTable(tableProp)
  const styleOverrides = styleOverridesProp ?? ctx?.styleOverrides
  const s = mergeStyles(styles, styleOverrides)
  const queryControlsDisabled = useTableQueryControlsDisabled()
  const globalFilter = table.getState().globalFilter ?? ""

  return (
    <Input
      clearable
      className={cn(
        s.globalFilter,
        String(globalFilter).length > 0 && s.filterInputFilled,
        className
      )}
      placeholder={placeholder}
      value={String(globalFilter)}
      disabled={queryControlsDisabled}
      onChange={(event) => {
        if (queryControlsDisabled) return
        table.setGlobalFilter(event.target.value)
      }}
      aria-label="Filter table rows"
    />
  )
}

markTablePart(TableSearch as never, "search")

export interface TableFiltersProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table?: Table<TData>
  components?: TableFilterComponentMap<TData>
  renderColumnFilters?: (context: {
    table: Table<TData>
    columns: Column<TData, unknown>[]
  }) => React.ReactNode
  styleOverrides?: Record<string, string>
}

export function TableFilters<TData>({
  table: tableProp,
  components,
  renderColumnFilters,
  className,
  styleOverrides: styleOverridesProp,
  ...props
}: TableFiltersProps<TData>) {
  const ctx = useOptionalTableChrome<TData>()
  const table = useResolvedTable(tableProp)
  const styleOverrides = styleOverridesProp ?? ctx?.styleOverrides
  const filterableColumns = React.useMemo(
    () => getFilterableColumnsInDisplayOrder(table),
    [table, table.getState().columnOrder, table.getState().columnVisibility]
  )

  const content = renderColumnFilters
    ? renderColumnFilters({ table, columns: filterableColumns })
    : filterableColumns.map((column) => (
        <TableColumnFilter
          key={column.id}
          column={column}
          components={components}
          styleOverrides={styleOverrides}
        />
      ))

  if (className) {
    return (
      <div className={className} {...props}>
        {content}
      </div>
    )
  }

  return <>{content}</>
}

markTablePart(TableFilters as never, "filters")

export function TableToolbarFilterMenu<TData>(
  props: TableFilterMenuTriggerProps<TData>
) {
  return <TableFilterMenuTrigger {...props} />
}

markTablePart(TableToolbarFilterMenu as never, "filterMenu")

export interface TableToolbarProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table?: Table<TData>
  /** Placeholder for the default search input when no children are passed. */
  globalFilterPlaceholder?: string
  /**
   * Optional reset handler (e.g. `useTableQueryState().resetFilters`).
   * When omitted, clears TanStack column filters + global filter.
   */
  onResetFilters?: () => void
  styleOverrides?: Record<string, string>
}

function injectTable<TData>(
  element: React.ReactElement,
  table: Table<TData>,
  styleOverrides?: Record<string, string>
) {
  return React.cloneElement(element, {
    table: (element.props as { table?: Table<TData> }).table ?? table,
    styleOverrides:
      (element.props as { styleOverrides?: Record<string, string> })
        .styleOverrides ?? styleOverrides,
  } as Partial<typeof element.props>)
}

/**
 * Toolbar chrome. With no children, renders {@link TableSearch}.
 * Pass parts (`Table.Search`, `Table.Filters`, …) to compose explicitly.
 */
export function TableToolbar<TData>({
  table: tableProp,
  globalFilterPlaceholder = "Filter rows...",
  onResetFilters,
  children,
  className,
  styleOverrides: styleOverridesProp,
  ...props
}: TableToolbarProps<TData>) {
  const ctx = useOptionalTableChrome<TData>()
  const table = useResolvedTable(tableProp)
  const styleOverrides = styleOverridesProp ?? ctx?.styleOverrides
  const s = mergeStyles(styles, styleOverrides)
  const queryControlsDisabled = useTableQueryControlsDisabled()
  const globalFilter = table.getState().globalFilter ?? ""
  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    (typeof globalFilter === "string" && globalFilter.length > 0)

  const onReset = React.useCallback(() => {
    if (onResetFilters) {
      onResetFilters()
      return
    }
    table.setColumnFilters([])
    table.setGlobalFilter("")
  }, [onResetFilters, table])

  const resolvedChildren =
    children === undefined ? (
      <TableSearch placeholder={globalFilterPlaceholder} />
    ) : (
      children
    )

  let search: React.ReactElement | undefined
  let filters: React.ReactElement | undefined
  let sortList: React.ReactElement | undefined
  let viewOptions: React.ReactElement | undefined
  let filterMenu: React.ReactElement | undefined
  const extras: React.ReactNode[] = []

  React.Children.forEach(resolvedChildren, (child) => {
    if (!React.isValidElement(child)) {
      if (child != null && child !== false) extras.push(child)
      return
    }
    const slot = getTablePartSlot(child)
    const injected = injectTable(child, table, styleOverrides)
    if (slot === "search") search = injected
    else if (slot === "filters") filters = injected
    else if (slot === "sortList") sortList = injected
    else if (slot === "viewOptions") viewOptions = injected
    else if (slot === "filterMenu") filterMenu = injected
    else extras.push(injected)
  })

  const showEnd = Boolean(sortList || viewOptions || filterMenu || extras.length)
  const showFiltersRow = Boolean(
    filters || filterMenu || isFiltered || showEnd
  )
  const showTopRow = Boolean(search)

  return (
    <div
      role="toolbar"
      aria-orientation="horizontal"
      data-testid="ipa_table_toolbar"
      className={cn(s.toolbar, className)}
      {...props}
    >
      {showTopRow && search ? (
        <div className={s.toolbarSearchRow}>{search}</div>
      ) : null}
      {showFiltersRow && (
        <div className={cn(s.toolbarRow, showEnd && s.toolbarRowWithEnd)}>
          <div className={s.toolbarStart}>
            {filters}
            {filterMenu && !filters ? (
              <TableFilterChips
                table={table}
                styleOverrides={styleOverrides}
              />
            ) : null}
            {isFiltered ? (
              <Button
                aria-label="Reset filters"
                variant="danger"
                size="sm"
                className={s.compactDangerButton}
                disabled={queryControlsDisabled}
                onClick={onReset}
              >
                <X aria-hidden />
                Reset
              </Button>
            ) : null}
          </div>
          {showEnd ? (
            <div className={s.toolbarEnd}>
              {sortList}
              {viewOptions}
              {filterMenu}
              {extras}
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

markTablePart(TableSortList as never, "sortList")
markTablePart(TableViewOptions as never, "viewOptions")
markTablePart(TableFilterMenuTrigger as never, "filterMenu")
