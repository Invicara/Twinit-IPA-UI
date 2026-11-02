import type { ColumnDef, Table } from "@tanstack/react-table"
import * as React from "react"

import { Checkbox } from "../../checkbox"
import styles from "../primitives/table-base.module.css"
import { useTableQueryControlsDisabled } from "../table-context"

function SelectAllRowsCheckbox<TData>({ table }: { table: Table<TData> }) {
  const disabled = useTableQueryControlsDisabled()
  return (
    <SelectionCellInner>
      <Checkbox
        disabled={disabled}
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all rows"
      />
    </SelectionCellInner>
  )
}

function SelectionCellInner({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.selectionCellInner} data-testid="ipa_table_selection_cell_inner">
      {children}
    </div>
  )
}

export function createSelectionColumn<TData>(): ColumnDef<TData> {
  return {
    id: "select",
    header: ({ table }) => <SelectAllRowsCheckbox table={table} />,
    cell: ({ row }) => (
      <SelectionCellInner>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </SelectionCellInner>
    ),
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
    size: 40,
    minSize: 40,
    maxSize: 40,
  }
}
