import {
  TABLE_QUERY_DEFAULT_JOIN_OPERATOR,
  TABLE_QUERY_DEFAULT_PAGE,
  TABLE_QUERY_DEFAULT_PAGE_SIZE,
} from "./config"
import {
  formatTableQueryExampleUrl,
  fromTanStackState,
  parseTableQuery,
  parseTableQueryString,
  serializeTableQuery,
  serializeTableQueryString,
  toTanStackState,
} from "./query"
import type { TableQueryParams } from "./query.types"

const sampleParams: TableQueryParams = {
  page: 2,
  pageSize: 20,
  sorting: [{ id: "name", desc: false }],
  filters: [
    {
      id: "status",
      operator: "inArray",
      value: ["active", "draft"],
      variant: "multiSelect",
      filterId: "status-1",
    },
  ],
  joinOperator: "and",
  globalFilter: "boiler",
}

describe("parseTableQuery / serializeTableQuery", () => {
  it("round-trips a full query through URLSearchParams", () => {
    const serialized = serializeTableQuery(sampleParams, {
      clearOnDefault: false,
      filterUrlStyle: "json",
    })
    const parsed = parseTableQuery(serialized, { filterUrlStyle: "json" })

    expect(parsed).toEqual(sampleParams)
  })

  it("round-trips through query string helpers", () => {
    const queryString = serializeTableQueryString(sampleParams, {
      clearOnDefault: false,
      filterUrlStyle: "json",
    })
    expect(
      parseTableQueryString(queryString, { filterUrlStyle: "json" })
    ).toEqual(sampleParams)
    expect(
      parseTableQueryString(`?${queryString}`, { filterUrlStyle: "json" })
    ).toEqual(sampleParams)
  })

  it("applies defaults when params are missing", () => {
    expect(parseTableQuery(new URLSearchParams())).toEqual({
      page: TABLE_QUERY_DEFAULT_PAGE,
      pageSize: TABLE_QUERY_DEFAULT_PAGE_SIZE,
      sorting: [],
      filters: [],
      joinOperator: TABLE_QUERY_DEFAULT_JOIN_OPERATOR,
    })
  })

  it("omits default values when clearOnDefault is true", () => {
    const serialized = serializeTableQuery({
      page: TABLE_QUERY_DEFAULT_PAGE,
      pageSize: TABLE_QUERY_DEFAULT_PAGE_SIZE,
      sorting: [],
      filters: [],
      joinOperator: TABLE_QUERY_DEFAULT_JOIN_OPERATOR,
    })

    expect(serialized.toString()).toBe("")
  })

  it("keeps non-default pagination keys", () => {
    const serialized = serializeTableQuery({
      page: 3,
      pageSize: 50,
      sorting: [],
      filters: [],
      joinOperator: "and",
    })

    expect(serialized.get("page")).toBe("3")
    expect(serialized.get("pageSize")).toBe("50")
    expect(serialized.get("sort")).toBeNull()
    expect(serialized.get("filters")).toBeNull()
  })

  it("falls back on invalid page / pageSize", () => {
    const params = new URLSearchParams({
      page: "0",
      pageSize: "-5",
    })

    expect(parseTableQuery(params)).toMatchObject({
      page: TABLE_QUERY_DEFAULT_PAGE,
      pageSize: TABLE_QUERY_DEFAULT_PAGE_SIZE,
    })
  })

  it("drops invalid sort JSON and keeps defaults", () => {
    const params = new URLSearchParams({
      sort: "{not-json",
    })

    expect(parseTableQuery(params).sorting).toEqual([])
  })

  it("drops invalid filter JSON", () => {
    const params = new URLSearchParams({
      filters: '"not-an-array"',
    })

    expect(parseTableQuery(params).filters).toEqual([])
  })

  it("strips sort/filter entries for unknown column ids", () => {
    const params = new URLSearchParams({
      sort: JSON.stringify([
        { id: "name", desc: true },
        { id: "secret", desc: false },
      ]),
      filters: JSON.stringify([
        {
          id: "status",
          operator: "eq",
          value: "active",
          variant: "select",
          filterId: "a",
        },
        {
          id: "hidden",
          operator: "eq",
          value: "x",
          variant: "text",
          filterId: "b",
        },
      ]),
    })

    const parsed = parseTableQuery(params, {
      columnIds: ["name", "status"],
      filterUrlStyle: "json",
    })

    expect(parsed.sorting).toEqual([{ id: "name", desc: true }])
    expect(parsed.filters).toEqual([
      {
        id: "status",
        operator: "eq",
        value: "active",
        variant: "select",
        filterId: "a",
      },
    ])
  })

  it("drops filter items with unknown operators or variants", () => {
    const params = new URLSearchParams({
      filters: JSON.stringify([
        {
          id: "name",
          operator: "contains",
          value: "x",
          variant: "text",
          filterId: "a",
        },
        {
          id: "name",
          operator: "eq",
          value: "x",
          variant: "mystery",
          filterId: "b",
        },
      ]),
    })

    expect(
      parseTableQuery(params, { filterUrlStyle: "json" }).filters
    ).toEqual([])
  })

  it("supports custom query key names", () => {
    const serialized = serializeTableQuery(sampleParams, {
      clearOnDefault: false,
      filterUrlStyle: "json",
      queryKeys: {
        page: "p",
        pageSize: "ps",
        sort: "s",
        filters: "f",
        joinOperator: "j",
        globalFilter: "search",
      },
    })

    expect(serialized.get("p")).toBe("2")
    expect(serialized.get("ps")).toBe("20")
    expect(serialized.get("search")).toBe("boiler")
    expect(serialized.get("page")).toBeNull()

    const parsed = parseTableQuery(serialized, {
      queryKeys: {
        page: "p",
        pageSize: "ps",
        sort: "s",
        filters: "f",
        joinOperator: "j",
        globalFilter: "search",
      },
      filterUrlStyle: "json",
    })

    expect(parsed).toEqual(sampleParams)
  })

  it("accepts a plain record as well as URLSearchParams", () => {
    expect(
      parseTableQuery({
        page: "4",
        pageSize: "15",
        q: "pump",
      })
    ).toMatchObject({
      page: 4,
      pageSize: 15,
      globalFilter: "pump",
    })
  })

  it("synthesizes filterId when missing", () => {
    const params = new URLSearchParams({
      filters: JSON.stringify([
        {
          id: "name",
          operator: "iLike",
          value: "ada",
          variant: "text",
        },
      ]),
    })

    expect(
      parseTableQuery(params, { filterUrlStyle: "json" }).filters[0]?.filterId
    ).toBe("name-iLike")
  })

  it("uses flat column keys by default (tablecn-style)", () => {
    const serialized = serializeTableQuery({
      page: 1,
      pageSize: 10,
      sorting: [{ id: "name", desc: false }],
      filters: [
        {
          id: "role",
          operator: "inArray",
          value: ["Engineer", "Researcher"],
          variant: "multiSelect",
          filterId: "role-inArray",
        },
        {
          id: "name",
          operator: "iLike",
          value: "ada",
          variant: "text",
          filterId: "name-iLike",
        },
      ],
      joinOperator: "and",
    })

    expect(serialized.get("role")).toBe("Engineer,Researcher")
    expect(serialized.get("name")).toBe("ada")
    expect(serialized.get("filters")).toBeNull()
    expect(serialized.get("sort")).toContain("name")

    const parsed = parseTableQuery(serialized)
    expect(parsed.filters).toEqual([
      {
        id: "role",
        operator: "inArray",
        value: ["Engineer", "Researcher"],
        variant: "multiSelect",
        filterId: "role-inArray",
      },
      {
        id: "name",
        operator: "iLike",
        value: "ada",
        variant: "text",
        filterId: "name-iLike",
      },
    ])
  })

  it("serializes ordered multi-column sort into sort JSON", () => {
    const serialized = serializeTableQuery({
      page: 1,
      pageSize: 10,
      sorting: [
        { id: "role", desc: false },
        { id: "name", desc: true },
      ],
      filters: [],
      joinOperator: "and",
    })

    expect(JSON.parse(serialized.get("sort")!)).toEqual([
      { id: "role", desc: false },
      { id: "name", desc: true },
    ])
    expect(parseTableQuery(serialized).sorting).toEqual([
      { id: "role", desc: false },
      { id: "name", desc: true },
    ])
  })

  it("flattens date and date-range filters like tablecn", () => {
    const serialized = serializeTableQuery({
      page: 1,
      pageSize: 10,
      sorting: [],
      filters: [
        {
          id: "joinedAt",
          operator: "eq",
          value: "1843238400000",
          variant: "date",
          filterId: "joinedAt-eq",
        },
        {
          id: "createdAt",
          operator: "isBetween",
          value: ["1783983600000", "1784070000000"],
          variant: "dateRange",
          filterId: "createdAt-isBetween",
        },
      ],
      joinOperator: "and",
    })

    expect(serialized.get("joinedAt")).toBe("1843238400000")
    expect(serialized.get("createdAt")).toBe("1783983600000,1784070000000")
    expect(serialized.get("filters")).toBeNull()

    expect(parseTableQuery(serialized).filters).toEqual([
      {
        id: "joinedAt",
        operator: "eq",
        value: "1843238400000",
        variant: "date",
        filterId: "joinedAt-eq",
      },
      {
        id: "createdAt",
        operator: "isBetween",
        value: ["1783983600000", "1784070000000"],
        variant: "dateRange",
        filterId: "createdAt-isBetween",
      },
    ])
  })

  it("formats example URLs with + for spaces", () => {
    const url = formatTableQueryExampleUrl(
      {
        page: 1,
        pageSize: 10,
        sorting: [],
        filters: [
          {
            id: "name",
            operator: "iLike",
            value: "ada lovelace",
            variant: "text",
            filterId: "name-iLike",
          },
        ],
        joinOperator: "and",
        globalFilter: "hello world",
      },
      { encoded: false }
    )

    expect(url).toContain("name=ada+lovelace")
    expect(url).toContain("q=hello+world")
    expect(url).not.toMatch(/name=ada lovelace/)
  })
})

