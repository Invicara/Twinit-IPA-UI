import React from "react"
import type { Column } from "@tanstack/react-table"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { applyFilterMenuValue, TableFilterMenu } from "./filter-menu"
import { TableFilters } from "../toolbar/toolbar"
import { FilterTableHarness } from "../table.test-utils"

describe("TableFilterMenu", () => {
  it("renders the filter menu trigger", () => {
    render(
      <FilterTableHarness>
        {(table) => <TableFilterMenu table={table} />}
      </FilterTableHarness>
    )

    expect(screen.getByRole("button", { name: "Filter" })).toBeInTheDocument()
  })

  it("lists filterable columns in the command menu", async () => {
    const user = userEvent.setup()
    render(
      <FilterTableHarness>
        {(table) => <TableFilterMenu table={table} />}
      </FilterTableHarness>
    )

    await user.click(screen.getByRole("button", { name: "Filter" }))

    expect(await screen.findByText("Name")).toBeInTheDocument()
    expect(screen.getByText("Role")).toBeInTheDocument()
    expect(screen.getByText("Joined")).toBeInTheDocument()
  })

  it("matches any part of a column label", async () => {
    const user = userEvent.setup()
    render(
      <FilterTableHarness>
        {(table) => <TableFilterMenu table={table} />}
      </FilterTableHarness>
    )

    await user.click(screen.getByRole("button", { name: "Filter" }))
    const search = await screen.findByPlaceholderText("Filter by column...")

    await user.type(search, "nnaame")
    expect(screen.queryByRole("option", { name: "Name" })).not.toBeInTheDocument()
    expect(screen.getByText("No columns found.")).toBeInTheDocument()

    await user.clear(search)
    await user.type(search, "ame")
    expect(screen.getByRole("option", { name: "Name" })).toBeInTheDocument()
    expect(screen.queryByRole("option", { name: "Role" })).not.toBeInTheDocument()
  })

  it("applies a text filter and shows a removable chip", async () => {
    const user = userEvent.setup()
    render(
      <FilterTableHarness>
        {(table) => <TableFilterMenu table={table} />}
      </FilterTableHarness>
    )

    await user.click(screen.getByRole("button", { name: "Filter" }))
    await user.click(await screen.findByText("Name"))
    await user.type(screen.getByPlaceholderText("Search names..."), "Ada")
    await user.click(screen.getByRole("button", { name: "Apply" }))

    expect(screen.getByText(/Name: Ada/)).toBeInTheDocument()
    expect(screen.getByLabelText("Remove Name filter")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Filter" })).toHaveTextContent("1")
  })

  it("removes an active filter chip", async () => {
    const user = userEvent.setup()
    render(
      <FilterTableHarness>
        {(table) => <TableFilterMenu table={table} />}
      </FilterTableHarness>
    )

    await user.click(screen.getByRole("button", { name: "Filter" }))
    await user.click(await screen.findByText("Name"))
    await user.type(screen.getByPlaceholderText("Search names..."), "Ada")
    await user.click(screen.getByRole("button", { name: "Apply" }))
    await user.click(screen.getByLabelText("Remove Name filter"))

    expect(screen.queryByText(/Name: Ada/)).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Filter" })).not.toHaveTextContent("1")
  })

  it("writes the exact menu string onto a date filter trigger", async () => {
    const user = userEvent.setup()
    render(
      <FilterTableHarness>
        {(table) => (
          <>
            <TableFilters table={table} />
            <TableFilterMenu table={table} />
          </>
        )}
      </FilterTableHarness>
    )

    await user.click(screen.getByRole("button", { name: "Filter" }))
    await user.click(await screen.findByRole("option", { name: "Joined" }))
    await user.type(screen.getByPlaceholderText("Enter value..."), "whenever")
    await user.click(screen.getByRole("button", { name: "Apply" }))

    expect(screen.getByRole("button", { name: /whenever/i })).toBeInTheDocument()
  })

  it("parses a typed date from the filter menu and keeps matching rows", async () => {
    const user = userEvent.setup()
    render(
      <FilterTableHarness>
        {(table) => (
          <>
            <TableFilterMenu table={table} />
            <div data-testid="rows">
              {table.getRowModel().rows.map((row) => (
                <div key={row.id}>{row.original.name}</div>
              ))}
            </div>
          </>
        )}
      </FilterTableHarness>
    )

    await user.click(screen.getByRole("button", { name: "Filter" }))
    await user.click(await screen.findByRole("option", { name: "Joined" }))
    await user.type(screen.getByPlaceholderText("Enter value..."), "Jan 15, 2024")
    await user.click(screen.getByRole("button", { name: "Apply" }))

    expect(screen.getByTestId("rows")).toHaveTextContent("Ada Lovelace")
    expect(screen.getByTestId("rows")).not.toHaveTextContent("Grace Hopper")
    expect(screen.getByTestId("rows")).not.toHaveTextContent("Alan Turing")
  })

  it("matches select values case-insensitively from the filter menu", async () => {
    const user = userEvent.setup()
    render(
      <FilterTableHarness>
        {(table) => (
          <>
            <TableFilterMenu table={table} />
            <div data-testid="rows">
              {table.getRowModel().rows.map((row) => (
                <div key={row.id}>{row.original.name}</div>
              ))}
            </div>
          </>
        )}
      </FilterTableHarness>
    )

    await user.click(screen.getByRole("button", { name: "Filter" }))
    await user.click(await screen.findByRole("option", { name: "Role" }))
    await user.type(screen.getByPlaceholderText("Enter value..."), "engineer")
    await user.click(screen.getByRole("button", { name: "Apply" }))

    expect(screen.getByTestId("rows")).toHaveTextContent("Ada Lovelace")
    expect(screen.getByTestId("rows")).not.toHaveTextContent("Grace Hopper")
    expect(screen.getByTestId("rows")).not.toHaveTextContent("Alan Turing")
  })

  it("empties rows when a typed date cannot be parsed", async () => {
    const user = userEvent.setup()
    render(
      <FilterTableHarness>
        {(table) => (
          <>
            <TableFilterMenu table={table} />
            <div data-testid="rows">
              {table.getRowModel().rows.map((row) => (
                <div key={row.id}>{row.original.name}</div>
              ))}
            </div>
          </>
        )}
      </FilterTableHarness>
    )

    await user.click(screen.getByRole("button", { name: "Filter" }))
    await user.click(await screen.findByRole("option", { name: "Joined" }))
    await user.type(screen.getByPlaceholderText("Enter value..."), "whenever")
    await user.click(screen.getByRole("button", { name: "Apply" }))

    expect(screen.getByText(/whenever/i)).toBeInTheDocument()
    expect(screen.getByTestId("rows")).toBeEmptyDOMElement()
  })

  it("parses a typed date from the filter menu and keeps matching rows", async () => {
    const user = userEvent.setup()
    render(
      <FilterTableHarness>
        {(table) => (
          <>
            <TableFilterMenu table={table} />
            <div data-testid="rows">
              {table.getRowModel().rows.map((row) => (
                <div key={row.id}>{row.original.name}</div>
              ))}
            </div>
          </>
        )}
      </FilterTableHarness>
    )

    await user.click(screen.getByRole("button", { name: "Filter" }))
    await user.click(await screen.findByRole("option", { name: "Joined" }))
    await user.type(screen.getByPlaceholderText("Enter value..."), "Jan 15, 2024")
    await user.click(screen.getByRole("button", { name: "Apply" }))

    expect(screen.getByText(/Jan 15, 2024/)).toBeInTheDocument()
    expect(screen.getByTestId("rows")).toHaveTextContent("Ada Lovelace")
  })

  it("matches select values case-insensitively from the filter menu", async () => {
    const user = userEvent.setup()
    render(
      <FilterTableHarness>
        {(table) => (
          <>
            <TableFilterMenu table={table} />
            <div data-testid="rows">
              {table.getRowModel().rows.map((row) => (
                <div key={row.id}>{row.original.name}</div>
              ))}
            </div>
          </>
        )}
      </FilterTableHarness>
    )

    await user.click(screen.getByRole("button", { name: "Filter" }))
    await user.click(await screen.findByRole("option", { name: "Role" }))
    await user.type(screen.getByPlaceholderText("Enter value..."), "engineer")
    await user.click(screen.getByRole("button", { name: "Apply" }))

    expect(screen.getByTestId("rows")).toHaveTextContent("Ada Lovelace")
    expect(screen.getByTestId("rows")).not.toHaveTextContent("Grace Hopper")
    expect(screen.getByTestId("rows")).not.toHaveTextContent("Alan Turing")
  })

  it("empties rows when a typed date cannot be parsed", async () => {
    const user = userEvent.setup()
    render(
      <FilterTableHarness>
        {(table) => (
          <>
            <TableFilterMenu table={table} />
            <div data-testid="rows">
              {table.getRowModel().rows.map((row) => (
                <div key={row.id}>{row.original.name}</div>
              ))}
            </div>
          </>
        )}
      </FilterTableHarness>
    )

    await user.click(screen.getByRole("button", { name: "Filter" }))
    await user.click(await screen.findByRole("option", { name: "Joined" }))
    await user.type(screen.getByPlaceholderText("Enter value..."), "1st jan")
    await user.click(screen.getByRole("button", { name: "Apply" }))

    expect(screen.getByTestId("rows")).toBeEmptyDOMElement()
  })

  it("writes enum CSV values onto the faceted filter trigger", async () => {
    const user = userEvent.setup()
    render(
      <FilterTableHarness>
        {(table) => (
          <>
            <TableFilters table={table} />
            <TableFilterMenu table={table} />
          </>
        )}
      </FilterTableHarness>
    )

    await user.click(screen.getByRole("button", { name: "Filter" }))
    await user.click(await screen.findByRole("option", { name: "Role" }))
    await user.type(screen.getByPlaceholderText("Enter value..."), "Engineer, Researcher")
    await user.click(screen.getByRole("button", { name: "Apply" }))

    expect(screen.getByText("Engineer")).toBeInTheDocument()
    expect(screen.getByText("Researcher")).toBeInTheDocument()
  })

  it("ticks filtered columns and clears them when the tick is clicked", async () => {
    const user = userEvent.setup()
    render(
      <FilterTableHarness>
        {(table) => (
          <>
            <TableFilters table={table} />
            <TableFilterMenu table={table} />
          </>
        )}
      </FilterTableHarness>
    )

    await user.click(screen.getByRole("button", { name: /Role/i }))
    await user.click(await screen.findByRole("option", { name: /Engineer/i }))
    await user.keyboard("{Escape}")

    await user.click(screen.getByRole("button", { name: "Filter" }))
    const roleOption = await screen.findByRole("option", { name: "Role" })
    expect(roleOption.querySelector("svg")).toBeInTheDocument()

    await user.click(roleOption)

    expect(screen.getByRole("option", { name: "Role" }).querySelector("svg")).toBeNull()
    expect(screen.queryByLabelText("Clear Role filter")).not.toBeInTheDocument()
  })

  it("hides Reset until a filter is applied, then dismisses on Reset", async () => {
    const user = userEvent.setup()
    render(
      <FilterTableHarness>
        {(table) => <TableFilterMenu table={table} />}
      </FilterTableHarness>
    )

    await user.click(screen.getByRole("button", { name: "Filter" }))
    expect(await screen.findByPlaceholderText("Filter by column...")).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Reset" })).not.toBeInTheDocument()

    await user.click(await screen.findByText("Name"))
    await user.type(screen.getByPlaceholderText("Search names..."), "Ada")
    await user.click(screen.getByRole("button", { name: "Apply" }))

    await user.click(screen.getByRole("button", { name: "Filter" }))
    await user.click(await screen.findByRole("button", { name: "Reset" }))

    expect(screen.queryByPlaceholderText("Filter by column...")).not.toBeInTheDocument()
  })
})

function mockFilterColumn(
  variant: string,
  meta?: Record<string, unknown>
) {
  return {
    id: "col",
    columnDef: { meta: { variant, ...meta } },
    setFilterValue: jest.fn(),
  } as unknown as Column<unknown> & { setFilterValue: jest.Mock }
}

describe("applyFilterMenuValue", () => {
  it("parses enum values as CSV", () => {
    const column = mockFilterColumn("multiSelect")
    applyFilterMenuValue(column, "Engineer, Researcher")
    expect(column.setFilterValue).toHaveBeenCalledWith(["Engineer", "Researcher"])
  })

  it("treats a value with no comma as a single enum selection", () => {
    const column = mockFilterColumn("select")
    applyFilterMenuValue(column, "Engineer")
    expect(column.setFilterValue).toHaveBeenCalledWith(["Engineer"])
  })

  it("clears a rating that cannot be parsed", () => {
    const column = mockFilterColumn("rating")
    applyFilterMenuValue(column, "not a rating")
    expect(column.setFilterValue).toHaveBeenCalledWith(undefined)
  })

  it("writes a checkbox string through unchanged", () => {
    const column = mockFilterColumn("checkbox")
    applyFilterMenuValue(column, "contractor")
    expect(column.setFilterValue).toHaveBeenCalledWith("contractor")
  })

  it.each(["Full-Time", "full-time", "fulltime", "Full-time"])(
    "maps checkbox label spelling %s to checkedValue",
    (input) => {
      const column = mockFilterColumn("checkbox", {
        checkedValue: "fulltime",
        checkedLabel: "Full-time",
      })
      applyFilterMenuValue(column, input)
      expect(column.setFilterValue).toHaveBeenCalledWith("fulltime")
    }
  )

  it("maps select values onto option values case-insensitively", () => {
    const column = mockFilterColumn("multiSelect", {
      options: [
        { label: "Engineer", value: "Engineer" },
        { label: "Researcher", value: "Researcher" },
      ],
    })
    applyFilterMenuValue(column, "ENGINEER")
    expect(column.setFilterValue).toHaveBeenCalledWith(["Engineer"])
  })

  it("writes an unparsed date string through unchanged", () => {
    const column = mockFilterColumn("date")
    applyFilterMenuValue(column, "whenever")
    expect(column.setFilterValue).toHaveBeenCalledWith("whenever")
  })

  it.each(["01/02/2024", "01-02-2024", "01 02 2024"])(
    "stores a single joined date %s as a same-day range",
    (input) => {
      const column = mockFilterColumn("dateRange")
      applyFilterMenuValue(column, input)
      const value = column.setFilterValue.mock.calls[0][0] as [string, string]
      expect(value).toHaveLength(2)
      const from = new Date(Number(value[0]))
      const to = new Date(Number(value[1]))
      expect(from.getFullYear()).toBe(2024)
      expect(from.getMonth()).toBe(1)
      expect(from.getDate()).toBe(1)
      expect(to.getTime()).toBe(from.getTime())
    }
  )

  it("stores a typed from–to date as two different days", () => {
    const column = mockFilterColumn("dateRange")
    applyFilterMenuValue(column, "01/02/2024 - 03/04/2024")
    const value = column.setFilterValue.mock.calls[0][0] as [string, string]
    const from = new Date(Number(value[0]))
    const to = new Date(Number(value[1]))
    expect(from.getMonth()).toBe(1)
    expect(from.getDate()).toBe(1)
    expect(to.getMonth()).toBe(3)
    expect(to.getDate()).toBe(3)
    expect(to.getTime()).not.toBe(from.getTime())
  })
})
