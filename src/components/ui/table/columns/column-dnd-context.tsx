import type { Table } from "@tanstack/react-table"
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers"
import { arrayMove } from "@dnd-kit/sortable"
import * as React from "react"

const LOCKED_COLUMN_IDS = new Set(["select"])

export interface TableColumnDndContextProps<TData> {
  table: Table<TData>
  enabled?: boolean
  children: React.ReactNode
}

export function TableColumnDndContext<TData>({
  table,
  enabled = false,
  children,
}: TableColumnDndContextProps<TData>) {
  const columnOrder = table.getState().columnOrder

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 6 } }),
    useSensor(KeyboardSensor)
  )

  const onDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      const lockedPrefix = columnOrder.filter((columnId) =>
        LOCKED_COLUMN_IDS.has(columnId)
      )
      const orderable = columnOrder.filter(
        (columnId) => !LOCKED_COLUMN_IDS.has(columnId)
      )

      const oldIndex = orderable.indexOf(String(active.id))
      const newIndex = orderable.indexOf(String(over.id))
      if (oldIndex < 0 || newIndex < 0) return

      table.setColumnOrder([
        ...lockedPrefix,
        ...arrayMove(orderable, oldIndex, newIndex),
      ])
    },
    [columnOrder, table]
  )

  if (!enabled) {
    return <>{children}</>
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={onDragEnd}
    >
      {children}
    </DndContext>
  )
}
