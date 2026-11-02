import React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { TableRatingFilter } from "./rating-filter"
import { useTable } from "../use-table"
import { withFiltering } from "../features"

type ReviewRow = { id: string; name: string; rating: number }

const reviewData: ReviewRow[] = [
  { id: "1", name: "Ada", rating: 5 },
  { id: "2", name: "Grace", rating: 4 },
  { id: "3", name: "Alan", rating: 2 },
]

const reviewColumns: ColumnDef<ReviewRow>[] = [
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "rating",
    header: "Rating",
    enableColumnFilter: true,
    meta: { label: "Rating", variant: "rating" },
  },
]

function RatingFilterHarness({
  children,
}: {
  children: (table: ReturnType<typeof useTable<ReviewRow>>) => React.ReactNode
}) {
  const table = useTable({
    data: reviewData,
    columns: reviewColumns,
    features: [withFiltering()],
    getRowId: (row) => row.id,
  })
  return <>{children(table)}</>
}

describe("TableRatingFilter", () => {
  it("renders the rating trigger with empty stars", () => {
    render(
      <RatingFilterHarness>
        {(table) => {
          const column = table.getColumn("rating")
          if (!column) return null
          return <TableRatingFilter column={column} title="Rating" />
        }}
      </RatingFilterHarness>
    )

    expect(screen.getByRole("button", { name: /Rating/i })).toBeInTheDocument()
    expect(screen.getByLabelText("Minimum rating filter")).toHaveAttribute(
      "aria-valuenow",
      "0"
    )
  })

  it("filters to ratings at or above the picked star", async () => {
    const user = userEvent.setup()
    render(
      <RatingFilterHarness>
        {(table) => {
          const column = table.getColumn("rating")
          if (!column) return null
          return (
            <>
              <TableRatingFilter column={column} title="Rating" />
              <div data-testid="rows">
                {table.getRowModel().rows.map((row) => (
                  <div key={row.id}>{row.original.name}</div>
                ))}
              </div>
            </>
          )
        }}
      </RatingFilterHarness>
    )

    await user.click(screen.getByLabelText("At least 4 stars"))

    expect(screen.getByTestId("rows")).toHaveTextContent("Ada")
    expect(screen.getByTestId("rows")).toHaveTextContent("Grace")
    expect(screen.queryByTestId("rows")).not.toHaveTextContent("Alan")
    expect(screen.getByLabelText("Clear Rating filter")).toBeInTheDocument()
  })

  it("clears the min rating from the X icon", async () => {
    const user = userEvent.setup()
    render(
      <RatingFilterHarness>
        {(table) => {
          const column = table.getColumn("rating")
          if (!column) return null
          return (
            <>
              <TableRatingFilter column={column} title="Rating" />
              <div data-testid="rows">
                {table.getRowModel().rows.map((row) => (
                  <div key={row.id}>{row.original.name}</div>
                ))}
              </div>
            </>
          )
        }}
      </RatingFilterHarness>
    )

    await user.click(screen.getByLabelText("At least 4 stars"))
    await user.click(screen.getByLabelText("Clear Rating filter"))

    expect(screen.getByTestId("rows")).toHaveTextContent("Alan")
    expect(screen.queryByLabelText("Clear Rating filter")).not.toBeInTheDocument()
  })

  it("fills stars up to the hovered star", async () => {
    const user = userEvent.setup()
    render(
      <RatingFilterHarness>
        {(table) => {
          const column = table.getColumn("rating")
          if (!column) return null
          return <TableRatingFilter column={column} title="Rating" />
        }}
      </RatingFilterHarness>
    )

    await user.hover(screen.getByLabelText("At least 3 stars"))

    const row = screen.getByLabelText("Minimum rating filter")
    expect(row.querySelectorAll("[data-filled]")).toHaveLength(3)
  })
})
