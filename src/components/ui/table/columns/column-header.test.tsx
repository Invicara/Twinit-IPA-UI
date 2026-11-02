import React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import type { ColumnDef } from "@tanstack/react-table"
import { TableColumnHeader } from "./column-header"
import { useTable } from "../use-table"

type Row = { id: string; name: string }

const columns: ColumnDef<Row>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <TableColumnHeader column={column} label="Name" variant="menu" />
    ),
    enableHiding: true,
  },
]

function MenuHeaderHarness() {
  const table = useTable({
    data: [{ id: "1", name: "Ada Lovelace" }],
    columns,
    getRowId: (row) => row.id,
  })

  const column = table.getColumn("name")
  if (!column) return null

  return <TableColumnHeader column={column} label="Name" variant="menu" />
}

describe("TableColumnHeader", () => {
  it("renders a plain label when sorting and hiding are disabled", () => {
    const column = {
      getCanSort: () => false,
      getCanHide: () => false,
      getIsSorted: () => false,
    } as never

    render(<TableColumnHeader column={column} label="Status" variant="menu" />)

    expect(screen.getByTestId("ipa_table_column_header")).toHaveTextContent("Status")
    expect(screen.queryByLabelText("Column menu for Status")).not.toBeInTheDocument()
  })

  it("renders a one-click sort button in button variant", async () => {
    const user = userEvent.setup()
    const toggleSorting = jest.fn()
    const column = {
      getCanSort: () => true,
      getCanHide: () => false,
      getIsSorted: () => false,
      toggleSorting,
    } as never

    render(<TableColumnHeader column={column} label="Name" variant="button" />)

    await user.click(screen.getByLabelText("Sort by Name"))

    expect(toggleSorting).toHaveBeenCalledTimes(1)
    expect(toggleSorting).toHaveBeenCalledWith()
  })

  it("opens the column menu and applies ascending sort", async () => {
    const user = userEvent.setup()
    render(<MenuHeaderHarness />)

    await user.click(screen.getByLabelText("Column menu for Name"))
    await user.click(await screen.findByText("Asc"))

    expect(screen.getByLabelText("Column menu for Name")).toBeInTheDocument()
  })

  it("shows hide in the menu when column hiding is enabled", async () => {
    const user = userEvent.setup()
    render(<MenuHeaderHarness />)

    await user.click(screen.getByLabelText("Column menu for Name"))

    expect(await screen.findByText("Hide")).toBeInTheDocument()
  })

  it("lists Reset after Hide in the column menu", async () => {
    const user = userEvent.setup()
    render(<MenuHeaderHarness />)

    await user.click(screen.getByLabelText("Column menu for Name"))
    await user.click(await screen.findByText("Asc"))
    await user.click(screen.getByLabelText("Column menu for Name"))

    const hide = await screen.findByText("Hide")
    const reset = await screen.findByText("Reset")
    expect(
      hide.compareDocumentPosition(reset) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
  })
})
