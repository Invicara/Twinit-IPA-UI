import React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import type { ColumnDef } from "@tanstack/react-table"
import { X } from "lucide-react"
import { styleOverridesArgType, uneditableArgType } from "@storybook/argTypes"
import { Button } from "../button"
import {
  Table,
  TableColumnHeader,
  useColumnFilterControls,
  useTable,
  useTablePaginationControls,
  useTableQuerySearchParams,
  formatTableQueryParamsDebug,
  withColumnOrder,
  withFiltering,
  withPagination,
  withResizing,
  withSelection,
  withSorting,
  withServerMode,
  TableRatingStars,
  type TableColumnFilterProps,
  tableDateFilterFn,
  tableSelectFilterFn,
  tableRangeFilterFn,
} from "./index"
import { queryTableRows } from "./query/query-mock"
import tableStyles from "./table.module.css"
import toggleStyles from "./table.stories.module.css"

type Person = {
  id: string
  name: string
  email: string
  role: string
  joinedAt: number
  estHours: number
  contract: "fulltime" | "contractor" | "temp"
  rating: number
}

const sampleData: Person[] = [
  { id: "1", name: "Ada Lovelace", email: "ada@example.com", role: "Engineer", joinedAt: Date.parse("2023-01-12"), estHours: 4, contract: "fulltime", rating: 5 },
  { id: "2", name: "Grace Hopper", email: "grace@example.com", role: "Engineer", joinedAt: Date.parse("2023-04-03"), estHours: 8, contract: "contractor", rating: 4 },
  { id: "3", name: "Alan Turing", email: "alan@example.com", role: "Researcher", joinedAt: Date.parse("2023-07-20"), estHours: 12, contract: "fulltime", rating: 5 },
  { id: "4", name: "Katherine Johnson", email: "katherine@example.com", role: "Mathematician", joinedAt: Date.parse("2023-11-14"), estHours: 16, contract: "temp", rating: 5 },
  { id: "5", name: "Tim Berners-Lee", email: "tim@example.com", role: "Engineer", joinedAt: Date.parse("2024-02-01"), estHours: 20, contract: "fulltime", rating: 3 },
  { id: "6", name: "Margaret Hamilton", email: "margaret@example.com", role: "Engineer", joinedAt: Date.parse("2024-05-19"), estHours: 24, contract: "contractor", rating: 5 },
  { id: "7", name: "Linus Torvalds", email: "linus@example.com", role: "Engineer", joinedAt: Date.parse("2024-08-09"), estHours: 6, contract: "fulltime", rating: 4 },
  { id: "8", name: "Barbara Liskov", email: "barbara@example.com", role: "Researcher", joinedAt: Date.parse("2024-12-02"), estHours: 10, contract: "temp", rating: 4 },
  { id: "9", name: "Donald Knuth", email: "don@example.com", role: "Researcher", joinedAt: Date.parse("2025-03-30"), estHours: 14, contract: "contractor", rating: 5 },
  { id: "10", name: "Guido van Rossum", email: "guido@example.com", role: "Engineer", joinedAt: Date.parse("2025-06-17"), estHours: 18, contract: "fulltime", rating: 3 },
  { id: "11", name: "Brendan Eich", email: "brendan@example.com", role: "Engineer", joinedAt: Date.parse("2025-09-05"), estHours: 2, contract: "temp", rating: 2 },
  { id: "12", name: "Radia Perlman", email: "radia@example.com", role: "Engineer", joinedAt: Date.parse("2026-01-22"), estHours: 22, contract: "fulltime", rating: 4 },
]

const contractLabels: Record<Person["contract"], string> = {
  fulltime: "Full-time",
  contractor: "Contractor",
  temp: "Temp",
}

const roleOptions = [
  { label: "Engineer", value: "Engineer", count: 7 },
  { label: "Researcher", value: "Researcher", count: 3 },
  { label: "Mathematician", value: "Mathematician", count: 1 },
]

const defaultColumns: ColumnDef<Person>[] = [
  { accessorKey: "name", header: "Name", enableSorting: false },
  { accessorKey: "role", header: "Role", enableSorting: false },
  { accessorKey: "email", header: "Email", enableSorting: false },
]

const simpleSortColumns: ColumnDef<Person>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <TableColumnHeader column={column} label="Name" variant="button" />
    ),
    meta: { label: "Name" },
    enableHiding: false,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <TableColumnHeader column={column} label="Role" variant="button" />
    ),
    meta: { label: "Role" },
    enableHiding: false,
  },
  {
    accessorKey: "joinedAt",
    header: ({ column }) => (
      <TableColumnHeader column={column} label="Joined" variant="button" />
    ),
    cell: ({ row }) => new Date(row.getValue("joinedAt")).toLocaleDateString(),
    meta: { label: "Joined" },
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <TableColumnHeader column={column} label="Email" variant="button" />
    ),
    meta: { label: "Email" },
    enableHiding: false,
  },
]

const advancedSortColumns: ColumnDef<Person>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <TableColumnHeader column={column} label="Name" variant="menu" />
    ),
    meta: { label: "Name" },
    enableHiding: false,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <TableColumnHeader column={column} label="Role" variant="menu" />
    ),
    meta: { label: "Role" },
    enableHiding: false,
  },
  {
    accessorKey: "joinedAt",
    header: ({ column }) => (
      <TableColumnHeader column={column} label="Joined" variant="menu" />
    ),
    cell: ({ row }) => new Date(row.getValue("joinedAt")).toLocaleDateString(),
    meta: { label: "Joined" },
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <TableColumnHeader column={column} label="Email" variant="menu" />
    ),
    meta: { label: "Email" },
    enableHiding: false,
  },
]

