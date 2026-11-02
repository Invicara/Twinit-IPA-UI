import { flexRender, type Table as TanstackTable } from "@tanstack/react-table"
import * as React from "react"

import { cn, mergeStyles } from "../../../lib/utils"
import baseStyles from "./primitives/table-base.module.css"
import {
  TableRoot,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "./primitives/table-base"
import { TableColumnDndContext } from "./columns/column-dnd-context"
import { TableDraggableHeader } from "./columns/draggable-header"
import { TableHeaderCell } from "./columns/header-cell"
import { TableSkeleton } from "./skeleton/skeleton"
import { getColumnPinningStyle } from "./query/utils"
import { useOptionalTableChrome, useResolvedTable } from "./table-context"
import styles from "./table.module.css"

export interface TableGridProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Override context table when used outside {@link Table}. */
  table?: TanstackTable<TData>
  emptyMessage?: string
  isLoading?: boolean
  isFetching?: boolean
  styleOverrides?: Record<string, string>
}

function getColumnDragEnabled<TData>(table: TanstackTable<TData>) {
  return table.options.meta?.columnDrag === true
}

function getColumnResizeEnabled<TData>(table: TanstackTable<TData>) {
  return (
    table.options.meta?.columnResize === true ||
    table.options.enableColumnResizing === true
  )
}

/** Headless grid body — compose inside {@link Table}. */
export function TableGrid<TData>({
  table: tableProp,
  emptyMessage: emptyMessageProp,
  isLoading: isLoadingProp,
  isFetching: isFetchingProp,
  styleOverrides: styleOverridesProp,
  className,
  ...props
}: TableGridProps<TData>) {
  const ctx = useOptionalTableChrome<TData>()
  const table = useResolvedTable(tableProp)

  const draggable = getColumnDragEnabled(table)
  const resizable = getColumnResizeEnabled(table)
  const emptyMessage = emptyMessageProp ?? ctx?.emptyMessage ?? "No results"
  const isLoading = isLoadingProp ?? ctx?.isLoading ?? false
  const isFetching = isFetchingProp ?? ctx?.isFetching ?? false
  const styleOverrides = styleOverridesProp ?? ctx?.styleOverrides

  const s = mergeStyles(styles, styleOverrides)
  const bs = mergeStyles(baseStyles, styleOverrides)
  const showFetchingChrome = Boolean(isFetching && !isLoading)

  return (
    <div
      className={cn(
        s.tableContainer,
        showFetchingChrome && s.tableContainerFetching,
        className
      )}
      {...props}
    >
      {showFetchingChrome ? (
        <div className={s.tableFetchingBar} data-testid="ipa_table_fetching">
          <span className={s.tableFetchingBarIndeterminate} />
        </div>
      ) : null}
      <TableColumnDndContext table={table} enabled={draggable}>
        <TableRoot
          aria-busy={isLoading || isFetching || undefined}
          styleOverrides={styleOverrides}
          className={cn(resizable && s.resizableTableRoot)}
          style={
            resizable
              ? {
                  width: table.getCenterTotalSize(),
                  minWidth: "100%",
                }
              : undefined
          }
        >
          {draggable ? (
            <TableDraggableHeader
              table={table}
              resizable={resizable}
              styleOverrides={styleOverrides}
            />
          ) : (
            <TableHeader styleOverrides={styleOverrides}>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className={cn(bs.headerRow, s.headerRow)}
                >
                  {headerGroup.headers.map((header) => (
                    <TableHeaderCell
                      key={header.id}
                      header={header}
                      resizable={resizable}
                      styleOverrides={styleOverrides}
                    />
                  ))}
                </TableRow>
              ))}
            </TableHeader>
          )}
          {isLoading ? (
            <TableSkeleton table={table} styleOverrides={styleOverrides} />
          ) : (
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? "selected" : undefined}
                    className={bs.bodyRow}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={getColumnPinningStyle({
                          column: cell.column,
                          resizable,
                        })}
                        styleOverrides={styleOverrides}
                        className={
                          cell.column.id === "select"
                            ? bs.selectionCell
                            : undefined
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    styleOverrides={styleOverrides}
                    className={cn(bs.emptyCell, s.emptyCell)}
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </TableRoot>
      </TableColumnDndContext>
    </div>
  )
}
