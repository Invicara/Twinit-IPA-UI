import React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { render, screen } from "@testing-library/react"
import { TableColumnHeader } from "../columns/column-header"
import { Table } from "../table"
import { TableSortList } from "../toolbar/sort-list"
import { useTable } from "../use-table"
import { withPagination, withSorting } from "../features"

type Row = { id: string; name: string }

const columns: ColumnDef<Row>[] = [
  { accessorKey: "name", header: "Name" },
]

const sortableColumns: ColumnDef<Row>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <TableColumnHeader column={column} label="Name" variant="button" />
    ),
  },
]

const data: Row[] = [
  { id: "1", name: "Ada" },
  { id: "2", name: "Grace" },
]

describe("Table loading states", () => {
  it("renders skeleton rows when isLoading", () => {
    function Harness() {
      const table = useTable({
        data,
        columns,
        features: [withPagination()],
        getRowId: (row) => row.id,
        initialState: { pagination: { pageSize: 5, pageIndex: 0 } },
      })
      return (
        <Table table={table} isLoading>
          <Table.Frame>
            <Table.Grid />
          </Table.Frame>
        </Table>
      )
    }

    render(<Harness />)

    expect(screen.getByTestId("ipa_table_skeleton")).toBeInTheDocument()
    expect(screen.getByTestId("ipa_table_root")).toHaveAttribute("aria-busy", "true")
    expect(screen.getByTestId("ipa_table")).not.toHaveAttribute("aria-busy")
    expect(screen.getByRole("status")).toHaveTextContent("Loading table")
    expect(screen.queryByText("Ada")).not.toBeInTheDocument()
  })

  it("keeps rows and shows fetching chrome when isFetching", () => {
    function Harness() {
      const table = useTable({
        data,
        columns,
        getRowId: (row) => row.id,
      })
      return (
        <Table table={table} isFetching>
          <Table.Frame>
            <Table.Grid />
          </Table.Frame>
        </Table>
      )
    }

    render(<Harness />)

    expect(screen.getByText("Ada")).toBeInTheDocument()
    expect(screen.getByTestId("ipa_table_fetching")).toBeInTheDocument()
    expect(screen.getByTestId("ipa_table_root")).toHaveAttribute("aria-busy", "true")
    expect(screen.getByRole("status")).toHaveTextContent("Updating table")
  })

  it("prefers skeleton over fetching chrome when both flags are set", () => {
    function Harness() {
      const table = useTable({
        data,
        columns,
        getRowId: (row) => row.id,
      })
      return (
        <Table table={table} isLoading isFetching>
          <Table.Frame>
            <Table.Grid />
          </Table.Frame>
        </Table>
      )
    }

    render(<Harness />)

    expect(screen.getByTestId("ipa_table_skeleton")).toBeInTheDocument()
    expect(screen.queryByTestId("ipa_table_fetching")).not.toBeInTheDocument()
    expect(screen.getByRole("status")).toHaveTextContent("Loading table")
  })

  it("disables query controls together while the skeleton is showing", () => {
    function Harness() {
      const table = useTable({
        data,
        columns: sortableColumns,
        features: [
          withSorting(),
          withPagination({ manual: true, pageCount: 3 }),
        ],
        getRowId: (row) => row.id,
        initialState: { pagination: { pageSize: 5, pageIndex: 0 } },
      })
      return (
        <Table table={table} isLoading>
          <Table.Frame>
            <Table.Toolbar />
            <Table.Grid />
            <Table.Pagination pageSizeOptions={[5, 10]} />
          </Table.Frame>
        </Table>
      )
    }

    render(<Harness />)

    expect(screen.getByLabelText("Filter table rows")).toBeDisabled()
    expect(screen.getByLabelText("Sort by Name")).toBeDisabled()
    expect(screen.getByLabelText("Go to next page")).toBeDisabled()
    expect(screen.getByLabelText("Go to previous page")).toBeDisabled()
    expect(screen.getByLabelText("Go to first page")).toBeDisabled()
    expect(screen.getByLabelText("Go to last page")).toBeDisabled()
    expect(screen.getByDisplayValue("5")).toBeDisabled()
    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument()
  })

  it("does not show an unknown page count while loading", () => {
    function Harness() {
      const table = useTable({
        data: [],
        columns,
        features: [withPagination()],
        initialState: { pagination: { pageSize: 5, pageIndex: 0 } },
      })
      return (
        <Table table={table} isLoading>
          <Table.Frame>
            <Table.Grid />
            <Table.Pagination />
          </Table.Frame>
        </Table>
      )
    }

    render(<Harness />)

    expect(screen.getByText("Loading")).toBeInTheDocument()
    expect(screen.queryByText(/of 0/)).not.toBeInTheDocument()
    expect(screen.getByDisplayValue("5")).toBeDisabled()
  })

  it("keeps query controls available while refetching existing rows", () => {
    function Harness() {
      const table = useTable({
        data,
        columns,
        features: [withPagination()],
        getRowId: (row) => row.id,
        initialState: { pagination: { pageSize: 1, pageIndex: 0 } },
      })
      return (
        <Table table={table} isFetching>
          <Table.Frame>
            <Table.Toolbar />
            <Table.Grid />
            <Table.Pagination pageSizeOptions={[1, 5]} />
          </Table.Frame>
        </Table>
      )
    }

    render(<Harness />)

    expect(screen.getByLabelText("Filter table rows")).toBeEnabled()
    expect(screen.getByLabelText("Go to next page")).toBeEnabled()
    expect(screen.getByLabelText("Go to previous page")).toBeDisabled()
    expect(screen.getByDisplayValue("1")).toBeEnabled()
    expect(screen.getByText("Ada")).toBeInTheDocument()
  })

  it("draws sorts as unset while the skeleton is up and restores them after", () => {
    const sortedColumns: ColumnDef<Row>[] = [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <TableColumnHeader column={column} label="Name" variant="button" />
        ),
        meta: { label: "Name" },
      },
      {
        accessorKey: "id",
        header: ({ column }) => (
          <TableColumnHeader column={column} label="Id" variant="button" />
        ),
        meta: { label: "Id" },
      },
    ]

    function Harness({ isLoading }: { isLoading: boolean }) {
      const table = useTable({
        data,
        columns: sortedColumns,
        features: [withSorting({ enableMultiSort: true })],
        getRowId: (row) => row.id,
        state: {
          sorting: [
            { id: "name", desc: false },
            { id: "id", desc: true },
          ],
        },
      })
      return (
        <Table table={table} isLoading={isLoading}>
          <Table.Frame>
            <Table.Toolbar>
              <Table.SortList />
            </Table.Toolbar>
            <Table.Grid />
          </Table.Frame>
        </Table>
      )
    }

    const { rerender } = render(<Harness isLoading />)

    for (const label of ["Sort by Name", "Sort by Id"]) {
      const icon = screen.getByLabelText(label).querySelector("svg")
      expect(icon).toHaveClass("columnHeaderIcon")
      expect(icon).not.toHaveClass("columnHeaderIconActive")
    }
    const sortButton = screen.getByRole("button", { name: "Sort" })
    expect(sortButton).not.toHaveClass("toolbarActionButtonActive")
    expect(sortButton).not.toHaveTextContent("2")

    rerender(<Harness isLoading={false} />)

    for (const label of ["Sort by Name", "Sort by Id"]) {
      expect(
        screen.getByLabelText(label).querySelector("svg")
      ).toHaveClass("columnHeaderIconActive")
    }
    const restoredSort = screen.getByRole("button", { name: "Sort" })
    expect(restoredSort).toHaveTextContent("2")
    expect(restoredSort).toHaveClass("toolbarActionButtonActive")
  })
})
