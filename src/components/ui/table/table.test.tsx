import React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { ColumnDef } from "@tanstack/react-table"
import {
  Table,
  TableColumnHeader,
  useTable,
  withColumnOrder,
  withFiltering,
  withPagination,
  withResizing,
  withSelection,
  withSorting,
} from "./index"

type Row = { id: string; name: string; email: string }

const columns: ColumnDef<Row>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <TableColumnHeader column={column} label="Name" variant="button" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => <TableColumnHeader column={column} label="Email" />,
  },
]

const data: Row[] = [
  { id: "1", name: "Ada Lovelace", email: "ada@example.com" },
  { id: "2", name: "Grace Hopper", email: "grace@example.com" },
]

function TestTable({ rows = data }: { rows?: Row[] }) {
  const table = useTable({
    data: rows,
    columns,
    features: [withSorting(), withFiltering(), withPagination()],
    getRowId: (row) => row.id,
  })

  return (
    <Table table={table}>
      <Table.Frame>
        <Table.Toolbar />
        <Table.Grid />
        <Table.Pagination />
      </Table.Frame>
    </Table>
  )
}

describe("Table", () => {
  it("renders column headers and rows", () => {
    render(<TestTable />)

    expect(screen.getByText("Name")).toBeInTheDocument()
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument()
    expect(screen.getByText("Grace Hopper")).toBeInTheDocument()
    expect(screen.getByTestId("ipa_table")).toBeInTheDocument()
  })

  it("shows empty message when there is no data", () => {
    render(<TestTable rows={[]} />)

    expect(screen.getByText("No results")).toBeInTheDocument()
  })

  it("renders pagination controls", () => {
    render(<TestTable />)

    expect(screen.getByTestId("ipa_table_pagination")).toBeInTheDocument()
    expect(screen.queryByText(/row\(s\) selected/)).not.toBeInTheDocument()
  })

  it("renders toolbar with global filter", () => {
    render(<TestTable />)

    expect(screen.getByTestId("ipa_table_toolbar")).toBeInTheDocument()
    expect(screen.getByLabelText("Filter table rows")).toBeInTheDocument()
  })

  it("filters rows via toolbar global filter", async () => {
    const user = userEvent.setup()
    render(<TestTable />)

    await user.type(screen.getByLabelText("Filter table rows"), "Ada")

    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument()
    expect(screen.queryByText("Grace Hopper")).not.toBeInTheDocument()
  })

  it("cycles the sort header through ascending, descending, and unsorted", async () => {
    const user = userEvent.setup()
    render(
      <TestTable
        rows={[
          { id: "1", name: "Grace Hopper", email: "grace@example.com" },
          { id: "2", name: "Ada Lovelace", email: "ada@example.com" },
          { id: "3", name: "Tim Berners-Lee", email: "tim@example.com" },
        ]}
      />
    )

    const rowNames = () =>
      screen.getAllByRole("row").slice(1).map((row) => row.querySelector("td")?.textContent)

    expect(rowNames()).toEqual(["Grace Hopper", "Ada Lovelace", "Tim Berners-Lee"])

    await user.click(screen.getByLabelText("Sort by Name"))
    expect(rowNames()).toEqual(["Ada Lovelace", "Grace Hopper", "Tim Berners-Lee"])

    await user.click(screen.getByLabelText("Sort by Name"))
    expect(rowNames()).toEqual(["Tim Berners-Lee", "Grace Hopper", "Ada Lovelace"])

    await user.click(screen.getByLabelText("Sort by Name"))
    expect(rowNames()).toEqual(["Grace Hopper", "Ada Lovelace", "Tim Berners-Lee"])
  })

  it("shows selection summary when withSelection is enabled", () => {
    function SelectableTestTable() {
      const table = useTable({
        data,
        columns,
        features: [withSelection(), withPagination()],
        getRowId: (row) => row.id,
      })

      return (
        <Table table={table}>
          <Table.Frame>
            <Table.Grid />
            <Table.Pagination />
          </Table.Frame>
        </Table>
      )
    }

    render(<SelectableTestTable />)

    expect(screen.getByText(/row\(s\) selected/)).toBeInTheDocument()
    expect(screen.getByLabelText("Select all rows")).toBeInTheDocument()
  })

  it("aligns the selection header checkbox with row checkboxes", () => {
    function SelectableTestTable() {
      const table = useTable({
        data,
        columns,
        features: [withSelection(), withPagination()],
        getRowId: (row) => row.id,
      })

      return (
        <Table table={table}>
          <Table.Frame>
            <Table.Grid />
          </Table.Frame>
        </Table>
      )
    }

    render(<SelectableTestTable />)

    const selectAll = screen.getByLabelText("Select all rows")
    const selectRow = screen.getAllByLabelText("Select row")[0]
    const headerInner = selectAll.closest('[data-testid="ipa_table_selection_cell_inner"]')
    const rowInner = selectRow.closest('[data-testid="ipa_table_selection_cell_inner"]')

    expect(headerInner?.parentElement).toHaveAttribute(
      "data-testid",
      "ipa_table_head_cell"
    )
    expect(rowInner?.parentElement).toHaveAttribute(
      "data-testid",
      "ipa_table_body_cell"
    )
    expect(selectAll.getBoundingClientRect().left).toBeCloseTo(
      selectRow.getBoundingClientRect().left,
      0
    )
  })

  it("renders resize handles when withResizing is enabled", () => {
    function ResizableTestTable() {
      const table = useTable({
        data,
        columns,
        features: [withResizing()],
        getRowId: (row) => row.id,
      })

      return (
        <Table table={table}>
          <Table.Frame>
            <Table.Grid />
          </Table.Frame>
        </Table>
      )
    }

    render(<ResizableTestTable />)

    expect(screen.getAllByTestId("ipa_table_column_resize_handle").length).toBeGreaterThan(0)
  })

  it("renders draggable header handles when withColumnOrder is enabled", () => {
    function DraggableTestTable() {
      const table = useTable({
        data,
        columns,
        features: [withColumnOrder()],
        getRowId: (row) => row.id,
      })

      return (
        <Table table={table}>
          <Table.Frame>
            <Table.Grid />
          </Table.Frame>
        </Table>
      )
    }

    render(<DraggableTestTable />)

    expect(screen.getAllByTestId("ipa_table_draggable_head_cell").length).toBe(2)
    expect(screen.getByLabelText("Drag name column")).toBeInTheDocument()
  })
})
