import React from "react"
import { act, renderHook } from "@testing-library/react"
import {
  TABLE_QUERY_STATE_DEFAULT_DEBOUNCE_MS,
  useTableQueryState,
} from "./use-query-state"

describe("useTableQueryState", () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("exposes defaults and TanStack state with 0-based pageIndex", () => {
    const { result } = renderHook(() => useTableQueryState())

    expect(result.current.params).toEqual({
      page: 1,
      pageSize: 10,
      sorting: [],
      filters: [],
      joinOperator: "and",
    })
    expect(result.current.state.pagination).toEqual({
      pageIndex: 0,
      pageSize: 10,
    })
  })

  it("respects initialState", () => {
    const { result } = renderHook(() =>
      useTableQueryState({
        initialState: {
          page: 3,
          pageSize: 20,
          sorting: [{ id: "name", desc: true }],
          globalFilter: "ada",
        },
      })
    )

    expect(result.current.params.page).toBe(3)
    expect(result.current.params.pageSize).toBe(20)
    expect(result.current.params.sorting).toEqual([{ id: "name", desc: true }])
    expect(result.current.params.globalFilter).toBe("ada")
    expect(result.current.state.pagination.pageIndex).toBe(2)
    expect(result.current.state.globalFilter).toBe("ada")
  })

  it("updates pagination and maps pageIndex to 1-based page", () => {
    const { result } = renderHook(() => useTableQueryState())

    act(() => {
      result.current.onPaginationChange({ pageIndex: 2, pageSize: 10 })
    })

    expect(result.current.params.page).toBe(3)
    expect(result.current.state.pagination.pageIndex).toBe(2)
  })

  it("resets to page 1 when pageSize changes", () => {
    const { result } = renderHook(() =>
      useTableQueryState({ initialState: { page: 4, pageSize: 10 } })
    )

    act(() => {
      result.current.onPaginationChange({ pageIndex: 3, pageSize: 25 })
    })

    expect(result.current.params).toMatchObject({ page: 1, pageSize: 25 })
    expect(result.current.state.pagination).toEqual({
      pageIndex: 0,
      pageSize: 25,
    })
  })

  it("resets to page 1 when sorting changes", () => {
    const { result } = renderHook(() =>
      useTableQueryState({ initialState: { page: 5 } })
    )

    act(() => {
      result.current.onSortingChange([{ id: "name", desc: false }])
    })

    expect(result.current.params.page).toBe(1)
    expect(result.current.params.sorting).toEqual([{ id: "name", desc: false }])
  })

  it("applies array filters immediately and resets page", () => {
    const { result } = renderHook(() =>
      useTableQueryState({ initialState: { page: 3 } })
    )

    act(() => {
      result.current.onColumnFiltersChange([
        { id: "status", value: ["active", "draft"] },
      ])
    })

    expect(result.current.params.page).toBe(1)
    expect(result.current.params.filters).toEqual([
      {
        id: "status",
        operator: "inArray",
        value: ["active", "draft"],
        variant: "multiSelect",
        filterId: "status-inArray",
      },
    ])
    expect(result.current.state.columnFilters).toHaveLength(1)
  })

  it("debounces global filter commits", () => {
    const { result } = renderHook(() =>
      useTableQueryState({ initialState: { page: 2 } })
    )

    act(() => {
      result.current.onGlobalFilterChange("boil")
    })

    expect(result.current.state.globalFilter).toBe("boil")
    expect(result.current.params.globalFilter).toBeUndefined()
    expect(result.current.params.page).toBe(2)

    act(() => {
      jest.advanceTimersByTime(TABLE_QUERY_STATE_DEFAULT_DEBOUNCE_MS)
    })

    expect(result.current.params.globalFilter).toBe("boil")
    expect(result.current.params.page).toBe(1)
  })

  it("debounces string column filters", () => {
    const { result } = renderHook(() => useTableQueryState())

    act(() => {
      result.current.onColumnFiltersChange([{ id: "name", value: "ada" }])
    })

    expect(result.current.state.columnFilters).toEqual([
      { id: "name", value: "ada" },
    ])
    expect(result.current.params.filters).toEqual([])

    act(() => {
      jest.advanceTimersByTime(TABLE_QUERY_STATE_DEFAULT_DEBOUNCE_MS)
    })

    expect(result.current.params.filters).toEqual([
      {
        id: "name",
        operator: "iLike",
        value: "ada",
        variant: "text",
        filterId: "name-iLike",
      },
    ])
  })

  it("resetFilters clears filters and global search", () => {
    const { result } = renderHook(() =>
      useTableQueryState({
        initialState: {
          page: 3,
          sorting: [{ id: "name", desc: false }],
          filters: [
            {
              id: "status",
              operator: "eq",
              value: "active",
              variant: "select",
              filterId: "a",
            },
          ],
          globalFilter: "x",
        },
      })
    )

    act(() => {
      result.current.resetFilters()
    })

    expect(result.current.params).toEqual({
      page: 1,
      pageSize: 10,
      sorting: [{ id: "name", desc: false }],
      filters: [],
      joinOperator: "and",
    })
  })

  it("resetAll restores the initial snapshot", () => {
    const { result } = renderHook(() =>
      useTableQueryState({
        initialState: {
          page: 2,
          pageSize: 20,
          sorting: [{ id: "name", desc: true }],
        },
      })
    )

    act(() => {
      result.current.onPaginationChange({ pageIndex: 4, pageSize: 20 })
      result.current.onSortingChange([])
    })

    act(() => {
      result.current.resetAll()
    })

    expect(result.current.params).toEqual({
      page: 2,
      pageSize: 20,
      sorting: [{ id: "name", desc: true }],
      filters: [],
      joinOperator: "and",
    })
  })

  it("setJoinOperator resets page", () => {
    const { result } = renderHook(() =>
      useTableQueryState({ initialState: { page: 4 } })
    )

    act(() => {
      result.current.setJoinOperator("or")
    })

    expect(result.current.params).toMatchObject({
      page: 1,
      joinOperator: "or",
    })
  })
})