const hideableColumns: ColumnDef<Person>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <TableColumnHeader column={column} label="Name" variant="menu" />
    ),
    meta: { label: "Name" },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <TableColumnHeader column={column} label="Role" variant="menu" />
    ),
    meta: { label: "Role" },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "joinedAt",
    header: ({ column }) => (
      <TableColumnHeader column={column} label="Joined" variant="menu" />
    ),
    cell: ({ row }) => new Date(row.getValue("joinedAt")).toLocaleDateString(),
    meta: { label: "Joined" },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <TableColumnHeader column={column} label="Email" variant="menu" />
    ),
    meta: { label: "Email" },
    enableSorting: false,
    enableHiding: true,
  },
]

const resizableColumns: ColumnDef<Person>[] = [
  { accessorKey: "name", header: "Name", enableSorting: false },
  { accessorKey: "role", header: "Role", enableSorting: false },
  {
    accessorKey: "joinedAt",
    header: "Joined",
    cell: ({ row }) => new Date(row.getValue("joinedAt")).toLocaleDateString(),
    enableSorting: false,
  },
  { accessorKey: "email", header: "Email", enableSorting: false },
]

const draggableColumns: ColumnDef<Person>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "role", header: "Role" },
  {
    accessorKey: "joinedAt",
    header: "Joined",
    cell: ({ row }) => new Date(row.getValue("joinedAt")).toLocaleDateString(),
  },
  { accessorKey: "email", header: "Email" },
]

const filterColumns: ColumnDef<Person>[] = [
  {
    accessorKey: "name",
    header: "Name",
    enableColumnFilter: true,
    meta: { label: "Name", placeholder: "Search Name" },
  },
  {
    accessorKey: "role",
    header: "Role",
    enableColumnFilter: true,
    meta: {
      label: "Role",
      variant: "multiSelect",
      options: roleOptions,
    },
    filterFn: tableSelectFilterFn,
  },
  {
    accessorKey: "estHours",
    header: () => <span className={tableStyles.cellAlignCenter}>Est. Hours</span>,
    cell: ({ getValue }) => (
      <span className={tableStyles.cellAlignCenter}>{getValue<number>()}</span>
    ),
    enableColumnFilter: true,
    meta: {
      label: "Est. Hours",
      variant: "range",
      range: [1, 24],
      unit: "hr",
      step: 1,
    },
    filterFn: tableRangeFilterFn,
  },
  {
    accessorKey: "contract",
    header: "Contract",
    cell: ({ getValue }) => contractLabels[getValue<Person["contract"]>()],
    enableColumnFilter: true,
    meta: {
      label: "Contract",
      variant: "checkbox",
      checkedValue: "fulltime",
      checkedLabel: "Full-time",
    },
  },
  {
    accessorKey: "joinedAt",
    header: "Joined",
    cell: ({ row }) => new Date(row.getValue("joinedAt")).toLocaleDateString(),
    enableColumnFilter: true,
    meta: {
      label: "Joined Date",
      variant: "dateRange",
      showToday: true,
      showThisWeek: true,
      showThisMonth: true,
      showThisQuarter: true,
      showThisYear: true,
    },
    filterFn: tableDateFilterFn,
    filterFn: tableDateFilterFn,
  },
  {
    accessorKey: "email",
    header: "Email",
    enableColumnFilter: true,
    meta: { label: "Email", placeholder: "Search Email" },
  },
]

const defaultPageSizeOptions = [5, 10, 20, 30, 50]

const deleteSelectedAction = (
  <Button variant="danger" size="sm" className={tableStyles.compactDangerButton}>
    <X aria-hidden />
    Delete selected
  </Button>
)

function TableStoryShell({
  children,
  maxWidth = 960,
}: {
  children: React.ReactNode
  maxWidth?: number
}) {
  return <div style={{ maxWidth }}>{children}</div>
}

function TableDemo({
  emptyMessage = "No results",
  isLoading,
  isFetching,
  styleOverrides,
}: {
  emptyMessage?: string
  isLoading?: boolean
  isFetching?: boolean
  styleOverrides?: Record<string, string>
}) {
  const table = useTable({
    data: sampleData,
    columns: defaultColumns,
    features: [withSorting(), withFiltering(), withPagination()],
    initialState: { pagination: { pageSize: 5, pageIndex: 0 } },
    getRowId: (row) => row.id,
  })

  return (
    <TableStoryShell>
      <Table
        table={table}
        emptyMessage={emptyMessage}
        isLoading={isLoading}
        isFetching={isFetching}
        styleOverrides={styleOverrides}
      >
        <Table.Frame>
          <Table.Toolbar />
          <Table.Grid />
          <Table.Pagination pageSizeOptions={defaultPageSizeOptions} />
        </Table.Frame>
      </Table>
    </TableStoryShell>
  )
}

