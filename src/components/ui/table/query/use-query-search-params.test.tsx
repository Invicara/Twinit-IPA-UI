import { act, renderHook } from "@testing-library/react"
import {
  useTableQuerySearchParams,
  formatTableQueryParamsDebug,
} from "./use-query-search-params"

describe("useTableQuerySearchParams", () => {
  const originalLocation = window.location
  const replaceState = jest.fn()
  const pushState = jest.fn()

  beforeEach(() => {
    replaceState.mockClear()
    pushState.mockClear()
    Object.defineProperty(window, "history", {
      configurable: true,
      value: {
        ...window.history,
        replaceState,
        pushState,
      },
    })
  })

  afterEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    })
  })

  it("hydrates from a search string", () => {
    const { result } = renderHook(() =>
      useTableQuerySearchParams({
        syncUrl: false,
        search: "?page=3&pageSize=20&q=pump",
        initialState: { pageSize: 10 },
      })
    )

    expect(result.current.params).toMatchObject({
      page: 3,
      pageSize: 20,
      globalFilter: "pump",
    })
    expect(result.current.exampleUrl).toContain("page=3")
    expect(result.current.exampleUrl).toContain("q=pump")
  })

  it("writes to history.replaceState when params change", () => {
    const { result } = renderHook(() =>
      useTableQuerySearchParams({
        syncUrl: true,
        history: "replace",
        initialState: { pageSize: 5 },
      })
    )

    act(() => {
      result.current.onPaginationChange({ pageIndex: 2, pageSize: 5 })
    })

    expect(replaceState).toHaveBeenCalled()
    const url = String(replaceState.mock.calls.at(-1)?.[2] ?? "")
    expect(url).toContain("page=3")
  })

  it("formatTableQueryParamsDebug pretty-prints params", () => {
    const text = formatTableQueryParamsDebug({
      page: 1,
      pageSize: 10,
      sorting: [],
      filters: [],
      joinOperator: "and",
    })
    expect(text).toContain('"page": 1')
  })
})
