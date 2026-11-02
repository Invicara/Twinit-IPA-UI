import React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { TableSortList } from "./sort-list"
import { useTable } from "../use-table"
import { withSorting } from "../features"

type SortRow = {
  id: string
  name: string
  email: string
}

const sortTestData: SortRow[] = [
  { id: "1", name: "Ada", email: "ada@example.com" },
  { id: "2", name: "Grace", email: "grace@example.com" },
]

function createSortTestColumns(): ColumnDef<SortRow>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      meta: { label: "Name" },
    },
    {
      accessorKey: "email",
      header: "Email",
      meta: { label: "Email" },
    },
  ]
}

function SortTableHarness({
  children,
}: {
  children: (table: ReturnType<typeof useSortTestTable>) => React.ReactNode
}) {
  const table = useSortTestTable()
  return <>{children(table)}</>
}

function useSortTestTable() {
  return useTable({
    data: sortTestData,
    columns: createSortTestColumns(),
    features: [withSorting()],
    getRowId: (row) => row.id,
  })
}

describe("TableSortList", () => {
  it("renders the sort trigger", () => {
    render(
      <SortTableHarness>
        {(table) => <TableSortList table={table} />}
      </SortTableHarness>
    )

    expect(screen.getByRole("button", { name: "Sort" })).toBeInTheDocument()
  })

  it("opens with the first column already selected", async () => {
    const user = userEvent.setup()
    render(
      <SortTableHarness>
        {(table) => <TableSortList table={table} />}
      </SortTableHarness>
    )

    await user.click(screen.getByRole("button", { name: "Sort" }))

    expect(await screen.findByText("Sort by")).toBeInTheDocument()
    expect(screen.getByLabelText("Sort field Name")).toBeInTheDocument()
    expect(screen.getByLabelText("Remove Name sort")).toBeInTheDocument()
    expect(screen.getByLabelText("Reorder Name sort")).toBeInTheDocument()
    expect(screen.getByText("1")).toBeInTheDocument()
  })

  it("adds another sort rule from the popover", async () => {
    const user = userEvent.setup()
    render(
      <SortTableHarness>
        {(table) => <TableSortList table={table} />}
      </SortTableHarness>
    )

    await user.click(screen.getByRole("button", { name: "Sort" }))
    await user.click(screen.getByRole("button", { name: "Add sort" }))

    expect(screen.getByLabelText("Sort field Email")).toBeInTheDocument()
    expect(screen.getByText("2")).toBeInTheDocument()
  })

  it("shows the empty state after removing the last sort row", async () => {
    const user = userEvent.setup()
    render(
      <SortTableHarness>
        {(table) => <TableSortList table={table} />}
      </SortTableHarness>
    )

    await user.click(screen.getByRole("button", { name: "Sort" }))
    await user.click(screen.getByLabelText("Remove Name sort"))

    expect(await screen.findByText("No sorting applied")).toBeInTheDocument()
    expect(
      screen.getByText("Add sorting to organize your rows.")
    ).toBeInTheDocument()
    expect(screen.queryByText("1")).not.toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "Reset" })
    ).not.toBeInTheDocument()
  })

  it("resets sorting from the popover to the empty state", async () => {
    const user = userEvent.setup()
    render(
      <SortTableHarness>
        {(table) => <TableSortList table={table} />}
      </SortTableHarness>
    )

    await user.click(screen.getByRole("button", { name: "Sort" }))
    await user.click(screen.getByRole("button", { name: "Reset" }))

    expect(screen.queryByText("Sort by")).not.toBeInTheDocument()
    expect(screen.queryByText("No sorting applied")).not.toBeInTheDocument()
    expect(screen.queryByText("1")).not.toBeInTheDocument()
  })

  it("reapplies the first column when reopened after reset", async () => {
    const user = userEvent.setup()
    render(
      <SortTableHarness>
        {(table) => <TableSortList table={table} />}
      </SortTableHarness>
    )

    await user.click(screen.getByRole("button", { name: "Sort" }))
    await user.click(screen.getByRole("button", { name: "Reset" }))
    await user.click(screen.getByRole("button", { name: "Sort" }))

    expect(await screen.findByText("Sort by")).toBeInTheDocument()
    expect(screen.getByLabelText("Sort field Name")).toBeInTheDocument()
  })

  it("opens a searchable field picker from the column trigger", async () => {
    const user = userEvent.setup()
    render(
      <SortTableHarness>
        {(table) => <TableSortList table={table} />}
      </SortTableHarness>
    )

    await user.click(screen.getByRole("button", { name: "Sort" }))
    await user.click(screen.getByLabelText("Sort field Name"))

    expect(
      await screen.findByPlaceholderText("Search fields...")
    ).toBeInTheDocument()
    expect(screen.getByText("Email")).toBeInTheDocument()
    expect(
      screen.getByRole("option", { name: "Name" }).querySelector("svg")
    ).toBeInTheDocument()
  })

  it("matches any part of a column label, in any order, ignoring case", async () => {
    const user = userEvent.setup()
    const columns: ColumnDef<{
      id: string
      joinedAt: string
      estHours: string
      rnd: string
    }>[] = [
      { accessorKey: "joinedAt", header: "Joined", meta: { label: "Joined" } },
      {
        accessorKey: "estHours",
        header: "Est Hours Today",
        meta: { label: "Est Hours Today" },
      },
      { accessorKey: "rnd", header: "R&D", meta: { label: "R&D" } },
    ]

    function Harness() {
      const table = useTable({
        data: [{ id: "1", joinedAt: "2024", estHours: "4", rnd: "lab" }],
        columns,
        features: [withSorting()],
        getRowId: (row) => row.id,
      })
      return <TableSortList table={table} />
    }

    render(<Harness />)

    await user.click(screen.getByRole("button", { name: "Sort" }))
    await user.click(screen.getByLabelText("Sort field Joined"))
    const search = await screen.findByPlaceholderText("Search fields...")

    await user.type(search, "je")
    expect(screen.queryByRole("option", { name: "Joined" })).not.toBeInTheDocument()
    expect(screen.getByText("No fields found.")).toBeInTheDocument()

    await user.clear(search)
    await user.type(search, "oin")
    expect(screen.getByRole("option", { name: "Joined" })).toBeInTheDocument()

    await user.clear(search)
    await user.type(search, "JO")
    expect(screen.getByRole("option", { name: "Joined" })).toBeInTheDocument()

    await user.clear(search)
    await user.type(search, "today hours")
    expect(screen.getByRole("option", { name: "Est Hours Today" })).toBeInTheDocument()
    expect(screen.queryByRole("option", { name: "Joined" })).not.toBeInTheDocument()

    await user.clear(search)
    await user.type(search, "&")
    expect(screen.getByRole("option", { name: "R&D" })).toBeInTheDocument()
    expect(screen.queryByRole("option", { name: "Joined" })).not.toBeInTheDocument()
  })
})