const meta = {
  title: "ui/Table",
  component: Table,
  tags: ["autodocs"],
  args: {
    styleOverrides: {},
    emptyMessage: "No results",
  },
  argTypes: {
    styleOverrides: styleOverridesArgType(),
    emptyMessage: {
      control: { type: "text" },
      description: "Message shown when the table has no rows.",
    },
    table: uneditableArgType("TanstackTable<TData>", "TanStack table instance from useTable."),
    isLoading: {
      control: { type: "boolean" },
      description:
        "Skeleton body for the initial load. Query controls stay visible and are disabled together until rows are ready.",
    },
    isFetching: {
      control: { type: "boolean" },
      description: "Show refetch overlay while keeping current rows.",
    },
    children: uneditableArgType("ReactNode", "Toolbar, grid, footer, and other chrome parts."),
  },
  render: (args) => <TableDemo {...args} />,
} satisfies Meta

export default meta

type Story = StoryObj

export const Default: Story = {}

export const Selectable: Story = {
  render: () => {
    const table = useTable({
      data: sampleData,
      columns: defaultColumns,
      features: [withSelection(), withFiltering(), withPagination()],
      initialState: { pagination: { pageSize: 5, pageIndex: 0 } },
      getRowId: (row) => row.id,
    })

    return (
      <TableStoryShell>
        <Table table={table}>
          <Table.Frame>
            <Table.Grid />
            <Table.Pagination
              pageSizeOptions={defaultPageSizeOptions}
              actionBar={deleteSelectedAction}
            />
          </Table.Frame>
        </Table>
      </TableStoryShell>
    )
  },
}

export const Sort: Story = {
  name: "Sort",
  render: () => {
    const table = useTable({
      data: sampleData,
      columns: simpleSortColumns,
      features: [withSorting({ enableMultiSort: false }), withPagination()],
      initialState: { pagination: { pageSize: 5, pageIndex: 0 } },
      getRowId: (row) => row.id,
    })

    return (
      <TableStoryShell>
        <Table table={table}>
          <Table.Frame>
            <Table.Grid />
            <Table.Pagination pageSizeOptions={defaultPageSizeOptions} />
          </Table.Frame>
        </Table>
      </TableStoryShell>
    )
  },
}

export const AdvancedSort: Story = {
  name: "Advanced Sort",
  render: () => {
    const table = useTable({
      data: sampleData,
      columns: advancedSortColumns,
      features: [withSorting({ enableMultiSort: true }), withPagination()],
      initialState: { pagination: { pageSize: 5, pageIndex: 0 } },
      getRowId: (row) => row.id,
    })

    return (
      <TableStoryShell>
        <Table table={table}>
          <Table.Frame>
            <Table.Toolbar>
              <Table.SortList />
            </Table.Toolbar>
            <Table.Grid />
            <Table.Pagination pageSizeOptions={defaultPageSizeOptions} />
          </Table.Frame>
        </Table>
      </TableStoryShell>
    )
  },
}

export const HideableColumns: Story = {
  render: () => {
    const table = useTable({
      data: sampleData,
      columns: hideableColumns,
      features: [withPagination()],
      initialState: { pagination: { pageSize: 5, pageIndex: 0 } },
      getRowId: (row) => row.id,
    })

    return (
      <TableStoryShell>
        <Table table={table}>
          <Table.Frame>
            <Table.Toolbar>
              <Table.ViewOptions />
            </Table.Toolbar>
            <Table.Grid />
            <Table.Pagination pageSizeOptions={defaultPageSizeOptions} />
          </Table.Frame>
        </Table>
      </TableStoryShell>
    )
  },
}

export const ColumnFilters: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Column filters plus the right-aligned Filter menu. Typed dates are day-first (D-M-Y): `14-11-2023`, `14 11 23`, `14.11.23`, `9-1-23`. Ranges use ` - ` or `to` between dates (`14-07-23 - 17-9-2025`).",
      },
    },
  },
  render: () => {
    const table = useTable({
      data: sampleData,
      columns: filterColumns,
      features: [withFiltering(), withPagination()],
      initialState: { pagination: { pageSize: 5, pageIndex: 0 } },
      getRowId: (row) => row.id,
    })

    return (
      <TableStoryShell maxWidth={1280}>
        <Table table={table}>
          <Table.Frame>
            <Table.Toolbar>
              <Table.Filters />
              <Table.FilterMenu />
            </Table.Toolbar>
            <Table.Grid />
            <Table.Pagination pageSizeOptions={defaultPageSizeOptions} />
          </Table.Frame>
        </Table>
      </TableStoryShell>
    )
  },
}

export const ResizableColumns: Story = {
  name: "Resizable Columns",
  render: () => {
    const table = useTable({
      data: sampleData,
      columns: resizableColumns,
      features: [withResizing(), withPagination()],
      initialState: { pagination: { pageSize: 5, pageIndex: 0 } },
      getRowId: (row) => row.id,
    })

    return (
      <TableStoryShell>
        <Table table={table}>
          <Table.Frame>
            <Table.Grid />
            <Table.Pagination pageSizeOptions={defaultPageSizeOptions} />
          </Table.Frame>
        </Table>
      </TableStoryShell>
    )
  },
}

