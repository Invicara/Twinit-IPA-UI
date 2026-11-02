import React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { useTable } from "./use-table"
import { withFiltering } from "./features"
import type { TableFilterOption } from "./table.types"
import { tableSelectFilterFn } from "./filters/faceted-filter"
import { tableDateFilterFn } from "./filters/date-filter"

export type FilterRow = {
  id: string
  name: string
  role: string
  joinedAt: number
  estHours: number
}

export const filterTestData: FilterRow[] = [
  {
    id: "1",
    name: "Ada Lovelace",
    role: "Engineer",
    joinedAt: new Date(2024, 0, 15).getTime(),
    estHours: 4,
  },
  {
    id: "2",
    name: "Grace Hopper",
    role: "Researcher",
    joinedAt: new Date(2025, 5, 15).getTime(),
    estHours: 12,
  },
  {
    id: "3",
    name: "Alan Turing",
    role: "Researcher",
    joinedAt: new Date(2023, 2, 28).getTime(),
    estHours: 20,
  },
]

export const roleFilterOptions: TableFilterOption[] = [
  { label: "Engineer", value: "Engineer", count: 1 },
  { label: "Researcher", value: "Researcher", count: 2 },
]

export function createFilterTestColumns(): ColumnDef<FilterRow>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      enableColumnFilter: true,
      meta: { label: "Name", placeholder: "Search names..." },
    },
    {
      accessorKey: "role",
      header: "Role",
      enableColumnFilter: true,
      meta: {
        label: "Role",
        variant: "multiSelect",
        options: roleFilterOptions,
      },
      filterFn: tableSelectFilterFn,
    },
    {
      accessorKey: "joinedAt",
      header: "Joined",
      enableColumnFilter: true,
      meta: { label: "Joined", variant: "date" },
      filterFn: tableDateFilterFn,
    },
  ]
}

export function useFilterTestTable(data = filterTestData) {
  return useTable({
    data,
    columns: createFilterTestColumns(),
    features: [withFiltering()],
    getRowId: (row) => row.id,
  })
}

export function FilterTableHarness({
  children,
  data = filterTestData,
}: {
  children: (table: ReturnType<typeof useFilterTestTable>) => React.ReactNode
  data?: FilterRow[]
}) {
  const table = useFilterTestTable(data)
  return <>{children(table)}</>
}
