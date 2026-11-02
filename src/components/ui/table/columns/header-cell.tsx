import type { Header } from "@tanstack/react-table"
import { flexRender } from "@tanstack/react-table"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import * as React from "react"

import { cn, mergeStyles } from "../../../../lib/utils"
import baseStyles from "../primitives/table-base.module.css"
import { TableHead } from "../primitives/table-base"
import { getColumnPinningStyle } from "../query/utils"
import styles from "../table.module.css"

export interface TableHeaderCellProps<TData, TValue> {
  header: Header<TData, TValue>
  resizable?: boolean
  draggable?: boolean
  styleOverrides?: Record<string, string>
  headerRowClassName?: string
}

export function TableHeaderCell<TData, TValue>({
  header,
  resizable = false,
  draggable = false,
  styleOverrides,
  headerRowClassName,
}: TableHeaderCellProps<TData, TValue>) {
  const s = mergeStyles(styles, styleOverrides)
  const bs = mergeStyles(baseStyles, styleOverrides)
  const isSelectionColumn = header.column.id === "select"
  const canDrag = draggable && !isSelectionColumn

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: header.column.id,
    disabled: !canDrag,
  })

  const sortableStyle = canDrag
    ? {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 2 : undefined,
        opacity: isDragging ? 0.85 : 1,
      }
    : undefined

  if (isSelectionColumn) {
    return (
      <TableHead
        colSpan={header.colSpan}
        style={getColumnPinningStyle({ column: header.column, resizable })}
        styleOverrides={styleOverrides}
        className={cn(bs.selectionCell, headerRowClassName)}
      >
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
      </TableHead>
    )
  }

  return (
    <TableHead
      ref={canDrag ? setNodeRef : undefined}
      colSpan={header.colSpan}
      style={{
        ...getColumnPinningStyle({ column: header.column, resizable }),
        ...sortableStyle,
      }}
      styleOverrides={styleOverrides}
      className={cn(
        isSelectionColumn && bs.selectionCell,
        resizable && header.column.getCanResize() && s.headCellResizable,
        canDrag && isDragging && s.headerCellDragging,
        headerRowClassName
      )}
      data-testid={canDrag ? "ipa_table_draggable_head_cell" : undefined}
    >
      <div className={cn(s.headerCellContent, canDrag && s.headerCellContentDraggable)}>
        <div className={cn(canDrag && s.headerCellDraggableZone)}>
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
          {canDrag ? (
            <button
              type="button"
              className={s.columnDragHandle}
              aria-label={`Drag ${header.column.id} column`}
              {...attributes}
              {...listeners}
            >
              <GripVertical aria-hidden />
            </button>
          ) : null}
        </div>
      </div>
      {resizable && header.column.getCanResize() ? (
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label={`Resize ${header.column.id} column`}
          onDoubleClick={() => header.column.resetSize()}
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          className={s.columnResizeHandle}
          data-resizing={header.column.getIsResizing() ? "true" : "false"}
          data-testid="ipa_table_column_resize_handle"
        />
      ) : null}
    </TableHead>
  )
}