export const DraggableColumns: Story = {
  name: "Draggable Columns",
  render: () => {
    const table = useTable({
      data: sampleData,
      columns: draggableColumns,
      features: [withColumnOrder(), withPagination()],
      initialState: { pagination: { pageSize: 5, pageIndex: 0 } },
      getRowId: (row) => row.id,
    })

    return (
      <TableStoryShell>
        <Table table={table}>
          <Table.Frame>
            <Table.Grid />
            <Table.Pagination pageSizeOptions={defaultPageSizeOptions} />
          </Table.Frame>
        </Table>
      </TableStoryShell>
    )
  },
}

export const NoPagination: Story = {
  render: () => {
    const table = useTable({
      data: sampleData,
      columns: defaultColumns,
      features: [withSorting(), withFiltering()],
      getRowId: (row) => row.id,
    })

    return (
      <TableStoryShell>
        <Table table={table}>
          <Table.Frame>
            <Table.Grid />
          </Table.Frame>
        </Table>
      </TableStoryShell>
    )
  },
}

export const Empty: Story = {
  render: () => {
    const table = useTable({
      data: [],
      columns: defaultColumns,
    })

    return (
      <Table table={table} emptyMessage="No people found.">
        <Table.Frame>
          <Table.Grid />
        </Table.Frame>
      </Table>
    )
  },
}

function useExclusiveTableLoadMode(isLoading: boolean, isFetching: boolean) {
  const previous = React.useRef({ isLoading, isFetching })
  const [mode, setMode] = React.useState<"loading" | "fetching" | "ready">(
    isLoading ? "loading" : isFetching ? "fetching" : "ready"
  )

  React.useEffect(() => {
    const was = previous.current
    if (isFetching && !was.isFetching) setMode("fetching")
    else if (isLoading && !was.isLoading) setMode("loading")
    else if (!isLoading && !isFetching) setMode("ready")
    else if (isFetching && !isLoading) setMode("fetching")
    else if (isLoading && !isFetching) setMode("loading")
    previous.current = { isLoading, isFetching }
  }, [isLoading, isFetching])

  return mode
}

export const Loading: Story = {
  name: "Loading (skeleton)",
  args: {
    isLoading: true,
    isFetching: false,
  },
  argTypes: {
    isLoading: {
      control: { type: "boolean" },
      description:
        "Skeleton body for the initial load. Query controls stay visible and are disabled together until rows are ready.",
      if: { arg: "isFetching", eq: false },
    },
    isFetching: {
      control: { type: "boolean" },
        description:
        "Refetch: rows stay visible, washed out, with the line across the top. Same chrome as Server Mode. Hidden while isLoading is on.",
      if: { arg: "isLoading", eq: false },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "isLoading is the skeleton, before rows exist. Turn it off to see the loaded table. isFetching is a later refetch: the same rows stay, greyed, with the line across the top. Only one control is shown at a time.",
      },
    },
  },
  render: (args) => {
    const { isLoading = true, isFetching = false } = args as {
      isLoading?: boolean
      isFetching?: boolean
    }
    const mode = useExclusiveTableLoadMode(Boolean(isLoading), Boolean(isFetching))
    const table = useTable({
      data: sampleData,
      columns: simpleSortColumns,
      features: [withSorting(), withPagination()],
      initialState: { pagination: { pageSize: 5, pageIndex: 0 } },
      getRowId: (row) => row.id,
    })

    return (
      <TableStoryShell>
        <Table
          table={table}
          isLoading={mode === "loading"}
          isFetching={mode === "fetching"}
        >
          <Table.Frame>
            <Table.Toolbar>
              <Table.Search />
            </Table.Toolbar>
            <Table.Grid />
            <Table.Pagination pageSizeOptions={defaultPageSizeOptions} />
          </Table.Frame>
        </Table>
      </TableStoryShell>
    )
  },
}

type ServerModeArgs = {
  debounceMs: number
  fetchDelayMs: number
  emptyMessage?: string
  showPagination?: boolean
  selectable?: boolean
  draggable?: boolean
  resizable?: boolean
  isLoading?: boolean
  isFetching?: boolean
  styleOverrides?: Record<string, string>
  className?: string
}

