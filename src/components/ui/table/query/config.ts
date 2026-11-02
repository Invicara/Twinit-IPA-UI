export const tableSortOrders = [
  { label: "Asc", value: "asc" as const },
  { label: "Desc", value: "desc" as const },
] as const

export const tableTextOperators = [
  { label: "Contains", value: "iLike" as const },
  { label: "Does not contain", value: "notILike" as const },
  { label: "Is", value: "eq" as const },
  { label: "Is not", value: "ne" as const },
  { label: "Is empty", value: "isEmpty" as const },
  { label: "Is not empty", value: "isNotEmpty" as const },
] as const

export const tableNumericOperators = [
  { label: "Is", value: "eq" as const },
  { label: "Is not", value: "ne" as const },
  { label: "Is less than", value: "lt" as const },
  { label: "Is less than or equal to", value: "lte" as const },
  { label: "Is greater than", value: "gt" as const },
  { label: "Is greater than or equal to", value: "gte" as const },
  { label: "Is between", value: "isBetween" as const },
  { label: "Is empty", value: "isEmpty" as const },
  { label: "Is not empty", value: "isNotEmpty" as const },
] as const

export const tableDateOperators = [
  { label: "Is", value: "eq" as const },
  { label: "Is not", value: "ne" as const },
  { label: "Is before", value: "lt" as const },
  { label: "Is after", value: "gt" as const },
  { label: "Is on or before", value: "lte" as const },
  { label: "Is on or after", value: "gte" as const },
  { label: "Is between", value: "isBetween" as const },
  { label: "Is relative to today", value: "isRelativeToToday" as const },
  { label: "Is empty", value: "isEmpty" as const },
  { label: "Is not empty", value: "isNotEmpty" as const },
] as const

export const tableSelectOperators = [
  { label: "Is", value: "eq" as const },
  { label: "Is not", value: "ne" as const },
  { label: "Is empty", value: "isEmpty" as const },
  { label: "Is not empty", value: "isNotEmpty" as const },
] as const

export const tableMultiSelectOperators = [
  { label: "Has any of", value: "inArray" as const },
  { label: "Has none of", value: "notInArray" as const },
  { label: "Is empty", value: "isEmpty" as const },
  { label: "Is not empty", value: "isNotEmpty" as const },
] as const

export const tableBooleanOperators = [
  { label: "Is", value: "eq" as const },
  { label: "Is not", value: "ne" as const },
] as const

export const tableFilterVariants = [
  "text",
  "number",
  "range",
  "rating",
  "date",
  "dateRange",
  "boolean",
  "checkbox",
  "select",
  "multiSelect",
] as const

export const tableFilterOperators = [
  "iLike",
  "notILike",
  "eq",
  "ne",
  "inArray",
  "notInArray",
  "isEmpty",
  "isNotEmpty",
  "lt",
  "lte",
  "gt",
  "gte",
  "isBetween",
  "isRelativeToToday",
] as const

export const tableJoinOperators = ["and", "or"] as const

export const tableConfig = {
  sortOrders: tableSortOrders,
  textOperators: tableTextOperators,
  numericOperators: tableNumericOperators,
  dateOperators: tableDateOperators,
  selectOperators: tableSelectOperators,
  multiSelectOperators: tableMultiSelectOperators,
  booleanOperators: tableBooleanOperators,
  filterVariants: tableFilterVariants,
  operators: tableFilterOperators,
  joinOperators: tableJoinOperators,
} as const

export type TableConfig = typeof tableConfig

/** Default query-param key names for table state in the URL. */
export const tableQueryKeys = {
  page: "page",
  pageSize: "pageSize",
  sort: "sort",
  filters: "filters",
  joinOperator: "joinOperator",
  globalFilter: "q",
} as const

export const TABLE_QUERY_DEFAULT_PAGE = 1
export const TABLE_QUERY_DEFAULT_PAGE_SIZE = 10
export const TABLE_QUERY_DEFAULT_JOIN_OPERATOR = "and" as const
