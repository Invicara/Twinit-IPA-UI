import type { TableQueryParams, TableQueryResult } from "./query.types"

function matchesFilter(
  cell: unknown,
  operator: TableQueryParams["filters"][number]["operator"],
  value: TableQueryParams["filters"][number]["value"]
): boolean {
  const asString = cell == null ? "" : String(cell)

  switch (operator) {
    case "iLike":
      return asString.toLowerCase().includes(String(value ?? "").toLowerCase())
    case "notILike":
      return !asString.toLowerCase().includes(String(value ?? "").toLowerCase())
    case "eq": {
      // Date equality: match calendar day for timestamp cells/values.
      if (typeof cell === "number") {
        const filterTs =
          typeof value === "number"
            ? value
            : typeof value === "string" && /^-?\d{11,}$/.test(value)
              ? Number(value)
              : Number.NaN
        if (!Number.isNaN(filterTs)) {
          const dayStart = new Date(filterTs)
          dayStart.setHours(0, 0, 0, 0)
          const dayEnd = new Date(filterTs)
          dayEnd.setHours(23, 59, 59, 999)
          return cell >= dayStart.getTime() && cell <= dayEnd.getTime()
        }
      }
      return asString === String(value)
    }
    case "ne":
      return asString !== String(value)
    case "inArray":
      return Array.isArray(value) && value.map(String).includes(asString)
    case "notInArray":
      return Array.isArray(value) && !value.map(String).includes(asString)
    case "isEmpty":
      return asString.length === 0
    case "isNotEmpty":
      return asString.length > 0
    case "lt":
      return Number(cell) < Number(value)
    case "lte":
      return Number(cell) <= Number(value)
    case "gt":
      return Number(cell) > Number(value)
    case "gte":
      return Number(cell) >= Number(value)
    case "isBetween": {
      if (!Array.isArray(value) || value.length < 2) return true
      const cellNum = Number(cell)
      const min = Number(value[0])
      const max = Number(value[1])
      return cellNum >= min && cellNum <= max
    }
    default:
      return true
  }
}

/**
 * In-memory list query for Storybook / tests. Applies filter → sort → page.
 */
export async function queryTableRows<TData>(
  allRows: TData[],
  params: TableQueryParams,
  options: {
    delayMs?: number
    getCell?: (row: TData, columnId: string) => unknown
  } = {}
): Promise<TableQueryResult<TData>> {
  const {
    delayMs = 0,
    getCell = (row, id) => (row as Record<string, unknown>)[id],
  } = options

  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }

  let rows = [...allRows]

  const global = params.globalFilter?.trim().toLowerCase()
  if (global) {
    rows = rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(global)
      )
    )
  }

  for (const filter of params.filters) {
    rows = rows.filter((row) =>
      matchesFilter(getCell(row, filter.id), filter.operator, filter.value)
    )
  }

  for (const sort of [...params.sorting].reverse()) {
    rows.sort((left, right) => {
      const a = getCell(left, sort.id)
      const b = getCell(right, sort.id)
      if (a == null && b == null) return 0
      if (a == null) return sort.desc ? 1 : -1
      if (b == null) return sort.desc ? -1 : 1
      if (typeof a === "number" && typeof b === "number") {
        return sort.desc ? b - a : a - b
      }
      const cmp = String(a).localeCompare(String(b), undefined, {
        sensitivity: "base",
        numeric: true,
      })
      return sort.desc ? -cmp : cmp
    })
  }

  const rowCount = rows.length
  const pageSize = Math.max(1, params.pageSize)
  const pageCount = Math.max(1, Math.ceil(rowCount / pageSize))
  const page = Math.min(Math.max(1, params.page), pageCount)
  const start = (page - 1) * pageSize

  return {
    rows: rows.slice(start, start + pageSize),
    pageCount,
    rowCount,
  }
}