function ServerModeDemo({
  debounceMs,
  fetchDelayMs,
  emptyMessage = "No results",
  showPagination = true,
  selectable = false,
  draggable = false,
  resizable = false,
  isLoading: isLoadingArg = false,
  isFetching: isFetchingArg = false,
  styleOverrides,
  className,
}: ServerModeArgs) {
  const serverColumns = React.useMemo<ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <TableColumnHeader column={column} label="Name" variant="button" />
        ),
        meta: { label: "Name", variant: "text", placeholder: "Filter name…" },
        enableColumnFilter: true,
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <TableColumnHeader column={column} label="Role" variant="button" />
        ),
        meta: {
          label: "Role",
          variant: "multiSelect",
          options: roleOptions,
        },
        enableColumnFilter: true,
      },
      {
        accessorKey: "joinedAt",
        header: ({ column }) => (
          <TableColumnHeader column={column} label="Joined" variant="button" />
        ),
        cell: ({ row }) =>
          new Date(row.getValue("joinedAt")).toLocaleDateString(),
        meta: { label: "Joined", variant: "date" },
        enableColumnFilter: true,
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <TableColumnHeader column={column} label="Email" variant="button" />
        ),
        meta: { label: "Email", variant: "text", placeholder: "Filter email…" },
        enableColumnFilter: true,
      },
    ],
    []
  )

  // Always hydrate clean in Storybook — leftover iframe query params would
  // otherwise restore filters/sort from a previous session.
  const query = useTableQuerySearchParams({
    initialState: { pageSize: 5, sorting: [], filters: [] },
    debounceMs,
    syncUrl: true,
    history: "replace",
    filterUrlStyle: "flat",
    search: "",
  })

  const [serverRows, setServerRows] = React.useState<Person[]>(() =>
    sampleData.slice(0, 5)
  )
  const [pageCount, setPageCount] = React.useState(() =>
    Math.max(1, Math.ceil(sampleData.length / 5))
  )
  const [rowCount, setRowCount] = React.useState(sampleData.length)
  const [isFetching, setIsFetching] = React.useState(false)
  const [requestCount, setRequestCount] = React.useState(0)
  const [lastLatencyMs, setLastLatencyMs] = React.useState(0)
  const hasLoadedOnce = React.useRef(false)

  React.useEffect(() => {
    let cancelled = false
    const started = performance.now()

    // Seeded rows stay visible on first paint; subsequent fetches use overlay.
    if (hasLoadedOnce.current) {
      setIsFetching(true)
    }

    void queryTableRows(sampleData, query.params, {
      delayMs: fetchDelayMs,
    }).then((result) => {
      if (cancelled) return
      setServerRows(result.rows)
      setPageCount(result.pageCount)
      setRowCount(result.rowCount ?? result.rows.length)
      setRequestCount((count) => count + 1)
      setLastLatencyMs(Math.round(performance.now() - started))
      setIsFetching(false)
      hasLoadedOnce.current = true
    })

    return () => {
      cancelled = true
    }
  }, [query.params, fetchDelayMs])

  const serverTable = useTable({
    data: serverRows,
    columns: serverColumns,
    features: [
      withServerMode({
        pageCount,
        rowCount,
        enableMultiSort: true,
      }),
      selectable && withSelection(),
      draggable && withColumnOrder(),
      resizable && withResizing(),
    ],
    pageCount,
    rowCount,
    state: query.state,
    onPaginationChange: query.onPaginationChange,
    onSortingChange: query.onSortingChange,
    onColumnFiltersChange: query.onColumnFiltersChange,
    onGlobalFilterChange: query.onGlobalFilterChange,
    getRowId: (row) => row.id,
  })

  const paramsDebug = formatTableQueryParamsDebug(query.params)
  const splitRef = React.useRef<HTMLDivElement>(null)
  const [tablePanePct, setTablePanePct] = React.useState(70)

  const onSplitterPointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault()
      const container = splitRef.current
      if (!container) return

      const handle = event.currentTarget
      handle.setPointerCapture(event.pointerId)

      const onMove = (moveEvent: PointerEvent) => {
        const rect = container.getBoundingClientRect()
        if (rect.width <= 0) return
        const next = ((moveEvent.clientX - rect.left) / rect.width) * 100
        setTablePanePct(Math.min(85, Math.max(45, next)))
      }

      const onUp = (upEvent: PointerEvent) => {
        handle.releasePointerCapture(upEvent.pointerId)
        handle.removeEventListener("pointermove", onMove)
        handle.removeEventListener("pointerup", onUp)
        handle.removeEventListener("pointercancel", onUp)
      }

      handle.addEventListener("pointermove", onMove)
      handle.addEventListener("pointerup", onUp)
      handle.addEventListener("pointercancel", onUp)
    },
    []
  )

  const debugBoxStyle: React.CSSProperties = {
    display: "grid",
    gap: 8,
    padding: 12,
    borderRadius: 6,
    border: "1px solid var(--neutral-3)",
    background: "var(--neutral-05, var(--neutral-1))",
    fontSize: 12,
    minWidth: 0,
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        width: "100%",
      }}
    >
      <div style={debugBoxStyle}>
        <div
          style={{
            wordBreak: "break-all",
            lineHeight: 1.4,
            fontSize: 11,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          }}
        >
          {query.exampleUrl}
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            color: "var(--neutral-7)",
          }}
        >
          <span>
            debounceMs: <strong>{debounceMs}</strong>
          </span>
          <span>
            fetchDelayMs: <strong>{fetchDelayMs}</strong>
          </span>
          <span>
            mock requests: <strong>{requestCount}</strong>
          </span>
          <span>
            last latency: <strong>{lastLatencyMs}ms</strong>
          </span>
        </div>
      </div>

      <div
        ref={splitRef}
        style={{
          display: "flex",
          width: "100%",
          alignItems: "stretch",
          gap: 0,
          minHeight: 0,
        }}
      >
        <div style={{ width: `${tablePanePct}%`, minWidth: 0, flexShrink: 0 }}>
          <Table
            table={serverTable}
            emptyMessage={emptyMessage}
            isLoading={isLoadingArg}
            isFetching={isFetchingArg || isFetching}
            styleOverrides={styleOverrides}
          >
            <Table.Frame className={className}>
              <Table.Toolbar
                globalFilterPlaceholder="Search…"
                onResetFilters={query.resetFilters}
              >
                <Table.Search placeholder="Search…" />
                <Table.Filters />
                <Table.SortList />
              </Table.Toolbar>
              <Table.Grid />
              {showPagination ? (
                <Table.Pagination pageSizeOptions={defaultPageSizeOptions} />
              ) : null}
            </Table.Frame>
          </Table>
        </div>
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize table and params panes"
          aria-valuenow={Math.round(tablePanePct)}
          aria-valuemin={45}
          aria-valuemax={85}
          onPointerDown={onSplitterPointerDown}
          style={{
            // 5px hit target (1px line + 2px each side); margins keep the same visual gap.
            width: 5,
            flexShrink: 0,
            marginLeft: 10,
            marginRight: 10,
            cursor: "col-resize",
            touchAction: "none",
            background:
              "linear-gradient(to right, transparent 2px, var(--neutral-3) 2px, var(--neutral-3) 3px, transparent 3px)",
            alignSelf: "stretch",
          }}
        />
        <div
          style={{
            ...debugBoxStyle,
            flex: 1,
            minWidth: 0,
            borderRadius: 0,
            position: "sticky",
            top: 8,
            alignSelf: "flex-start",
          }}
        >
          <div style={{ fontWeight: 600 }}>Server query params</div>
          <pre
            style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontSize: 11,
              lineHeight: 1.4,
            }}
          >
            {paramsDebug}
          </pre>
        </div>
      </div>
    </div>
  )
}


