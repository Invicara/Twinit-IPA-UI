import type { Table as TanstackTable } from "@tanstack/react-table"
import * as React from "react"

import { cn, mergeStyles } from "../../../../lib/utils"
import baseStyles from "../primitives/table-base.module.css"
import { TableBody, TableCell, TableRow } from "../primitives/table-base"
import styles from "../table.module.css"

export interface TableSkeletonProps<TData>
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  table: TanstackTable<TData>
  /** Number of placeholder rows. Defaults to the current page size (capped). */
  rowCount?: number
  styleOverrides?: Record<string, string>
}

export function TableSkeleton<TData>({
  table,
  rowCount,
  className,
  styleOverrides,
  ...props
}: TableSkeletonProps<TData>) {
  const s = mergeStyles(styles, styleOverrides)
  const bs = mergeStyles(baseStyles, styleOverrides)
  const columnCount = Math.max(1, table.getVisibleLeafColumns().length)
  const pageSize = table.getState().pagination.pageSize
  const rows = Math.min(Math.max(rowCount ?? pageSize, 1), 20)

  return (
    <TableBody
      data-testid="ipa_table_skeleton"
      className={cn(s.skeletonBody, className)}
      aria-hidden
      {...props}
    >
      {Array.from({ length: rows }, (_, rowIndex) => (
        <TableRow key={rowIndex} className={cn(bs.bodyRow, s.skeletonRow)}>
          {Array.from({ length: columnCount }, (_, columnIndex) => (
            <TableCell
              key={columnIndex}
              styleOverrides={styleOverrides}
              className={s.skeletonCell}
            >
              <span className={s.skeletonBone} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  )
}
