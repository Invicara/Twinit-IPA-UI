import React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { TableDateFilter, tableDateFilterFn } from "./date-filter"
import {
  createFilterTestColumns,
  filterTestData,
  FilterTableHarness,
} from "../table.test-utils"
import { useTable } from "../use-table"
import { withFiltering } from "../features"

describe("TableDateFilter", () => {
  it("renders the date filter trigger", () => {
    render(
      <FilterTableHarness>
        {(table) => {
          const column = table.getColumn("joinedAt")
          if (!column) return null
          return <TableDateFilter column={column} title="Joined" />
        }}
      </FilterTableHarness>
    )

    expect(screen.getByRole("button", { name: /Joined/i })).toBeInTheDocument()
  })

  it("opens the calendar popover", async () => {
    const user = userEvent.setup()
    render(
      <FilterTableHarness>
        {(table) => {
          const column = table.getColumn("joinedAt")
          if (!column) return null
          return <TableDateFilter column={column} title="Joined" />
        }}
      </FilterTableHarness>
    )

    await user.click(screen.getByTestId("ipa_table_date_filter"))

    expect(await screen.findByTestId("ipa_calendar")).toBeInTheDocument()
  })

  it("shows a formatted label when a date filter is active", () => {
    function DateFilterWithValue() {
      const table = useTable({
        data: filterTestData,
        columns: createFilterTestColumns(),
        features: [withFiltering()],
        getRowId: (row) => row.id,
        initialState: {
          columnFilters: [{ id: "joinedAt", value: filterTestData[0].joinedAt }],
        },
      })
      const column = table.getColumn("joinedAt")
      if (!column) return null
      return <TableDateFilter column={column} title="Joined" />
    }

    render(<DateFilterWithValue />)

    expect(screen.getByRole("button", { name: /Jan 15, 2024/i })).toBeInTheDocument()
    expect(screen.getByLabelText("Clear Joined filter")).toBeInTheDocument()
  })

  it("opens a date range calendar when multiple is true", async () => {
    const user = userEvent.setup()
    render(
      <FilterTableHarness>
        {(table) => {
          const column = table.getColumn("joinedAt")
          if (!column) return null
          return <TableDateFilter column={column} title="Joined (range)" multiple />
        }}
      </FilterTableHarness>
    )

    await user.click(screen.getByTestId("ipa_table_date_filter"))

    expect(await screen.findByTestId("ipa_calendar")).toBeInTheDocument()
  })

  it("shows a formatted range label when a date range filter is active", () => {
    function DateRangeFilterWithValue() {
      const table = useTable({
        data: filterTestData,
        columns: createFilterTestColumns(),
        features: [withFiltering()],
        getRowId: (row) => row.id,
        initialState: {
          columnFilters: [
            {
              id: "joinedAt",
              value: [
                String(filterTestData[0].joinedAt),
                String(filterTestData[1].joinedAt),
              ],
            },
          ],
        },
      })
      const column = table.getColumn("joinedAt")
      if (!column) return null
      return <TableDateFilter column={column} title="Joined (range)" multiple />
    }

    render(<DateRangeFilterWithValue />)

    expect(
      screen.getByRole("button", { name: /Jan 15, 2024 - Jun 15, 2025/i })
    ).toBeInTheDocument()
    expect(screen.getByLabelText("Clear Joined (range) filter")).toBeInTheDocument()
  })

  it("shows relative date shortcuts when enabled", async () => {
    const user = userEvent.setup()
    render(
      <FilterTableHarness>
        {(table) => {
          const column = table.getColumn("joinedAt")
          if (!column) return null
          return (
            <TableDateFilter
              column={column}
              title="Joined"
              multiple
              showToday
              showThisMonth
            />
          )
        }}
      </FilterTableHarness>
    )

    await user.click(screen.getByTestId("ipa_table_date_filter"))

    expect(screen.getByRole("button", { name: "Today" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "This month" })).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "This year" })).not.toBeInTheDocument()
  })
})

describe("tableDateFilterFn", () => {
  const ada = new Date(2024, 0, 15).getTime()
  const row = { getValue: () => ada } as never

  it("keeps the row when the value is a matching calendar day", () => {
    expect(
      tableDateFilterFn(row, "joinedAt", String(new Date(2024, 0, 15).getTime()))
    ).toBe(true)
  })

  it("keeps the row for an inclusive timestamp range", () => {
    expect(
      tableDateFilterFn(row, "joinedAt", [
        String(new Date(2024, 0, 1).getTime()),
        String(new Date(2024, 0, 31).getTime()),
      ])
    ).toBe(true)
  })

  it("parses a typed date string", () => {
    expect(tableDateFilterFn(row, "joinedAt", "Jan 15, 2024")).toBe(true)
    expect(tableDateFilterFn(row, "joinedAt", "Jan 16, 2024")).toBe(false)
  })

  it("matches a parseable date string", () => {
    expect(tableDateFilterFn(row, "joinedAt", "Jan 15, 2024")).toBe(true)
  })

  it("treats an ISO date-only string as the local calendar day", () => {
    const lateLocal = {
      getValue: () => new Date(2024, 0, 15, 23, 30).getTime(),
    } as never
    const nextLocal = {
      getValue: () => new Date(2024, 0, 16, 0, 1).getTime(),
    } as never
    expect(tableDateFilterFn(row, "joinedAt", "2024-01-15")).toBe(true)
    expect(tableDateFilterFn(lateLocal, "joinedAt", "2024-01-15")).toBe(true)
    expect(tableDateFilterFn(nextLocal, "joinedAt", "2024-01-15")).toBe(false)
  })

  it("matches no rows for an unparseable date string", () => {
    expect(tableDateFilterFn(row, "joinedAt", "whenever")).toBe(false)
  })

  it("matches a day-first single date and a numeric range", () => {
    const onFirstFeb = { getValue: () => new Date(2024, 1, 1, 15).getTime() } as never
    const onThirdApr = { getValue: () => new Date(2024, 3, 3, 9).getTime() } as never
    expect(tableDateFilterFn(onFirstFeb, "joinedAt", "01/02/2024")).toBe(true)
    expect(tableDateFilterFn(onFirstFeb, "joinedAt", "01-02-2024")).toBe(true)
    expect(tableDateFilterFn(onFirstFeb, "joinedAt", "01 02 2024")).toBe(true)
    expect(tableDateFilterFn(row, "joinedAt", "01/02/2024")).toBe(false)
    expect(tableDateFilterFn(onFirstFeb, "joinedAt", "01/02/2024 - 03/04/2024")).toBe(true)
    expect(tableDateFilterFn(onThirdApr, "joinedAt", "01/02/2024 to 03/04/2024")).toBe(true)
    expect(tableDateFilterFn(row, "joinedAt", "01/02/2024 - 03/04/2024")).toBe(false)
  })
})
