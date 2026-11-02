import React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { TableCheckboxFilter } from "./checkbox-filter"
import { useTable } from "../use-table"
import { withFiltering } from "../features"

type ContractRow = { id: string; name: string; contract: string }

const contractData: ContractRow[] = [
  { id: "1", name: "Ada", contract: "fulltime" },
  { id: "2", name: "Grace", contract: "contractor" },
  { id: "3", name: "Alan", contract: "temp" },
]

const contractColumns: ColumnDef<ContractRow>[] = [
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "contract",
    header: "Contract",
    enableColumnFilter: true,
    meta: {
      label: "Contract",
      variant: "checkbox",
      checkedValue: "fulltime",
      checkedLabel: "Full-time",
    },
  },
]

function ContractFilterHarness({
  children,
}: {
  children: (table: ReturnType<typeof useTable<ContractRow>>) => React.ReactNode
}) {
  const table = useTable({
    data: contractData,
    columns: contractColumns,
    features: [withFiltering()],
    getRowId: (row) => row.id,
  })
  return <>{children(table)}</>
}

describe("TableCheckboxFilter", () => {
  it("renders an unchecked trigger with the custom label", () => {
    render(
      <ContractFilterHarness>
        {(table) => {
          const column = table.getColumn("contract")
          if (!column) return null
          return <TableCheckboxFilter column={column} title="Contract" />
        }}
      </ContractFilterHarness>
    )

    const trigger = screen.getByRole("button", { name: /Full-time/i })
    expect(trigger).toHaveAttribute("aria-pressed", "false")
  })

  it("checks on click and keeps only matching rows", async () => {
    const user = userEvent.setup()
    render(
      <ContractFilterHarness>
        {(table) => {
          const column = table.getColumn("contract")
          if (!column) return null
          return (
            <>
              <TableCheckboxFilter column={column} title="Contract" />
              <div data-testid="rows">
                {table.getRowModel().rows.map((row) => (
                  <div key={row.id}>{row.original.name}</div>
                ))}
              </div>
            </>
          )
        }}
      </ContractFilterHarness>
    )

    await user.click(screen.getByRole("button", { name: /Full-time/i }))

    expect(screen.getByRole("button", { name: /Full-time/i })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
    expect(screen.getByTestId("rows")).toHaveTextContent("Ada")
    expect(screen.queryByTestId("rows")).not.toHaveTextContent("Grace")
    expect(screen.queryByTestId("rows")).not.toHaveTextContent("Alan")
  })

  it("unchecks on a second click and restores all rows", async () => {
    const user = userEvent.setup()
    render(
      <ContractFilterHarness>
        {(table) => {
          const column = table.getColumn("contract")
          if (!column) return null
          return (
            <>
              <TableCheckboxFilter column={column} title="Contract" />
              <div data-testid="rows">
                {table.getRowModel().rows.map((row) => (
                  <div key={row.id}>{row.original.name}</div>
                ))}
              </div>
            </>
          )
        }}
      </ContractFilterHarness>
    )

    const trigger = screen.getByRole("button", { name: /Full-time/i })
    await user.click(trigger)
    await user.click(trigger)

    expect(trigger).toHaveAttribute("aria-pressed", "false")
    expect(screen.getByTestId("rows")).toHaveTextContent("Grace")
  })

  it("shows a custom string on the trigger and matches it case-insensitively", async () => {
    const user = userEvent.setup()
    render(
      <ContractFilterHarness>
        {(table) => {
          const column = table.getColumn("contract")
          if (!column) return null
          return (
            <>
              <TableCheckboxFilter column={column} title="Contract" />
              <button
                type="button"
                onClick={() => column.setFilterValue("TEMP")}
              >
                Apply temp
              </button>
              <div data-testid="rows">
                {table.getRowModel().rows.map((row) => (
                  <div key={row.id}>{row.original.name}</div>
                ))}
              </div>
            </>
          )
        }}
      </ContractFilterHarness>
    )

    await user.click(screen.getByRole("button", { name: "Apply temp" }))

    const trigger = screen.getByRole("button", { name: "TEMP" })
    expect(trigger).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByTestId("rows")).toHaveTextContent("Alan")
    expect(screen.queryByTestId("rows")).not.toHaveTextContent("Ada")
    expect(screen.queryByTestId("rows")).not.toHaveTextContent("Grace")

    await user.click(trigger)

    expect(screen.getByRole("button", { name: /Full-time/i })).toHaveAttribute(
      "aria-pressed",
      "false"
    )
  })

  it.each(["Full-Time", "full-time"])(
    "matches hyphenated spelling %s to fulltime rows",
    async (value) => {
      const user = userEvent.setup()
      render(
        <ContractFilterHarness>
          {(table) => {
            const column = table.getColumn("contract")
            if (!column) return null
            return (
              <>
                <TableCheckboxFilter column={column} title="Contract" />
                <button
                  type="button"
                  onClick={() => column.setFilterValue(value)}
                >
                  Apply spelling
                </button>
                <div data-testid="rows">
                  {table.getRowModel().rows.map((row) => (
                    <div key={row.id}>{row.original.name}</div>
                  ))}
                </div>
              </>
            )
          }}
        </ContractFilterHarness>
      )

      await user.click(screen.getByRole("button", { name: "Apply spelling" }))

      expect(screen.getByTestId("rows")).toHaveTextContent("Ada")
      expect(screen.queryByTestId("rows")).not.toHaveTextContent("Grace")
      expect(screen.queryByTestId("rows")).not.toHaveTextContent("Alan")
    }
  )
})