describe("toTanStackState / fromTanStackState", () => {
  it("maps 1-based page to 0-based pageIndex and back", () => {
    const state = toTanStackState(sampleParams)

    expect(state.pagination).toEqual({ pageIndex: 1, pageSize: 20 })
    expect(state.sorting).toEqual([{ id: "name", desc: false }])
    expect(state.globalFilter).toBe("boiler")
    expect(state.columnFilters).toEqual([
      {
        id: "status",
        value: ["active", "draft"],
      },
    ])

    const roundTrip = fromTanStackState({
      pagination: state.pagination,
      sorting: state.sorting,
      columnFilters: state.columnFilters,
      globalFilter: state.globalFilter,
      previousFilters: sampleParams.filters,
      joinOperator: sampleParams.joinOperator,
    })

    expect(roundTrip).toEqual(sampleParams)
  })

  it("coerces plain column filter values when advanced filter objects are absent", () => {
    const params = fromTanStackState({
      pagination: { pageIndex: 0, pageSize: 10 },
      sorting: [],
      columnFilters: [
        { id: "status", value: ["active", "draft"] },
        { id: "name", value: "ada" },
      ],
      globalFilter: "",
    })

    expect(params.filters).toEqual([
      {
        id: "status",
        operator: "inArray",
        value: ["active", "draft"],
        variant: "multiSelect",
        filterId: "status-inArray",
      },
      {
        id: "name",
        operator: "iLike",
        value: "ada",
        variant: "text",
        filterId: "name-iLike",
      },
    ])
  })
})
