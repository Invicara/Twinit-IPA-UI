import React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  composeTableFeatures,
  withColumnOrder,
  withFiltering,
  withPagination,
  withSelection,
  withServerMode,
  withSorting,
} from "./index"
import { useTable } from "../use-table"
import type { TableColumnFilterProps } from "../filters/filter-registry"
import { TableFilters, TableToolbar } from "../toolbar/toolbar"

type Row = { id: string; name: string; status: string }

const columns: ColumnDef<Row>[] = [
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "status",
    header: "Status",
    enableColumnFilter: true,
    meta: { label: "Status", variant: "text" },
    filterFn: (row, _columnId, filterValue) =>
      String(row.getValue("status")) === String(filterValue),
  },
]

const data: Row[] = [
  { id: "1", name: "Ada", status: "active" },
  { id: "2", name: "Grace", status: "draft" },
]

describe("composeTableFeatures / useTable features", () => {
  it("composes manual server slices", () => {
    const slice = composeTableFeatures(
      withServerMode({ pageCount: 3, rowCount: 10 })
    )
    expect(slice.options?.manualPagination).toBe(true)
    expect(slice.options?.manualSorting).toBe(true)
    expect(slice.options?.manualFiltering).toBe(true)
    expect(slice.options?.pageCount).toBe(3)
    expect(slice.meta?.serverMode).toBe(true)
    expect(slice.meta?.rowCount).toBe(10)
  })

  it("opts into only selected client features via features prop", () => {
    function Harness() {
      const table = useTable({
        data,
        columns,
        features: [
          withSorting(),
          withFiltering({ faceting: false }),
          withPagination(),
        ],
        getRowId: (row) => row.id,
      })

      return (
        <span data-testid="flags">
          {[
            Boolean(table.options.getSortedRowModel),
            Boolean(table.options.getFilteredRowModel),
            Boolean(table.options.getPaginationRowModel),
            Boolean(table.options.enableRowSelection),
          ].join(",")}
        </span>
      )
    }

    render(<Harness />)
    expect(screen.getByTestId("flags")).toHaveTextContent(
      "true,true,true,false"
    )
  })

  it("applies withSelection via features", () => {
    function Harness() {
      const table = useTable({
        data,
        columns,
        features: [withSelection(), withPagination()],
        getRowId: (row) => row.id,
      })
      return (
        <span data-testid="cols">
          {table.getAllColumns().map((c) => c.id).join(",")}
        </span>
      )
    }

    render(<Harness />)
    expect(screen.getByTestId("cols").textContent).toMatch(/^select,/)
  })

  it("omits row models when features is empty", () => {
    function Harness() {
      const table = useTable({
        data,
        columns,
        getRowId: (row) => row.id,
      })
      return (
        <span data-testid="flags">
          {[
            Boolean(table.options.getSortedRowModel),
            Boolean(table.options.getFilteredRowModel),
            Boolean(table.options.getPaginationRowModel),
          ].join(",")}
        </span>
      )
    }

    render(<Harness />)
    expect(screen.getByTestId("flags")).toHaveTextContent("false,false,false")
  })

  it("withSelection({ column: false }) enables state without a select column", () => {
    function Harness() {
      const table = useTable({
        data,
        columns,
        features: [withSelection({ column: false })],
        getRowId: (row) => row.id,
      })
      return (
        <span data-testid="info">
          {String(table.options.enableRowSelection)},
          {table.getAllColumns().map((c) => c.id).join("|")}
        </span>
      )
    }

    render(<Harness />)
    expect(screen.getByTestId("info")).toHaveTextContent("true,name|status")
  })

  it("withColumnOrder sets drag chrome meta", () => {
    function Harness() {
      const table = useTable({
        data,
        columns,
        features: [withColumnOrder()],
        getRowId: (row) => row.id,
      })
      return (
        <span data-testid="drag">{String(table.options.meta?.columnDrag)}</span>
      )
    }

    render(<Harness />)
    expect(screen.getByTestId("drag")).toHaveTextContent("true")
  })
})

describe("meta.filter hot-swap", () => {
  it("renders a custom filter component in the toolbar slot", async () => {
    const user = userEvent.setup()

    function ToggleFilter({ column, title }: TableColumnFilterProps<Row>) {
      return (
        <button
          type="button"
          aria-label={`Toggle ${title}`}
          onClick={() => column.setFilterValue("active")}
        >
          Toggle
        </button>
      )
    }

    const customColumns: ColumnDef<Row>[] = [
      { accessorKey: "name", header: "Name" },
      {
        accessorKey: "status",
        header: "Status",
        enableColumnFilter: true,
        meta: {
          label: "Status",
          variant: "text",
          filter: ToggleFilter,
        },
        filterFn: (row, _columnId, filterValue) =>
          String(row.getValue("status")) === String(filterValue),
      },
    ]

    function Harness() {
      const table = useTable({
        data,
        columns: customColumns,
        features: [withFiltering()],
        getRowId: (row) => row.id,
      })

      return (
        <>
          <TableToolbar table={table}>
            <TableFilters />
          </TableToolbar>
          <div data-testid="rows">
            {table.getRowModel().rows.map((row) => (
              <div key={row.id}>{row.getValue("name") as string}</div>
            ))}
          </div>
        </>
      )
    }

    render(<Harness />)
    expect(screen.getByRole("button", { name: "Toggle Status" })).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Toggle Status" }))
    expect(screen.getByText("Ada")).toBeInTheDocument()
    expect(screen.queryByText("Grace")).not.toBeInTheDocument()
  })
})

describe("row selection and filters", () => {
  it("clears row selection when a column filter is applied", async () => {
    const user = userEvent.setup()

    function Harness() {
      const table = useTable({
        data,
        columns,
        features: [withSelection(), withFiltering()],
        getRowId: (row) => row.id,
      })

      return (
        <>
          <button
            type="button"
            onClick={() => table.getRow("1").toggleSelected(true)}
          >
            Select Ada
          </button>
          <button
            type="button"
            onClick={() => table.getColumn("status")?.setFilterValue("active")}
          >
            Filter active
          </button>
          <span data-testid="selected">
            {Object.keys(table.getState().rowSelection).join(",") || "none"}
          </span>
        </>
      )
    }

    render(<Harness />)
    await user.click(screen.getByText("Select Ada"))
    expect(screen.getByTestId("selected")).toHaveTextContent("1")
    await user.click(screen.getByText("Filter active"))
    expect(screen.getByTestId("selected")).toHaveTextContent("none")
  })
})
