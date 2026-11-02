import { queryTableRows } from "./query-mock"
import type { TableQueryParams } from "./query.types"

const rows = [
  { id: "1", name: "Ada", role: "Engineer" },
  { id: "2", name: "Grace", role: "Engineer" },
  { id: "3", name: "Alan", role: "Researcher" },
]

const baseParams: TableQueryParams = {
  page: 1,
  pageSize: 2,
  sorting: [],
  filters: [],
  joinOperator: "and",
}

describe("queryTableRows", () => {
  it("filters, sorts, and paginates", async () => {
    const result = await queryTableRows(rows, {
      ...baseParams,
      sorting: [{ id: "name", desc: true }],
      filters: [
        {
          id: "role",
          operator: "eq",
          value: "Engineer",
          variant: "select",
          filterId: "role-eq",
        },
      ],
    })

    expect(result.rowCount).toBe(2)
    expect(result.pageCount).toBe(1)
    expect(result.rows.map((row) => row.name)).toEqual(["Grace", "Ada"])
  })

  it("applies delay when requested", async () => {
    jest.useFakeTimers()
    const promise = queryTableRows(rows, baseParams, { delayMs: 200 })
    jest.advanceTimersByTime(200)
    const result = await promise
    expect(result.rows).toHaveLength(2)
    jest.useRealTimers()
  })
})