export const ServerMode = {
  name: "Server Mode",
  args: {
    debounceMs: 300,
    fetchDelayMs: 650,
    emptyMessage: "No results",
    showPagination: true,
    selectable: false,
    draggable: false,
    resizable: false,
    isLoading: false,
    isFetching: false,
    styleOverrides: {},
  },
  argTypes: {
    debounceMs: {
      control: { type: "number", min: 0, max: 2000, step: 50 },
      description:
        "useTableQueryState debounce for text/global filter commits (ms).",
    },
    fetchDelayMs: {
      control: { type: "number", min: 0, max: 3000, step: 50 },
      description: "Artificial mock API latency per request (ms).",
    },
  },
  render: (args: ServerModeArgs) => <ServerModeDemo {...args} />,
} as any

type AllFeaturesArgs = {
  debounceMs: number
  fetchDelayMs: number
  emptyMessage?: string
  isLoading?: boolean
  isFetching?: boolean
  styleOverrides?: Record<string, string>
}

function AllFeaturesDemo({
  debounceMs,
  fetchDelayMs,
  emptyMessage = "No people found.",
  isLoading: isLoadingArg = false,
  isFetching: isFetchingArg = false,
  styleOverrides,
}: AllFeaturesArgs) {
  const columns = React.useMemo<ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <TableColumnHeader column={column} label="Name" variant="menu" />
        ),
        meta: { label: "Name", variant: "text", placeholder: "Search Name" },
        enableColumnFilter: true,
        enableHiding: true,
        size: 160,
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <TableColumnHeader column={column} label="Role" variant="menu" />
        ),
        meta: {
          label: "Role",
          variant: "multiSelect",
          options: roleOptions,
        },
        enableColumnFilter: true,
        enableHiding: true,
        size: 140,
      },
      {
        accessorKey: "estHours",
        header: ({ column }) => (
          <TableColumnHeader column={column} label="Est. Hours" variant="menu" />
        ),
        cell: ({ getValue }) => (
          <span className={tableStyles.cellAlignCenter}>{getValue<number>()}</span>
        ),
        meta: {
          label: "Est. Hours",
          variant: "range",
          range: [1, 24],
          unit: "hr",
          step: 1,
        },
        enableColumnFilter: true,
        enableHiding: true,
        size: 110,
      },
      {
        accessorKey: "contract",
        header: ({ column }) => (
          <TableColumnHeader column={column} label="Contract" variant="menu" />
        ),
        cell: ({ getValue }) => contractLabels[getValue<Person["contract"]>()],
        meta: {
          label: "Contract",
          variant: "checkbox",
          checkedValue: "fulltime",
          checkedLabel: "Full-time",
        },
        enableColumnFilter: true,
        enableHiding: true,
        size: 120,
      },
      {
        accessorKey: "joinedAt",
        header: ({ column }) => (
          <TableColumnHeader
            column={column}
            label="Joined"
            variant="menu"
          />
        ),
        cell: ({ row }) =>
          new Date(row.getValue("joinedAt")).toLocaleDateString(),
        meta: {
          label: "Joined Date",
          variant: "dateRange",
          showToday: true,
          showThisWeek: true,
          showThisMonth: true,
          showThisQuarter: true,
          showThisYear: true,
        },
        enableColumnFilter: true,
        enableHiding: true,
        size: 130,
      },
      {
        accessorKey: "rating",
        header: ({ column }) => (
          <TableColumnHeader column={column} label="Rating" variant="menu" />
        ),
        cell: ({ getValue }) => <TableRatingStars value={getValue<number>()} />,
        meta: {
          label: "Rating",
          variant: "rating",
        },
        enableColumnFilter: true,
        enableHiding: true,
        size: 120,
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <TableColumnHeader column={column} label="Email" variant="menu" />
        ),
        meta: { label: "Email", variant: "text", placeholder: "Search Email" },
        enableColumnFilter: true,
        enableHiding: true,
        size: 200,
      },
    ],
    []
  )

  const query = useTableQuerySearchParams({
    initialState: { pageSize: 5, sorting: [], filters: [] },
    debounceMs,
    syncUrl: true,
    history: "replace",
    filterUrlStyle: "flat",
    search: "",
  })

  const [serverRows, setServerRows] = React.useState<Person[]>([])
  const [pageCount, setPageCount] = React.useState(1)
  const [rowCount, setRowCount] = React.useState(0)
  const [isFetching, setIsFetching] = React.useState(false)
  const [hasLoaded, setHasLoaded] = React.useState(false)
  const [requestCount, setRequestCount] = React.useState(0)
  const [lastLatencyMs, setLastLatencyMs] = React.useState(0)
  const hasLoadedOnce = React.useRef(false)

  React.useEffect(() => {
    let cancelled = false
    const started = performance.now()

    if (hasLoadedOnce.current) {
      setIsFetching(true)
    }

    void queryTableRows(sampleData, query.params, {
      delayMs: fetchDelayMs,
    }).then((result) => {
      if (cancelled) return
      setServerRows(result.rows)
      setPageCount(result.pageCount)
      setRowCount(result.rowCount ?? result.rows.length)
      setRequestCount((count) => count + 1)
      setLastLatencyMs(Math.round(performance.now() - started))
      setIsFetching(false)
      hasLoadedOnce.current = true
      setHasLoaded(true)
    })

    return () => {
      cancelled = true
    }
  }, [query.params, fetchDelayMs])

  const table = useTable({
    data: serverRows,
    columns,
    features: [
      withServerMode({
        pageCount,
        rowCount,
        enableMultiSort: true,
      }),
      withSelection(),
      withColumnOrder(),
      withResizing(),
    ],
    pageCount,
    rowCount,
    state: query.state,
    onPaginationChange: query.onPaginationChange,
    onSortingChange: query.onSortingChange,
    onColumnFiltersChange: query.onColumnFiltersChange,
    onGlobalFilterChange: query.onGlobalFilterChange,
    getRowId: (row) => row.id,
  })

  const paramsDebug = formatTableQueryParamsDebug(query.params)

  const debugBoxStyle: React.CSSProperties = {
    display: "grid",
    gap: 8,
    padding: 12,
    borderRadius: 6,
    border: "1px solid var(--neutral-3)",
    background: "var(--neutral-05, var(--neutral-1))",
    fontSize: 12,
    minWidth: 0,
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        width: "100%",
      }}
    >
      <div style={debugBoxStyle}>
        <div
          style={{
            wordBreak: "break-all",
            lineHeight: 1.4,
            fontSize: 11,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          }}
        >
          {query.exampleUrl}
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            color: "var(--neutral-7)",
          }}
        >
          <span>
            debounceMs: <strong>{debounceMs}</strong>
          </span>
          <span>
            fetchDelayMs: <strong>{fetchDelayMs}</strong>
          </span>
          <span>
            mock requests: <strong>{requestCount}</strong>
          </span>
          <span>
            last latency: <strong>{lastLatencyMs}ms</strong>
          </span>
        </div>
      </div>

      <Table
        table={table}
        emptyMessage={emptyMessage}
        isLoading={isLoadingArg || !hasLoaded}
        isFetching={isFetchingArg || isFetching}
        styleOverrides={styleOverrides}
      >
        <Table.Frame>
          <Table.Toolbar
            globalFilterPlaceholder="Global Search"
            onResetFilters={query.resetFilters}
          >
            <Table.Search placeholder="Global Search" />
            <Table.Filters />
            <Table.SortList />
            <Table.ViewOptions />
            <Table.FilterMenu />
          </Table.Toolbar>
          <Table.Grid />
          <Table.Pagination
            pageSizeOptions={defaultPageSizeOptions}
            actionBar={deleteSelectedAction}
          />
        </Table.Frame>
      </Table>

      <div style={debugBoxStyle}>
        <div style={{ fontWeight: 600 }}>Server query params</div>
        <pre
          style={{
            margin: 0,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            fontSize: 11,
            lineHeight: 1.4,
          }}
        >
          {paramsDebug}
        </pre>
      </div>
    </div>
  )
}

