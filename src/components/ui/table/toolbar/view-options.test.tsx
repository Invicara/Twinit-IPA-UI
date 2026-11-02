import React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { TableViewOptions } from "./view-options"
import { useTable } from "../use-table"

type ViewRow = {
  id: string
  name: string
  email: string
}

const viewTestData: ViewRow[] = [
  { id: "1", name: "Ada", email: "ada@example.com" },
  { id: "2", name: "Grace", email: "grace@example.com" },
]

function createViewTestColumns(): ColumnDef<ViewRow>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      meta: { label: "Name" },
      enableHiding: true,
    },
    {
      accessorKey: "email",
      header: "Email",
      meta: { label: "Email" },
      enableHiding: true,
    },
  ]
}

function ViewTableHarness({
  children,
}: {
  children: (table: ReturnType<typeof useViewTestTable>) => React.ReactNode
}) {
  const table = useViewTestTable()
  return <>{children(table)}</>
}

function useViewTestTable() {
  return useTable({
    data: viewTestData,
    columns: createViewTestColumns(),
    getRowId: (row) => row.id,
  })
}

describe("TableViewOptions", () => {
  it("renders the view trigger", () => {
    render(
      <ViewTableHarness>
        {(table) => <TableViewOptions table={table} />}
      </ViewTableHarness>
    )

    expect(screen.getByRole("combobox", { name: "Toggle columns" })).toBeInTheDocument()
    expect(screen.getByText("View")).toBeInTheDocument()
  })

  it("lists hideable columns and toggles visibility", async () => {
    const user = userEvent.setup()
    let tableInstance: ReturnType<typeof useViewTestTable> | undefined

    render(
      <ViewTableHarness>
        {(table) => {
          tableInstance = table
          return <TableViewOptions table={table} />
        }}
      </ViewTableHarness>
    )

    await user.click(screen.getByRole("combobox", { name: "Toggle columns" }))

    expect(await screen.findByPlaceholderText("Search columns...")).toBeInTheDocument()
    expect(screen.getByText("Name")).toBeInTheDocument()
    expect(screen.getByText("Email")).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Reset" })).not.toBeInTheDocument()

    await user.click(screen.getByText("Email"))

    expect(tableInstance?.getColumn("email")?.getIsVisible()).toBe(false)
    expect(screen.getByRole("combobox", { name: "Toggle columns" })).toHaveTextContent(
      "View1"
    )

    await user.click(screen.getByRole("button", { name: "Reset" }))

    expect(tableInstance?.getColumn("email")?.getIsVisible()).toBe(true)
    expect(screen.queryByPlaceholderText("Search columns...")).not.toBeInTheDocument()
    expect(
      screen.getByRole("combobox", { name: "Toggle columns" })
    ).not.toHaveTextContent("1")
  })

  it("matches any part of a column label", async () => {
    const user = userEvent.setup()
    render(
      <ViewTableHarness>
        {(table) => <TableViewOptions table={table} />}
      </ViewTableHarness>
    )

    await user.click(screen.getByRole("combobox", { name: "Toggle columns" }))
    const search = await screen.findByPlaceholderText("Search columns...")

    await user.type(search, "eemmaail")
    expect(screen.queryByRole("option", { name: "Email" })).not.toBeInTheDocument()
    expect(screen.getByText("No columns found.")).toBeInTheDocument()

    await user.clear(search)
    await user.type(search, "mai")
    expect(screen.getByRole("option", { name: "Email" })).toBeInTheDocument()
  })
})
