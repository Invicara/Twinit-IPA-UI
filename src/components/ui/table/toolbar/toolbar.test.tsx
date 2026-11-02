import React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { TableFilters, TableToolbar, TableToolbarFilterMenu } from "./toolbar"
import { FilterTableHarness } from "../table.test-utils"

describe("TableToolbar column filters", () => {
  it("renders column filter controls when Table.Filters is composed", () => {
    render(
      <FilterTableHarness>
        {(table) => (
          <TableToolbar table={table}>
            <TableFilters />
          </TableToolbar>
        )}
      </FilterTableHarness>
    )

    expect(screen.getByLabelText("Filter Name")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Role/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Joined/i })).toBeInTheDocument()
  })

  it("renders the filter menu when Table.FilterMenu is composed", () => {
    render(
      <FilterTableHarness>
        {(table) => (
          <TableToolbar table={table}>
            <TableToolbarFilterMenu table={table} />
          </TableToolbar>
        )}
      </FilterTableHarness>
    )

    expect(screen.getByRole("button", { name: "Filter" })).toBeInTheDocument()
  })

  it("filters rows through a text column filter input", async () => {
    const user = userEvent.setup()
    render(
      <FilterTableHarness>
        {(table) => (
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
        )}
      </FilterTableHarness>
    )

    await user.type(screen.getByLabelText("Filter Name"), "Ada")

    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument()
    expect(screen.queryByText("Grace Hopper")).not.toBeInTheDocument()
  })

  it("shows reset when column filters are active", async () => {
    const user = userEvent.setup()
    render(
      <FilterTableHarness>
        {(table) => (
          <TableToolbar table={table}>
            <TableFilters />
          </TableToolbar>
        )}
      </FilterTableHarness>
    )

    await user.type(screen.getByLabelText("Filter Name"), "Ada")

    expect(screen.getByRole("button", { name: "Reset filters" })).toBeInTheDocument()
  })

  it("does not show filter chips next to inline column filters", async () => {
    const user = userEvent.setup()
    render(
      <FilterTableHarness>
        {(table) => (
          <TableToolbar table={table}>
            <TableFilters />
            <TableToolbarFilterMenu table={table} />
          </TableToolbar>
        )}
      </FilterTableHarness>
    )

    await user.type(screen.getByLabelText("Filter Name"), "Ada")

    expect(screen.queryByText(/Name: Ada/)).not.toBeInTheDocument()
    expect(screen.queryByLabelText("Remove Name filter")).not.toBeInTheDocument()
  })
})