const JOINED_TOGGLE_OPTIONS = ["1", "2", "3+"] as const
type JoinedToggleOption = (typeof JOINED_TOGGLE_OPTIONS)[number]

/** [fromMs, toMs] for the joined column. Empty from means no lower bound. */
function joinedToggleRange(option: JoinedToggleOption): [string, string] {
  const year = new Date().getFullYear()
  const start = (y: number) => String(Date.parse(`${y}-01-01`))
  const end = (y: number) => String(Date.parse(`${y}-12-31T23:59:59.999Z`))
  if (option === "1") return [start(year - 1), end(year)]
  if (option === "2") return [start(year - 2), end(year - 2)]
  return ["", end(year - 3)]
}

function joinedToggleFromValue(value: unknown): JoinedToggleOption | null {
  if (!Array.isArray(value)) return null
  const from = value[0] == null ? "" : String(value[0])
  const to = value[1] == null ? "" : String(value[1])
  for (const option of JOINED_TOGGLE_OPTIONS) {
    const range = joinedToggleRange(option)
    if (from === range[0] && to === range[1]) return option
  }
  return null
}

function JoinedToggleFilter({
  column,
  title,
}: TableColumnFilterProps<Person>) {
  const filter = useColumnFilterControls<Person, string[]>(column)
  const selected = joinedToggleFromValue(filter.value)

  return (
    <div className={toggleStyles.toggle}>
      <div
        className={toggleStyles.segments}
        role="radiogroup"
        aria-label={title ?? "Joined"}
      >
        {JOINED_TOGGLE_OPTIONS.map((option) => {
          const isSelected = selected === option
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${option} Years Ago`}
              className={`${toggleStyles.segment}${isSelected ? ` ${toggleStyles.segmentSelected}` : ""
                }`}
              onClick={() => filter.setValue(joinedToggleRange(option))}
            >
              {option}
            </button>
          )
        })}
      </div>
      <span className={toggleStyles.suffix}>Years Ago</span>
    </div>
  )
}

export const CustomFilterSlot: Story = {
  name: "Custom Filter Slot (meta.filter)",
  render: () => {
    const columns = React.useMemo<ColumnDef<Person>[]>(
      () => [
        {
          accessorKey: "name",
          header: ({ column }) => (
            <TableColumnHeader column={column} label="Name" variant="button" />
          ),
          meta: { label: "Name", variant: "text", placeholder: "Filter name…" },
          enableColumnFilter: true,
        },
        {
          accessorKey: "role",
          header: ({ column }) => (
            <TableColumnHeader column={column} label="Role" variant="button" />
          ),
          meta: {
            label: "Role",
            variant: "multiSelect",
            options: roleOptions,
          },
          enableColumnFilter: true,
          filterFn: (row, id, value: string[]) => {
            if (!value?.length) return true
            return value.includes(String(row.getValue(id)))
          },
        },
        {
          accessorKey: "joinedAt",
          header: ({ column }) => (
            <TableColumnHeader column={column} label="Joined" variant="button" />
          ),
          cell: ({ getValue }) =>
            new Date(getValue<number>()).toLocaleDateString(),
          meta: {
            label: "Joined",
            variant: "dateRange",
            // Hot-swap: same toolbar slot, same dateRange value shape.
            filter: JoinedToggleFilter,
          },
          enableColumnFilter: true,
          filterFn: (row, id, value: string[]) => {
            if (!value?.length) return true
            const ts = row.getValue<number>(id)
            const from = value[0] ? Number(value[0]) : undefined
            const to = value[1] ? Number(value[1]) : undefined
            if (from != null && !Number.isNaN(from) && ts < from) return false
            if (to != null && !Number.isNaN(to) && ts > to) return false
            return true
          },
        },
      ],
      []
    )

    const table = useTable({
      data: sampleData,
      columns,
      features: [withSorting(), withFiltering(), withPagination()],
      initialState: { pagination: { pageSize: 5, pageIndex: 0 } },
      getRowId: (row) => row.id,
    })

    return (
      <TableStoryShell>
        <Table table={table}>
          <Table.Frame>
            <Table.Toolbar>
              <Table.Filters />
            </Table.Toolbar>
            <Table.Grid />
            <Table.Pagination pageSizeOptions={defaultPageSizeOptions} />
          </Table.Frame>
        </Table>
        <p style={{ marginTop: 12, fontSize: 13, color: "#64748b" }}>
          The toggle is custom chrome on <code>meta.filter</code>. It calls{" "}
          <code>useColumnFilterControls</code> for the joined column, turns the
          chosen <strong>1</strong>, <strong>2</strong>, or <strong>3+</strong>{" "}
          into a real from/to date, and passes that range with{" "}
          <code>filter.setValue</code>. Any control can sit here as long as it
          ends by handing the column a date range the same way.
        </p>
      </TableStoryShell>
    )
  },
}

export const ComposedFeatures: Story = {
  name: "Composed Features",
  render: () => {
    const table = useTable({
      data: sampleData,
      columns: simpleSortColumns,
      features: [
        withSorting({ enableMultiSort: false }),
        withFiltering({ faceting: true }),
        withPagination(),
      ],
      initialState: { pagination: { pageSize: 5, pageIndex: 0 } },
      getRowId: (row) => row.id,
    })

    const pagination = useTablePaginationControls(table)

    return (
      <TableStoryShell>
        <Table table={table}>
          <Table.Frame>
            <Table.Grid />
            <Table.Footer>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  padding: "8px 0",
                }}
              >
                <button
                  type="button"
                  disabled={!pagination.canPreviousPage}
                  onClick={pagination.previousPage}
                >
                  Prev
                </button>
                <span>
                  Page {pagination.page} / {pagination.pageCount}
                </span>
                <button
                  type="button"
                  disabled={!pagination.canNextPage}
                  onClick={pagination.nextPage}
                >
                  Next
                </button>
              </div>
            </Table.Footer>
          </Table.Frame>
        </Table>
      </TableStoryShell>
    )
  },
}

export const AllFeatures = {
  name: "All Features",
  args: {
    debounceMs: 300,
    fetchDelayMs: 650,
    emptyMessage: "No people found.",
    isLoading: false,
    isFetching: false,
    styleOverrides: {},
  },
  argTypes: {
    debounceMs: {
      control: { type: "number", min: 0, max: 2000, step: 50 },
      description:
        "useTableQueryState debounce for text/global filter commits (ms).",
    },
    fetchDelayMs: {
      control: { type: "number", min: 0, max: 3000, step: 50 },
      description: "Artificial mock API latency per request (ms).",
    },
  },
  render: (args: AllFeaturesArgs) => <AllFeaturesDemo {...args} />,
} as any

