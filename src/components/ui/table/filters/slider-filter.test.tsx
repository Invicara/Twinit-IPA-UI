import React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { TableSliderFilter, tableRangeFilterFn } from "./slider-filter"
import { useTable } from "../use-table"
import { withFiltering } from "../features"

type HoursRow = { id: string; name: string; estHours: number }

const hoursData: HoursRow[] = [
  { id: "1", name: "Ada", estHours: 4 },
  { id: "2", name: "Grace", estHours: 12 },
  { id: "3", name: "Alan", estHours: 20 },
]

const hoursColumns: ColumnDef<HoursRow>[] = [
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "estHours",
    header: "Est. Hours",
    enableColumnFilter: true,
    meta: {
      label: "Est. Hours",
      variant: "range",
      range: [1, 24],
      unit: "hr",
      step: 1,
    },
    filterFn: "inNumberRange",
  },
]

function HoursFilterHarness({
  children,
  initialRange,
}: {
  children: (table: ReturnType<typeof useTable<HoursRow>>) => React.ReactNode
  initialRange?: [number, number]
}) {
  const table = useTable({
    data: hoursData,
    columns: hoursColumns,
    features: [withFiltering()],
    getRowId: (row) => row.id,
    initialState: initialRange
      ? { columnFilters: [{ id: "estHours", value: initialRange }] }
      : undefined,
  })
  return <>{children(table)}</>
}

describe("TableSliderFilter", () => {
  it("renders the range filter trigger with the column title when idle", () => {
    render(
      <HoursFilterHarness>
        {(table) => {
          const column = table.getColumn("estHours")
          if (!column) return null
          return <TableSliderFilter column={column} title="Est. Hours" />
        }}
      </HoursFilterHarness>
    )

    expect(screen.getByRole("button", { name: /Est\. Hours/i })).toBeInTheDocument()
    expect(screen.queryByText(/8 to 16hr/)).not.toBeInTheDocument()
  })

  it("opens inputs, unit suffix, and a dual-thumb slider", async () => {
    const user = userEvent.setup()
    render(
      <HoursFilterHarness>
        {(table) => {
          const column = table.getColumn("estHours")
          if (!column) return null
          return <TableSliderFilter column={column} title="Est. Hours" />
        }}
      </HoursFilterHarness>
    )

    await user.click(screen.getByRole("button", { name: /Est\. Hours/i }))

    expect(screen.getByLabelText("Est. Hours from")).toHaveValue(1)
    expect(screen.getByLabelText("Est. Hours to")).toHaveValue(24)
    expect(screen.getAllByText("hr")).toHaveLength(2)
    expect(screen.getByTestId("ipa_slider")).toBeInTheDocument()
  })

  it("applies a numeric range and filters rows", async () => {
    const user = userEvent.setup()
    render(
      <HoursFilterHarness>
        {(table) => {
          const column = table.getColumn("estHours")
          if (!column) return null
          return (
            <>
              <TableSliderFilter column={column} title="Est. Hours" />
              <div data-testid="rows">
                {table.getRowModel().rows.map((row) => (
                  <div key={row.id}>{row.original.name}</div>
                ))}
              </div>
            </>
          )
        }}
      </HoursFilterHarness>
    )

    await user.click(screen.getByRole("button", { name: /Est\. Hours/i }))
    const from = screen.getByLabelText("Est. Hours from")
    await user.clear(from)
    await user.type(from, "10")

    expect(screen.getByTestId("rows")).toHaveTextContent("Grace")
    expect(screen.getByTestId("rows")).toHaveTextContent("Alan")
    expect(screen.queryByTestId("rows")).not.toHaveTextContent("Ada")
  })

  it("clears the range from the popover", async () => {
    const user = userEvent.setup()
    render(
      <HoursFilterHarness initialRange={[8, 16]}>
        {(table) => {
          const column = table.getColumn("estHours")
          if (!column) return null
          return (
            <>
              <TableSliderFilter column={column} title="Est. Hours" />
              <div data-testid="rows">
                {table.getRowModel().rows.map((row) => (
                  <div key={row.id}>{row.original.name}</div>
                ))}
              </div>
            </>
          )
        }}
      </HoursFilterHarness>
    )

    expect(screen.getByTestId("rows")).toHaveTextContent("Grace")
    expect(screen.queryByTestId("rows")).not.toHaveTextContent("Ada")

    await user.click(screen.getByRole("button", { name: /8 to 16hr/i }))
    await user.click(screen.getByRole("button", { name: "Reset" }))

    expect(screen.getByTestId("rows")).toHaveTextContent("Ada")
    expect(screen.getByTestId("rows")).toHaveTextContent("Alan")
    expect(screen.queryByTestId("ipa_slider")).not.toBeInTheDocument()
  })

  it("shows the selected range on the trigger and clears from the X icon", async () => {
    const user = userEvent.setup()
    render(
      <HoursFilterHarness initialRange={[5, 10]}>
        {(table) => {
          const column = table.getColumn("estHours")
          if (!column) return null
          return (
            <>
              <TableSliderFilter column={column} title="Est. Hours" />
              <div data-testid="rows">
                {table.getRowModel().rows.map((row) => (
                  <div key={row.id}>{row.original.name}</div>
                ))}
              </div>
            </>
          )
        }}
      </HoursFilterHarness>
    )

    expect(screen.getByRole("button", { name: /5 to 10hr/i })).toHaveTextContent("5 to 10hr")
    expect(screen.getByRole("button", { name: /5 to 10hr/i })).toHaveTextContent("Est. Hours")

    await user.click(screen.getByLabelText("Clear Est. Hours filter"))

    expect(screen.getByRole("button", { name: /Est\. Hours/i })).toBeInTheDocument()
    expect(screen.getByTestId("rows")).toHaveTextContent("Ada")
    expect(screen.getByTestId("rows")).toHaveTextContent("Alan")
  })

  it("dismisses the popover after clearing from the trigger X", async () => {
    const user = userEvent.setup()
    render(
      <HoursFilterHarness initialRange={[5, 10]}>
        {(table) => {
          const column = table.getColumn("estHours")
          if (!column) return null
          return <TableSliderFilter column={column} title="Est. Hours" />
        }}
      </HoursFilterHarness>
    )

    await user.click(screen.getByRole("button", { name: /5 to 10hr/i }))
    expect(screen.getByTestId("ipa_slider")).toBeInTheDocument()

    await user.click(screen.getByLabelText("Clear Est. Hours filter"))

    expect(screen.queryByTestId("ipa_slider")).not.toBeInTheDocument()
  })
})

describe("tableRangeFilterFn", () => {
  const row = { getValue: () => 12 } as never

  it("keeps values inside a numeric range", () => {
    expect(tableRangeFilterFn(row, "estHours", [8, 16])).toBe(true)
  })

  it("matches no rows for an unparseable range string", () => {
    expect(tableRangeFilterFn(row, "estHours", "abc")).toBe(false)
    expect(tableRangeFilterFn(row, "estHours", "not-a-range")).toBe(false)
  })
})
