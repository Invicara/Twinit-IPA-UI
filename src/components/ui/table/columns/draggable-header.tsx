import type { Table } from "@tanstack/react-table"
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable"
import * as React from "react"

import { cn, mergeStyles } from "../../../../lib/utils"
import baseStyles from "../primitives/table-base.module.css"
import { TableHeader, TableRow } from "../primitives/table-base"
import { TableHeaderCell } from "./header-cell"
import styles from "../table.module.css"

const LOCKED_COLUMN_IDS = new Set(["select"])

export interface TableDraggableHeaderProps<TData> {
  table: Table<TData>
  resizable?: boolean
  styleOverrides?: Record<string, string>
}

export function TableDraggableHeader<TData>({
  table,
  resizable = false,
  styleOverrides,
}: TableDraggableHeaderProps<TData>) {
  const s = mergeStyles(styles, styleOverrides)
  const bs = mergeStyles(baseStyles, styleOverrides)

  const columnOrder = table.getState().columnOrder
  const draggableColumnIds = React.useMemo(
    () => columnOrder.filter((columnId) => !LOCKED_COLUMN_IDS.has(columnId)),
    [columnOrder]
  )

  return (
    <TableHeader styleOverrides={styleOverrides}>
      {table.getHeaderGroups().map((headerGroup) => (
        <SortableContext
          key={headerGroup.id}
          items={draggableColumnIds}
          strategy={horizontalListSortingStrategy}
        >
          <TableRow className={cn(bs.headerRow, s.headerRow)}>
            {headerGroup.headers.map((header) => (
              <TableHeaderCell
                key={header.id}
                header={header}
                resizable={resizable}
                draggable
                styleOverrides={styleOverrides}
              />
            ))}
          </TableRow>
        </SortableContext>
      ))}
    </TableHeader>
  )
}
