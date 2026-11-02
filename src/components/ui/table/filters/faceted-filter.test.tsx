import React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { TableFacetedFilter, tableSelectFilterFn } from "./faceted-filter"
import { withFiltering, withPagination } from "../features"
import { Table } from "../table"
import {
  FilterTableHarness,
  roleFilterOptions,
} from "../table.test-utils"
import { useTable } from "../use-table"

describe("TableFacetedFilter", () => {
  it("renders the filter trigger", () => {
    render(
      <FilterTableHarness>
        {(table) => {
          const column = table.getColumn("role")
          if (!column) return null
          return (
            <TableFacetedFilter
              column={column}
              title="Role"
              options={roleFilterOptions}
              multiple
            />
          )
        }}
      </FilterTableHarness>
    )

    expect(screen.getByRole("button", { name: /Role/i })).toBeInTheDocument()
  })

  it("opens options and applies a multi-select filter", async () => {
    const user = userEvent.setup()
    render(
      <FilterTableHarness>
        {(table) => {
          const column = table.getColumn("role")
          if (!column) return null
          return (
            <TableFacetedFilter
              column={column}
              title="Role"
              options={roleFilterOptions}
              multiple
            />
          )
        }}
      </FilterTableHarness>
    )

    await user.click(screen.getByRole("button", { name: /Role/i }))
    await user.click(await screen.findByRole("option", { name: /Engineer/i }))

    expect(screen.getByLabelText("Clear Role filter")).toBeInTheDocument()
    expect(screen.getByTestId("ipa_badge")).toHaveTextContent("Engineer")
    expect(screen.getByLabelText("Close")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Reset" }))

    expect(screen.queryByRole("option", { name: /Engineer/i })).not.toBeInTheDocument()
  })

  it("matches any part of an option label", async () => {
    const user = userEvent.setup()
    render(
      <FilterTableHarness>
        {(table) => {
          const column = table.getColumn("role")
          if (!column) return null
          return (
            <TableFacetedFilter
              column={column}
              title="Role"
              options={roleFilterOptions}
              multiple
            />
          )
        }}
      </FilterTableHarness>
    )

    await user.click(screen.getByRole("button", { name: /Role/i }))
    const search = await screen.findByPlaceholderText("Role")

    await user.type(search, "eeng")
    expect(screen.queryByRole("option", { name: /Engineer/i })).not.toBeInTheDocument()
    expect(screen.getByText("No results found.")).toBeInTheDocument()

    await user.clear(search)
    await user.type(search, "gine")
    expect(screen.getByRole("option", { name: /Engineer/i })).toBeInTheDocument()
  })

  it("clears selected values from the trigger", async () => {
    const user = userEvent.setup()
    render(
      <FilterTableHarness>
        {(table) => {
          const column = table.getColumn("role")
          if (!column) return null
          return (
            <TableFacetedFilter
              column={column}
              title="Role"
              options={roleFilterOptions}
              multiple
            />
          )
        }}
      </FilterTableHarness>
    )

    await user.click(screen.getByRole("button", { name: /Role/i }))
    await user.click(await screen.findByText("Researcher"))
    await user.click(screen.getByLabelText("Clear Role filter"))

    expect(screen.queryByLabelText("Clear Role filter")).not.toBeInTheDocument()
  })

  it("summarizes three or more selected values as a count", async () => {
    const user = userEvent.setup()
    const options = [
      { label: "Engineer", value: "Engineer" },
      { label: "Researcher", value: "Researcher" },
      { label: "Mathematician", value: "Mathematician" },
    ]
    render(
      <FilterTableHarness>
        {(table) => {
          const column = table.getColumn("role")
          if (!column) return null
          return (
            <TableFacetedFilter
              column={column}
              title="Role"
              options={options}
              multiple
            />
          )
        }}
      </FilterTableHarness>
    )

    await user.click(screen.getByRole("button", { name: /Role/i }))
    await user.click(await screen.findByRole("option", { name: /Engineer/i }))
    await user.click(await screen.findByRole("option", { name: /Researcher/i }))
    await user.click(await screen.findByRole("option", { name: /Mathematician/i }))

    expect(screen.getByTestId("ipa_badge")).toHaveTextContent("3 selected")
    expect(screen.queryByTestId("ipa_badge")).not.toHaveTextContent("Engineer")
  })

  it("updates role counts when the page size changes", async () => {
    const user = userEvent.setup()
    const roles = [
      "Engineer",
      "Engineer",
      "Researcher",
      "Mathematician",
      "Engineer",
      "Engineer",
      "Engineer",
      "Researcher",
      "Researcher",
      "Engineer",
      "Engineer",
      "Engineer",
    ]
    const columns: ColumnDef<{ id: string; role: string }>[] = [
      {
        accessorKey: "role",
        header: "Role",
        enableColumnFilter: true,
        meta: {
          label: "Role",
          variant: "multiSelect",
          options: [
            { label: "Engineer", value: "Engineer", count: 7 },
            { label: "Researcher", value: "Researcher", count: 3 },
            { label: "Mathematician", value: "Mathematician", count: 1 },
          ],
        },
      },
    ]

    function Harness() {
      const table = useTable({
        data: roles.map((role, index) => ({ id: String(index + 1), role })),
        columns,
        features: [withFiltering(), withPagination()],
        initialState: { pagination: { pageSize: 5, pageIndex: 0 } },
        getRowId: (row) => row.id,
      })

      return (
        <Table table={table}>
          <button type="button" onClick={() => table.setPageSize(50)}>
            Show 50
          </button>
          <Table.Filters />
        </Table>
      )
    }

    render(<Harness />)

    await user.click(screen.getByRole("button", { name: /Role/i }))
    expect(screen.getByRole("option", { name: /Engineer/i })).toHaveTextContent("3")

    await user.click(screen.getByRole("button", { name: "Show 50" }))
    await user.click(screen.getByRole("button", { name: /Role/i }))

    expect(screen.getByRole("option", { name: /Engineer/i })).toHaveTextContent("8")
  })
})

describe("tableSelectFilterFn", () => {
  const row = { getValue: () => "Engineer" } as never

  it("matches selected values case-insensitively", () => {
    expect(tableSelectFilterFn(row, "role", ["engineer"])).toBe(true)
    expect(tableSelectFilterFn(row, "role", ["ENGINEER"])).toBe(true)
    expect(tableSelectFilterFn(row, "role", ["Researcher"])).toBe(false)
  })
})

describe("tableSelectFilterFn", () => {
  const row = { getValue: () => "Engineer" } as never

  it("matches selected values case-insensitively", () => {
    expect(tableSelectFilterFn(row, "role", ["engineer"])).toBe(true)
    expect(tableSelectFilterFn(row, "role", ["ENGINEER"])).toBe(true)
    expect(tableSelectFilterFn(row, "role", ["Researcher"])).toBe(false)
  })
})
