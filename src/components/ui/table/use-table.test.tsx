import React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Table } from "./table"
import { useTable } from "./use-table"
import { withFiltering, withPagination, withSelection, withServerMode } from "./features"

type Row = { id: string; name: string; status: string }

const columns: ColumnDef<Row>[] = [
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "status",
    header: "Status",
    enableColumnFilter: true,
    filterFn: (row, _columnId, filterValue) =>
      String(row.getValue("status")) === String(filterValue),
  },
]

const data: Row[] = [
  { id: "1", name: "Ada", status: "active" },
  { id: "2", name: "Grace", status: "draft" },
  { id: "3", name: "Alan", status: "active" },
]

describe("useTable serverMode", () => {
  it("enables all manual flags and skips client filtering", async () => {
    const user = userEvent.setup()
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {})

    function Harness() {
      const table = useTable({
        data,
        columns,
        features: [withServerMode({ pageCount: 2 })],
        getRowId: (row) => row.id,
        initialState: { pagination: { pageSize: 10, pageIndex: 0 } },
      })

      return (
        <div>
          <span data-testid="manual">
            {[
              table.options.manualPagination,
              table.options.manualSorting,
              table.options.manualFiltering,
            ].join(",")}
          </span>
          <span data-testid="row-count">{table.getRowModel().rows.length}</span>
          <button
            type="button"
            onClick={() => table.getColumn("status")?.setFilterValue("active")}
          >
            Filter active
          </button>
          <Table table={table}>
            <Table.Frame>
              <Table.Grid />
            </Table.Frame>
          </Table>
        </div>
      )
    }

    render(<Harness />)

    expect(screen.getByTestId("manual")).toHaveTextContent("true,true,true")
    expect(screen.getByTestId("row-count")).toHaveTextContent("3")

    await user.click(screen.getByRole("button", { name: "Filter active" }))

    // Server mode does not apply filters client-side — all rows remain.
    expect(screen.getByTestId("row-count")).toHaveTextContent("3")
    expect(screen.getByText("Grace")).toBeInTheDocument()

    warnSpy.mockRestore()
  })

  it("keeps numeric timestamp filters in serverMode (TanStack autoRemove quirk)", async () => {
    const user = userEvent.setup()
    type Dated = { id: string; name: string; joinedAt: number }
    const datedColumns: ColumnDef<Dated>[] = [
      { accessorKey: "name", header: "Name" },
      {
        accessorKey: "joinedAt",
        header: "Joined",
        enableColumnFilter: true,
        meta: { variant: "date", label: "Joined" },
      },
    ]
    const datedData: Dated[] = [
      { id: "1", name: "Ada", joinedAt: Date.parse("2024-01-15") },
    ]

    function Harness() {
      const [columnFilters, setColumnFilters] = React.useState<
        { id: string; value: unknown }[]
      >([])
      const table = useTable({
        data: datedData,
        columns: datedColumns,
        features: [withServerMode({ pageCount: 1 })],
        state: { columnFilters },
        onColumnFiltersChange: setColumnFilters,
        getRowId: (row) => row.id,
      })

      return (
        <div>
          <button
            type="button"
            onClick={() =>
              table
                .getColumn("joinedAt")
                ?.setFilterValue(String(Date.parse("2024-01-15")))
            }
          >
            Filter date
          </button>
          <pre data-testid="filters">{JSON.stringify(columnFilters)}</pre>
        </div>
      )
    }

    render(<Harness />)
    await user.click(screen.getByRole("button", { name: "Filter date" }))
    expect(screen.getByTestId("filters")).toHaveTextContent("joinedAt")
  })

  it("warns in development when pageCount is missing", () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {})

    function Harness() {
      useTable({
        data,
        columns,
        features: [withServerMode()],
        getRowId: (row) => row.id,
      })
      return null
    }

    render(<Harness />)

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("pageCount")
    )
    warnSpy.mockRestore()
  })

  it("does not warn when pageCount is provided", () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {})

    function Harness() {
      useTable({
        data,
        columns,
        features: [withServerMode({ pageCount: 1 })],
        getRowId: (row) => row.id,
      })
      return null
    }

    render(<Harness />)

    expect(warnSpy).not.toHaveBeenCalled()
    warnSpy.mockRestore()
  })

  it("uses rowCount in selection summary under serverMode", async () => {
    const user = userEvent.setup()

    function Harness() {
      const table = useTable({
        data: data.slice(0, 2),
        columns,
        features: [
          withServerMode({ pageCount: 2, rowCount: 42 }),
          withSelection(),
        ],
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

    render(<Harness />)

    expect(screen.getByText("0 of 42 row(s) selected")).toBeInTheDocument()

    await user.click(screen.getAllByLabelText("Select row")[0]!)

    expect(screen.getByText("1 of 42 row(s) selected")).toBeInTheDocument()
  })

  it("omits denominator when serverMode has no rowCount", () => {
    function Harness() {
      const table = useTable({
        data: data.slice(0, 2),
        columns,
        features: [withServerMode({ pageCount: 2 }), withSelection()],
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

    render(<Harness />)

    expect(screen.getByText("0 row(s) selected")).toBeInTheDocument()
  })

  it("honors individual manual flags without serverMode", async () => {
    const user = userEvent.setup()

    function Harness() {
      const table = useTable({
        data,
        columns,
        features: [withFiltering({ manual: true })],
        pageCount: 1,
        getRowId: (row) => row.id,
      })

      return (
        <div>
          <span data-testid="flags">
            {[
              Boolean(table.options.manualPagination),
              Boolean(table.options.manualSorting),
              Boolean(table.options.manualFiltering),
            ].join(",")}
          </span>
          <button
            type="button"
            onClick={() => table.getColumn("status")?.setFilterValue("active")}
          >
            Filter active
          </button>
          <span data-testid="row-count">{table.getRowModel().rows.length}</span>
        </div>
      )
    }

    render(<Harness />)

    expect(screen.getByTestId("flags")).toHaveTextContent("false,false,true")
    await user.click(screen.getByRole("button", { name: "Filter active" }))
    expect(screen.getByTestId("row-count")).toHaveTextContent("3")
  })

  it("warns when leftover preset flags are passed beside features", () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {})

    function Harness() {
      useTable({
        data,
        columns,
        features: [withPagination()],
        // @ts-expect-error leftover dual-API flag
        selectable: false,
        getRowId: (row) => row.id,
      })
      return null
    }

    render(<Harness />)

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("selectable")
    )
    warnSpy.mockRestore()
  })
})
