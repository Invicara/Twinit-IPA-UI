import type {
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table"

import {
  TABLE_QUERY_DEFAULT_JOIN_OPERATOR,
  TABLE_QUERY_DEFAULT_PAGE,
  TABLE_QUERY_DEFAULT_PAGE_SIZE,
  tableConfig,
  tableQueryKeys,
} from "./config"
import type {
  TableFilterOperator,
  TableJoinOperator,
  TableQueryFilter,
  TableQueryFilterValue,
  TableQueryFilterVariant,
  TableQueryKeys,
  TableQueryParams,
  TableQueryParseOptions,
  TableQuerySerializeOptions,
  TableQuerySort,
  TableQueryTanStackState,
} from "./query.types"

const FILTER_VARIANTS = new Set<string>(tableConfig.filterVariants)
const FILTER_OPERATORS = new Set<string>(tableConfig.operators)
const JOIN_OPERATORS = new Set<string>(tableConfig.joinOperators)

/** Default operator used when flattening a filter to `columnId=value` (tablecn-style). */
const FLAT_DEFAULT_OPERATOR: Record<
  TableQueryFilterVariant,
  TableFilterOperator
> = {
  text: "iLike",
  number: "eq",
  range: "isBetween",
  // `gte` is the runtime operator; keep default `eq` so `rating=4` is not
  // flattened (flat parse would infer `iLike` and drop min-star semantics).
  rating: "eq",
  date: "eq",
  dateRange: "isBetween",
  boolean: "eq",
  checkbox: "eq",
  select: "eq",
  multiSelect: "inArray",
}

function resolveQueryKeys(
  overrides?: Partial<TableQueryKeys>
): TableQueryKeys {
  return {
    page: overrides?.page ?? tableQueryKeys.page,
    pageSize: overrides?.pageSize ?? tableQueryKeys.pageSize,
    sort: overrides?.sort ?? tableQueryKeys.sort,
    filters: overrides?.filters ?? tableQueryKeys.filters,
    joinOperator: overrides?.joinOperator ?? tableQueryKeys.joinOperator,
    globalFilter: overrides?.globalFilter ?? tableQueryKeys.globalFilter,
  }
}

function reservedQueryKeySet(keys: TableQueryKeys): Set<string> {
  return new Set(Object.values(keys))
}

function canFlattenFilter(filter: TableQueryFilter): boolean {
  return filter.operator === FLAT_DEFAULT_OPERATOR[filter.variant]
}

function flattenFilterValue(value: TableQueryFilterValue): string {
  if (value === null || value === undefined) return ""
  if (Array.isArray(value)) return value.map(String).join(",")
  if (typeof value === "boolean") return value ? "true" : "false"
  return String(value)
}

function inferFlatFilter(
  id: string,
  raw: string,
  validKeys: Set<string> | null
): TableQueryFilter | null {
  if (validKeys && !validKeys.has(id)) return null
  if (raw === "") {
    return {
      id,
      operator: "isEmpty",
      value: null,
      variant: "text",
      filterId: `${id}-isEmpty`,
    }
  }

  if (raw.includes(",")) {
    const parts = raw.split(",").filter((part) => part.length > 0)
    if (parts.length === 2 && parts.every((part) => /^\d+$/.test(part))) {
      return {
        id,
        operator: "isBetween",
        value: [parts[0]!, parts[1]!],
        variant: "dateRange",
        filterId: `${id}-isBetween`,
      }
    }
    return {
      id,
      operator: "inArray",
      value: parts,
      variant: "multiSelect",
      filterId: `${id}-inArray`,
    }
  }

  if (/^-?\d{11,}$/.test(raw)) {
    return {
      id,
      operator: "eq",
      value: raw,
      variant: "date",
      filterId: `${id}-eq`,
    }
  }

  if (raw === "true" || raw === "false") {
    return {
      id,
      operator: "eq",
      value: raw === "true",
      variant: "boolean",
      filterId: `${id}-eq`,
    }
  }

  return {
    id,
    operator: "iLike",
    value: raw,
    variant: "text",
    filterId: `${id}-iLike`,
  }
}

function toColumnIdSet(
  columnIds?: ReadonlySet<string> | readonly string[]
): Set<string> | null {
  if (!columnIds) return null
  return columnIds instanceof Set ? columnIds : new Set(columnIds)
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isFilterVariant(value: unknown): value is TableQueryFilterVariant {
  return typeof value === "string" && FILTER_VARIANTS.has(value)
}

function isFilterOperator(value: unknown): value is TableFilterOperator {
  return typeof value === "string" && FILTER_OPERATORS.has(value)
}

function isJoinOperator(value: unknown): value is TableJoinOperator {
  return typeof value === "string" && JOIN_OPERATORS.has(value)
}

function isFilterValue(value: unknown): value is TableQueryFilterValue {
  if (value === null) return true
  if (typeof value === "string" || typeof value === "boolean") return true
  if (!Array.isArray(value)) return false
  if (value.length === 2 && value.every((item) => typeof item === "string")) {
    return true
  }
  return value.every((item) => typeof item === "string")
}

function parsePositiveInt(value: string | null, fallback: number): number {
  if (value === null || value === "") return fallback
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed < 1) return fallback
  return parsed
}

function parseJsonArray(value: string | null): unknown[] | null {
  if (value === null || value === "") return null
  try {
    const parsed: unknown = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

function parseSortItem(
  item: unknown,
  validKeys: Set<string> | null
): TableQuerySort | null {
  if (!isPlainObject(item)) return null
  const { id, desc } = item
  if (typeof id !== "string" || id.length === 0) return null
  if (typeof desc !== "boolean") return null
  if (validKeys && !validKeys.has(id)) return null
  return { id, desc }
}

function parseFilterItem(
  item: unknown,
  validKeys: Set<string> | null
): TableQueryFilter | null {
  if (!isPlainObject(item)) return null

  const { id, operator, value, variant, filterId } = item
  if (typeof id !== "string" || id.length === 0) return null
  if (!isFilterOperator(operator)) return null
  if (!isFilterVariant(variant)) return null
  if (!isFilterValue(value)) return null
  if (validKeys && !validKeys.has(id)) return null

  const resolvedFilterId =
    typeof filterId === "string" && filterId.length > 0
      ? filterId
      : `${id}-${operator}`

  return {
    id,
    operator,
    value,
    variant,
    filterId: resolvedFilterId,
  }
}

function resolveDefaults(
  overrides?: Partial<TableQueryParams>
): TableQueryParams {
  return {
    page: overrides?.page ?? TABLE_QUERY_DEFAULT_PAGE,
    pageSize: overrides?.pageSize ?? TABLE_QUERY_DEFAULT_PAGE_SIZE,
    sorting: overrides?.sorting ?? [],
    filters: overrides?.filters ?? [],
    joinOperator: overrides?.joinOperator ?? TABLE_QUERY_DEFAULT_JOIN_OPERATOR,
    globalFilter: overrides?.globalFilter,
  }
}

function sortingEquals(a: TableQuerySort[], b: TableQuerySort[]): boolean {
  return (
    a.length === b.length &&
    a.every(
      (item, index) =>
        item.id === b[index]?.id && item.desc === b[index]?.desc
    )
  )
}

function filterValueEquals(
  a: TableQueryFilterValue,
  b: TableQueryFilterValue
): boolean {
  if (a === b) return true
  if (!Array.isArray(a) || !Array.isArray(b)) return false
  return a.length === b.length && a.every((item, index) => item === b[index])
}

function filtersEquals(a: TableQueryFilter[], b: TableQueryFilter[]): boolean {
  return (
    a.length === b.length &&
    a.every((filter, index) => {
      const other = b[index]
      return (
        other !== undefined &&
        filter.id === other.id &&
        filter.operator === other.operator &&
        filter.variant === other.variant &&
        filter.filterId === other.filterId &&
        filterValueEquals(filter.value, other.value)
      )
    })
  )
}

/**
 * Parse table query params from a `URLSearchParams` (or compatible) source.
 * Invalid JSON / unknown columns are dropped; missing keys use defaults.
 */
export function parseTableQuery(
  searchParams: URLSearchParams | Record<string, string | undefined | null>,
  options: TableQueryParseOptions = {}
): TableQueryParams {
  const keys = resolveQueryKeys(options.queryKeys)
  const defaults = resolveDefaults(options.defaults)
  const validKeys = toColumnIdSet(options.columnIds)
  const filterUrlStyle = options.filterUrlStyle ?? "flat"
  const reserved = reservedQueryKeySet(keys)

  const get = (key: string): string | null => {
    if (searchParams instanceof URLSearchParams) {
      return searchParams.get(key)
    }
    const value = searchParams[key]
    return value === undefined || value === null ? null : value
  }

  const entries = (): Array<[string, string]> => {
    if (searchParams instanceof URLSearchParams) {
      return Array.from(searchParams.entries())
    }
    return Object.entries(searchParams).flatMap(([key, value]) =>
      value === undefined || value === null ? [] : [[key, value]]
    )
  }

  const sortingRaw = parseJsonArray(get(keys.sort))
  const sorting =
    sortingRaw === null
      ? [...defaults.sorting]
      : sortingRaw
          .map((item) => parseSortItem(item, validKeys))
          .filter((item): item is TableQuerySort => item !== null)

  const filtersRaw = parseJsonArray(get(keys.filters))
  const jsonFilters =
    filtersRaw === null
      ? []
      : filtersRaw
          .map((item) => parseFilterItem(item, validKeys))
          .filter((item): item is TableQueryFilter => item !== null)

  let filters = jsonFilters.length > 0 ? jsonFilters : [...defaults.filters]

  if (filterUrlStyle === "flat") {
    const flatFilters: TableQueryFilter[] = []
    for (const [key, value] of entries()) {
      if (reserved.has(key)) continue
      const inferred = inferFlatFilter(key, value, validKeys)
      if (inferred) flatFilters.push(inferred)
    }
    if (flatFilters.length > 0) {
      // Flat keys win per column id; keep advanced JSON rows for other columns.
      const flatIds = new Set(flatFilters.map((filter) => filter.id))
      filters = [
        ...flatFilters,
        ...jsonFilters.filter((filter) => !flatIds.has(filter.id)),
      ]
    } else if (jsonFilters.length === 0) {
      filters = [...defaults.filters]
    }
  }

  const joinRaw = get(keys.joinOperator)
  const joinOperator = isJoinOperator(joinRaw)
    ? joinRaw
    : defaults.joinOperator

  const globalRaw = get(keys.globalFilter)
  const globalFilter =
    globalRaw === null || globalRaw === ""
      ? defaults.globalFilter
      : globalRaw

  return {
    page: parsePositiveInt(get(keys.page), defaults.page),
    pageSize: parsePositiveInt(get(keys.pageSize), defaults.pageSize),
    sorting,
    filters,
    joinOperator,
    ...(globalFilter !== undefined && globalFilter !== ""
      ? { globalFilter }
      : {}),
  }
}

/**
 * Serialize table query params to `URLSearchParams`.
 * When `clearOnDefault` is true (default), keys matching defaults are omitted.
 * Default `filterUrlStyle` is `flat` (tablecn-style per-column keys).
 */
export function serializeTableQuery(
  params: TableQueryParams,
  options: TableQuerySerializeOptions = {}
): URLSearchParams {
  const keys = resolveQueryKeys(options.queryKeys)
  const defaults = resolveDefaults(options.defaults)
  const clearOnDefault = options.clearOnDefault ?? true
  const filterUrlStyle = options.filterUrlStyle ?? "flat"
  const searchParams = new URLSearchParams()

  const shouldWrite = (isDefault: boolean) => !clearOnDefault || !isDefault

  if (shouldWrite(params.page === defaults.page)) {
    searchParams.set(keys.page, String(params.page))
  }

  if (shouldWrite(params.pageSize === defaults.pageSize)) {
    searchParams.set(keys.pageSize, String(params.pageSize))
  }

  if (shouldWrite(sortingEquals(params.sorting, defaults.sorting))) {
    searchParams.set(keys.sort, JSON.stringify(params.sorting))
  }

  if (shouldWrite(filtersEquals(params.filters, defaults.filters))) {
    if (filterUrlStyle === "json") {
      searchParams.set(keys.filters, JSON.stringify(params.filters))
    } else {
      const advanced: TableQueryFilter[] = []
      for (const filter of params.filters) {
        if (canFlattenFilter(filter)) {
          const flat = flattenFilterValue(filter.value)
          if (flat !== "" || filter.operator === "isEmpty") {
            searchParams.set(filter.id, flat)
          }
        } else {
          advanced.push(filter)
        }
      }
      if (advanced.length > 0) {
        searchParams.set(keys.filters, JSON.stringify(advanced))
      }
    }
  }

  if (shouldWrite(params.joinOperator === defaults.joinOperator)) {
    searchParams.set(keys.joinOperator, params.joinOperator)
  }

  const defaultGlobal = defaults.globalFilter ?? ""
  const nextGlobal = params.globalFilter ?? ""
  if (shouldWrite(nextGlobal === defaultGlobal) && nextGlobal !== "") {
    searchParams.set(keys.globalFilter, nextGlobal)
  }

  return searchParams
}

/**
 * Build `/path?…` for docs/Storybook.
 * Spaces are always written as `+` (form-urlencoded) so the URL stays valid.
 * `encoded: true` also percent-encodes reserved characters (`[`, `"`, …);
 * `false` leaves those readable (browser-bar style) while still using `+` for spaces.
 */
export function formatTableQueryExampleUrl(
  params: TableQueryParams,
  options: TableQuerySerializeOptions & {
    path?: string
    encoded?: boolean
  } = {}
): string {
  const path = options.path ?? "/items"
  const searchParams = serializeTableQuery(params, options)
  if ([...searchParams.keys()].length === 0) return path

  if (options.encoded) {
    return `${path}?${searchParams.toString()}`
  }

  const parts: string[] = []
  searchParams.forEach((value, key) => {
    parts.push(`${key}=${value.replaceAll(" ", "+")}`)
  })
  return `${path}?${parts.join("&")}`
}

/** Convert query DTO → TanStack-controlled state slice (0-based pageIndex). */
export function toTanStackState(params: TableQueryParams): TableQueryTanStackState {
  return {
    pagination: {
      pageIndex: Math.max(0, params.page - 1),
      pageSize: params.pageSize,
    },
    sorting: params.sorting.map((item) => ({
      id: item.id,
      desc: item.desc,
    })),
    // Store the primitive filter value for UI controls (inputs, faceted checkboxes).
    // Operator/variant live in `params.filters` and are restored via `previousFilters`.
    columnFilters: params.filters.map((filter) => ({
      id: filter.id,
      value: filter.value,
    })),
    globalFilter: params.globalFilter ?? "",
  }
}

export interface FromTanStackStateInput {
  pagination: { pageIndex: number; pageSize: number }
  sorting: SortingState
  columnFilters: ColumnFiltersState
  globalFilter?: string
  /** Preserve operator/variant/filterId when column filter values are plain. */
  previousFilters?: TableQueryFilter[]
  joinOperator?: TableJoinOperator
}

function defaultOperatorForValue(
  value: unknown
): { operator: TableFilterOperator; variant: TableQueryFilterVariant } {
  if (Array.isArray(value)) {
    if (
      value.length === 2 &&
      value.every(
        (item) =>
          typeof item === "number" ||
          (typeof item === "string" && /^\d+$/.test(item))
      )
    ) {
      return { operator: "isBetween", variant: "dateRange" }
    }
    return { operator: "inArray", variant: "multiSelect" }
  }
  if (typeof value === "boolean") {
    return { operator: "eq", variant: "boolean" }
  }
  if (
    typeof value === "number" &&
    Number.isFinite(value) &&
    Math.abs(value) >= 1e11
  ) {
    return { operator: "eq", variant: "date" }
  }
  if (typeof value === "string" && /^-?\d{11,}$/.test(value)) {
    return { operator: "eq", variant: "date" }
  }
  return { operator: "iLike", variant: "text" }
}

function coerceFilterValue(value: unknown): TableQueryFilterValue {
  if (value === null || value === undefined) return null
  if (typeof value === "string" || typeof value === "boolean") return value
  if (Array.isArray(value)) {
    const asStrings = value.map((item) => String(item))
    if (asStrings.length === 2) {
      return [asStrings[0]!, asStrings[1]!]
    }
    return asStrings
  }
  return String(value)
}

/**
 * Convert TanStack state → query DTO.
 * Prefer storing full {@link TableQueryFilter} objects as column filter values
 * (as produced by `toTanStackState`). Plain values are coerced with defaults.
 */
export function fromTanStackState(
  input: FromTanStackStateInput
): TableQueryParams {
  const previousByColumn = new Map(
    (input.previousFilters ?? []).map((filter) => [filter.id, filter])
  )

  const filters: TableQueryFilter[] = input.columnFilters.map((columnFilter) => {
    const raw = columnFilter.value

    if (isPlainObject(raw) && isFilterOperator(raw.operator)) {
      const parsed = parseFilterItem(
        {
          id: columnFilter.id,
          operator: raw.operator,
          value: raw.value,
          variant: raw.variant,
          filterId: raw.filterId,
        },
        null
      )
      if (parsed) return parsed
    }

    const previous = previousByColumn.get(columnFilter.id)
    const inferred = defaultOperatorForValue(raw)
    const value = coerceFilterValue(raw)

    return {
      id: columnFilter.id,
      operator: previous?.operator ?? inferred.operator,
      value,
      variant: previous?.variant ?? inferred.variant,
      filterId: previous?.filterId ?? `${columnFilter.id}-${inferred.operator}`,
    }
  })

  const globalFilter =
    typeof input.globalFilter === "string" && input.globalFilter.length > 0
      ? input.globalFilter
      : undefined

  return {
    page: Math.max(1, input.pagination.pageIndex + 1),
    pageSize: Math.max(1, input.pagination.pageSize),
    sorting: input.sorting.map((item) => ({
      id: item.id,
      desc: item.desc,
    })),
    filters,
    joinOperator: input.joinOperator ?? TABLE_QUERY_DEFAULT_JOIN_OPERATOR,
    ...(globalFilter !== undefined ? { globalFilter } : {}),
  }
}

/** Convenience: params → query string without leading `?`. */
export function serializeTableQueryString(
  params: TableQueryParams,
  options?: TableQuerySerializeOptions
): string {
  return serializeTableQuery(params, options).toString()
}

/** Convenience: parse from a query string (with or without leading `?`). */
export function parseTableQueryString(
  queryString: string,
  options?: TableQueryParseOptions
): TableQueryParams {
  const normalized = queryString.startsWith("?")
    ? queryString.slice(1)
    : queryString
  return parseTableQuery(new URLSearchParams(normalized), options)
}
