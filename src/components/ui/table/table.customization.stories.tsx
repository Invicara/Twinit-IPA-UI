import React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import type { Column, ColumnDef, Table as TanstackTable } from "@tanstack/react-table"
import {
  Table,
  TableColumnFilter,
  useColumnFilterControls,
  useTable,
  useTablePaginationControls,
  useTableSortControls,
  withColumnOrder,
  withFiltering,
  withPagination,
  withResizing,
  withSelection,
  withSorting,
  type TableColumnFilterProps,
} from "./index"

/**
 * Stress-test stories for table customization limits.
 *
 * “Chrome” here means the surrounding UI shell (toolbar, filters, pager,
 * selection bar) — not the browser. The table core is the TanStack instance;
 * chrome is whatever you mount around {@link Table.Grid} (or instead of it).
 */

type Review = {
  id: string
  title: string
  author: string
  category: string
  rating: number
  reviewedAt: number
}

const reviews: Review[] = [
  { id: "1", title: "Discrete Mathematics", author: "Ada Lovelace", category: "Math", rating: 5, reviewedAt: Date.parse("2023-01-12") },
  { id: "2", title: "Compilers", author: "Grace Hopper", category: "Systems", rating: 4, reviewedAt: Date.parse("2023-06-03") },
  { id: "3", title: "On Computable Numbers", author: "Alan Turing", category: "Theory", rating: 5, reviewedAt: Date.parse("2023-11-20") },
  { id: "4", title: "Orbital Mechanics", author: "Katherine Johnson", category: "Math", rating: 5, reviewedAt: Date.parse("2024-02-14") },
  { id: "5", title: "Hypertext Notes", author: "Tim Berners-Lee", category: "Web", rating: 3, reviewedAt: Date.parse("2023-05-01") },
  { id: "6", title: "Apollo Guidance", author: "Margaret Hamilton", category: "Systems", rating: 5, reviewedAt: Date.parse("2024-08-19") },
  { id: "7", title: "Kernel Diaries", author: "Linus Torvalds", category: "Systems", rating: 4, reviewedAt: Date.parse("2024-01-09") },
  { id: "8", title: "Abstract Data Types", author: "Barbara Liskov", category: "Theory", rating: 4, reviewedAt: Date.parse("2024-12-02") },
  { id: "9", title: "The Art of Computer Programming", author: "Donald Knuth", category: "Math", rating: 5, reviewedAt: Date.parse("2025-03-30") },
  { id: "10", title: "Python Origins", author: "Guido van Rossum", category: "Web", rating: 3, reviewedAt: Date.parse("2025-09-17") },
  { id: "11", title: "JavaScript Sketch", author: "Brendan Eich", category: "Web", rating: 2, reviewedAt: Date.parse("2023-11-05") },
  { id: "12", title: "Network Routing", author: "Radia Perlman", category: "Systems", rating: 4, reviewedAt: Date.parse("2026-04-22") },
]

const categoryOptions = ["Math", "Systems", "Theory", "Web"] as const

const lab = {
  page: {
    display: "grid",
    gridTemplateColumns: "240px 1fr",
    gap: 20,
    minHeight: 560,
    padding: 20,
    background: "linear-gradient(145deg, #1a1f1c 0%, #243028 45%, #1e2420 100%)",
    color: "#e7efe8",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    borderRadius: 12,
  } satisfies React.CSSProperties,
  side: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    padding: 14,
    background: "rgba(0,0,0,0.28)",
    border: "1px solid rgba(167, 243, 208, 0.2)",
    borderRadius: 8,
  } satisfies React.CSSProperties,
  main: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    minWidth: 0,
  } satisfies React.CSSProperties,
  label: {
    fontSize: 11,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#9cb4a4",
    marginBottom: 6,
  } satisfies React.CSSProperties,
  chip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 8px",
    borderRadius: 4,
    border: "1px solid rgba(167, 243, 208, 0.35)",
    background: "transparent",
    color: "#d7f5e3",
    cursor: "pointer",
    font: "inherit",
    fontSize: 12,
  } satisfies React.CSSProperties,
  chipOn: {
    background: "#0f3d2e",
    borderColor: "#5eead4",
    color: "#ecfdf5",
  } satisfies React.CSSProperties,
  starBtn: {
    background: "transparent",
    border: "none",
    padding: 0,
    cursor: "pointer",
    fontSize: 18,
    lineHeight: 1,
    color: "#fbbf24",
  } satisfies React.CSSProperties,
  note: {
    marginTop: 16,
    padding: 12,
    fontSize: 12,
    lineHeight: 1.5,
    color: "#b7c9bc",
    borderTop: "1px dashed rgba(167, 243, 208, 0.25)",
  } satisfies React.CSSProperties,
  card: {
    padding: 14,
    borderRadius: 8,
    border: "1px solid rgba(167, 243, 208, 0.22)",
    background: "rgba(8, 16, 12, 0.55)",
  } satisfies React.CSSProperties,
}

function Stars({
  value,
  max = 5,
  interactive = false,
  onPick,
  ariaLabel,
}: {
  value: number
  max?: number
  interactive?: boolean
  onPick?: (rating: number) => void
  ariaLabel?: string
}) {
  return (
    <span
      role={interactive ? "slider" : "img"}
      aria-label={ariaLabel ?? `${value} of ${max} stars`}
      aria-valuemin={interactive ? 0 : undefined}
      aria-valuemax={interactive ? max : undefined}
      aria-valuenow={interactive ? value : undefined}
      style={{ display: "inline-flex", gap: 2 }}
    >
      {Array.from({ length: max }, (_, index) => {
        const rating = index + 1
        const filled = rating <= value
        if (!interactive) {
          return (
            <span key={rating} aria-hidden style={{ opacity: filled ? 1 : 0.28 }}>
              ★
            </span>
          )
        }
        return (
          <button
            key={rating}
            type="button"
            style={{
              ...lab.starBtn,
              opacity: filled ? 1 : 0.28,
            }}
            aria-label={`At least ${rating} stars`}
            onClick={() => onPick?.(rating === value ? 0 : rating)}
          >
            ★
          </button>
        )
      })}
    </span>
  )
}

/** Filter paired with the star cell: stores a minimum rating number. */
function MinRatingFilter({
  column,
  title,
}: TableColumnFilterProps<Review>) {
  const filter = useColumnFilterControls<Review, number>(column)
  const min = typeof filter.value === "number" ? filter.value : 0

  return (
    <div>
      <div style={lab.label}>{title ?? "Min rating"}</div>
      <Stars
        value={min}
        interactive
        ariaLabel="Minimum rating filter"
        onPick={(rating) =>
          filter.setValue(rating > 0 ? rating : undefined)
        }
      />
      {filter.isActive ? (
        <button
          type="button"
          style={{ ...lab.chip, marginTop: 8 }}
          onClick={filter.clear}
        >
          Clear min
        </button>
      ) : null}
    </div>
  )
}

function CategoryRailFilter({
  column,
  title,
}: TableColumnFilterProps<Review>) {
  const filter = useColumnFilterControls<Review, string[]>(column)
  const selected = new Set(filter.value ?? [])

  return (
    <div>
      <div style={lab.label}>{title ?? "Category"}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {categoryOptions.map((category) => {
          const on = selected.has(category)
          return (
            <button
              key={category}
              type="button"
              style={{ ...lab.chip, ...(on ? lab.chipOn : {}) }}
              onClick={() => {
                const next = new Set(selected)
                if (on) next.delete(category)
                else next.add(category)
                filter.setValue(next.size ? Array.from(next) : undefined)
              }}
            >
              {category}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function DecadeDialFilter({
  column,
  title,
}: TableColumnFilterProps<Review>) {
  const raw = column.getFilterValue()
  const [from, to] = Array.isArray(raw) ? raw : []
  const activeYear = from ? new Date(Number(from)).getFullYear() : null

  const applyYear = (year: number) => {
    column.setFilterValue([
      String(Date.parse(`${year}-01-01`)),
      String(Date.parse(`${year}-12-31`)),
    ])
  }

  return (
    <div>
      <div style={lab.label}>{title ?? "Review year"}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {[2023, 2024, 2025, 2026].map((year) => (
          <button
            key={year}
            type="button"
            style={{
              ...lab.chip,
              justifyContent: "center",
              ...(activeYear === year ? lab.chipOn : {}),
            }}
            onClick={() =>
              activeYear === year
                ? column.setFilterValue(undefined)
                : applyYear(year)
            }
          >
            {year}
          </button>
        ))}
      </div>
    </div>
  )
}

function SearchStrip({ table }: { table: TanstackTable<Review> }) {
  const value = String(table.getState().globalFilter ?? "")
  return (
    <label style={{ display: "block" }}>
      <div style={lab.label}>Search board</div>
      <input
        value={value}
        placeholder="type to filter rows…"
        onChange={(event) => table.setGlobalFilter(event.target.value)}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "10px 12px",
          borderRadius: 6,
          border: "1px solid rgba(167, 243, 208, 0.35)",
          background: "#0b1210",
          color: "#e7efe8",
          font: "inherit",
        }}
      />
    </label>
  )
}

function SortRail({ table }: { table: TanstackTable<Review> }) {
  const sort = useTableSortControls(table)
  const sortable = table
    .getAllColumns()
    .filter((column) => column.getCanSort() && column.id !== "select")

  return (
    <div>
      <div style={lab.label}>Sort (custom)</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {sortable.map((column) => {
          const state = sort.isSorted(column.id)
          const label = column.columnDef.meta?.label ?? column.id
          return (
            <button
              key={column.id}
              type="button"
              style={{
                ...lab.chip,
                justifyContent: "space-between",
                ...(state ? lab.chipOn : {}),
              }}
              onClick={() => sort.toggleSort(column.id)}
            >
              <span>{label}</span>
              <span>{state === "asc" ? "↑" : state === "desc" ? "↓" : "·"}</span>
            </button>
          )
        })}
        {sort.sorting.length > 0 ? (
          <button type="button" style={lab.chip} onClick={sort.clearSorting}>
            Clear sort
          </button>
        ) : null}
      </div>
    </div>
  )
}

function VisibilityRail({ table }: { table: TanstackTable<Review> }) {
  const hideable = table
    .getAllColumns()
    .filter((column) => column.getCanHide() && column.id !== "select")

  return (
    <div>
      <div style={lab.label}>Columns (custom)</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {hideable.map((column) => (
          <label
            key={column.id}
            style={{ ...lab.chip, cursor: "pointer" }}
          >
            <input
              type="checkbox"
              checked={column.getIsVisible()}
              onChange={column.getToggleVisibilityHandler()}
            />
            {column.columnDef.meta?.label ?? column.id}
          </label>
        ))}
      </div>
    </div>
  )
}

function WeirdPager({ table }: { table: TanstackTable<Review> }) {
  const pagination = useTablePaginationControls(table)
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "10px 12px",
        borderRadius: 8,
        border: "1px dashed rgba(167, 243, 208, 0.35)",
        background: "rgba(0,0,0,0.22)",
      }}
    >
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {Array.from({ length: pagination.pageCount }, (_, index) => {
          const page = index + 1
          const on = page === pagination.page
          return (
            <button
              key={page}
              type="button"
              aria-label={`Go to page ${page}`}
              aria-current={on ? "page" : undefined}
              disabled={pagination.disabled}
              onClick={() => pagination.setPage(page)}
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: on
                  ? "2px solid #5eead4"
                  : "1px solid rgba(167, 243, 208, 0.35)",
                background: on ? "#0f3d2e" : "transparent",
                color: "#e7efe8",
                cursor: "pointer",
                font: "inherit",
                fontSize: 11,
              }}
            >
              {page}
            </button>
          )
        })}
      </div>
      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
        size
        <select
          value={pagination.pageSize}
          disabled={pagination.disabled}
          onChange={(event) =>
            pagination.setPageSize(Number(event.target.value))
          }
          style={{
            background: "#0b1210",
            color: "#e7efe8",
            border: "1px solid rgba(167, 243, 208, 0.35)",
            borderRadius: 4,
            padding: "4px 6px",
            font: "inherit",
          }}
        >
          {[4, 6, 12].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}

function SelectionDock({ table }: { table: TanstackTable<Review> }) {
  const selected = table.getSelectedRowModel().rows
  if (selected.length === 0) return null

  return (
    <div
      style={{
        position: "sticky",
        bottom: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "10px 14px",
        borderRadius: 999,
        background: "#ecfdf5",
        color: "#064e3b",
        boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
      }}
    >
      <strong style={{ fontSize: 13 }}>
        {selected.length} queued for archive
      </strong>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          style={{ ...lab.chip, color: "#064e3b", borderColor: "#059669" }}
          onClick={() => table.resetRowSelection()}
        >
          Unqueue
        </button>
        <button
          type="button"
          style={{
            ...lab.chip,
            ...lab.chipOn,
            color: "#ecfdf5",
          }}
          onClick={() =>
            window.alert(
              `Archive: ${selected.map((row) => row.original.title).join(", ")}`
            )
          }
        >
          Archive
        </button>
      </div>
    </div>
  )
}

function FilterSidebar({ table }: { table: TanstackTable<Review> }) {
  const rating = table.getColumn("rating")
  const category = table.getColumn("category")
  const reviewedAt = table.getColumn("reviewedAt")

  return (
    <aside style={lab.side}>
      <SearchStrip table={table} />
      {rating ? <MinRatingFilter column={rating} title="Min stars" /> : null}
      {category ? (
        <CategoryRailFilter column={category} title="Topics" />
      ) : null}
      {reviewedAt ? (
        <DecadeDialFilter column={reviewedAt} title="Year dial" />
      ) : null}
      <SortRail table={table} />
      <VisibilityRail table={table} />
      <button
        type="button"
        style={lab.chip}
        onClick={() => {
          table.resetColumnFilters()
          table.setGlobalFilter("")
          table.resetSorting()
          table.resetColumnVisibility()
        }}
      >
        Reset all controls
      </button>
    </aside>
  )
}

function reviewColumns(): ColumnDef<Review>[] {
  return [
    {
      accessorKey: "title",
      header: () => <span style={{ letterSpacing: "0.06em" }}>TITLE</span>,
      cell: ({ getValue, row }) => (
        <div>
          <div style={{ fontWeight: 600 }}>{getValue<string>()}</div>
          <div style={{ fontSize: 11, color: "#9cb4a4" }}>
            {row.original.author}
          </div>
        </div>
      ),
      meta: { label: "Title", variant: "text" },
      enableColumnFilter: true,
      enableHiding: true,
    },
    {
      accessorKey: "category",
      header: () => <span>TOPIC</span>,
      cell: ({ getValue }) => (
        <span style={{ ...lab.chip, cursor: "default" }}>{getValue<string>()}</span>
      ),
      meta: {
        label: "Category",
        variant: "multiSelect",
        filter: CategoryRailFilter,
      },
      enableColumnFilter: true,
      enableHiding: true,
      filterFn: (row, id, value: string[]) => {
        if (!value?.length) return true
        return value.includes(String(row.getValue(id)))
      },
    },
    {
      accessorKey: "rating",
      header: () => <span>RATING</span>,
      cell: ({ getValue }) => <Stars value={getValue<number>()} />,
      meta: {
        label: "Rating",
        variant: "number",
        // Same semantic field as the cell — filter speaks “min stars”.
        filter: MinRatingFilter,
      },
      enableColumnFilter: true,
      enableHiding: true,
      filterFn: (row, id, value: number) => {
        if (value == null) return true
        return Number(row.getValue(id)) >= Number(value)
      },
      sortingFn: "basic",
    },
    {
      accessorKey: "reviewedAt",
      header: () => <span>WHEN</span>,
      cell: ({ getValue }) =>
        new Date(getValue<number>()).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
        }),
      meta: {
        label: "Reviewed",
        variant: "dateRange",
        filter: DecadeDialFilter,
      },
      enableColumnFilter: true,
      enableHiding: true,
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
  ]
}

const meta = {
  title: "ui/Table/Customization Lab",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Probes customization limits: custom chrome, layout, cells, and filters wired through controllers / meta.filter / feature slices. Gaps worth noticing are listed in each story.",
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj

/**
 * Full feature stack + entirely custom chrome around Table.Grid.
 * Layout is a sidebar laboratory, not the stock toolbar/footer.
 */
export const MaxCustomChrome: Story = {
  name: "Max custom chrome (grid + sidebar)",
  render: () => {
    const columns = React.useMemo(() => reviewColumns(), [])

    const table = useTable({
      data: reviews,
      columns,
      features: [
        withSelection(),
        withSorting({ enableMultiSort: true }),
        withFiltering({ faceting: true }),
        withPagination(),
        withResizing({ columnResizeMode: "onChange" }),
        withColumnOrder(),
      ],
      initialState: {
        pagination: { pageSize: 4, pageIndex: 0 },
        sorting: [{ id: "rating", desc: true }],
      },
      getRowId: (row) => row.id,
    })

    return (
      <div style={lab.page}>
        <FilterSidebar table={table} />
        <div style={lab.main}>
          <header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>Review lab</div>
              <div style={{ fontSize: 12, color: "#9cb4a4" }}>
                Stock Table.Toolbar / Table.Pagination not used — only controllers
                + Table.Grid.
              </div>
            </div>
            <div style={{ fontSize: 12, color: "#9cb4a4" }}>
              {table.getFilteredRowModel().rows.length} matches · page{" "}
              {table.getState().pagination.pageIndex + 1}/
              {table.getPageCount()}
            </div>
          </header>

          <Table
            table={table}
            emptyMessage="No reviews in this slice."
          >
            <div
              style={{
                borderRadius: 8,
                overflow: "auto",
                border: "1px solid rgba(167, 243, 208, 0.2)",
                background: "rgba(0,0,0,0.2)",
              }}
            >
              <Table.Grid />
            </div>
          </Table>

          <WeirdPager table={table} />
          <SelectionDock table={table} />

          <div style={lab.note}>
            <strong>Flexibility shown:</strong> feature slices,{" "}
            <code>meta.filter</code> + controller hooks, custom pager/selection
            dock, sidebar layout, star cell ↔ min-star filter pair, year dial
            writing dateRange values, column visibility, multi-sort, resize,
            drag reorder.
            <br />
            <strong>Gaps to notice:</strong> selection still injects the stock
            checkbox column into the grid; header cells still use library header
            chrome when <code>withColumnOrder</code>/<code>withResizing</code>{" "}
            are composed;{" "}
            <code>Table.Grid</code> styling is tied to module CSS (hard to fully
            restyle without <code>styleOverrides</code> / forking); sidebar
            filters bypass the toolbar registry (fine) but duplicate wiring if
            you also mount <code>Table.Filters</code> in the toolbar.
          </div>
        </div>
      </div>
    )
  },
}

/**
 * No Table.Grid at all — table instance is only a state machine.
 * Renders a card board to prove chrome/layout are fully replaceable.
 */
export const HeadlessCardBoard: Story = {
  name: "Headless card board (no Table.Grid)",
  render: () => {
    const columns = React.useMemo(() => reviewColumns(), [])

    const table = useTable({
      data: reviews,
      columns,
      features: [
        withSelection({ column: false }),
        withSorting(),
        withFiltering(),
        withPagination(),
      ],
      initialState: {
        pagination: { pageSize: 6, pageIndex: 0 },
        sorting: [{ id: "reviewedAt", desc: true }],
      },
      getRowId: (row) => row.id,
    })

    const rows = table.getRowModel().rows
    const pagination = useTablePaginationControls(table)

    return (
      <Table table={table}>
      <div style={{ ...lab.page, gridTemplateColumns: "1fr" }}>
        <div style={lab.main}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 280px",
              gap: 16,
            }}
          >
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
                Card board (headless)
              </div>
              <SearchStrip table={table} />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: 12,
                  marginTop: 14,
                }}
              >
                {rows.length === 0 ? (
                  <div style={lab.card}>No cards match.</div>
                ) : (
                  rows.map((row) => {
                    const review = row.original
                    return (
                      <article
                        key={row.id}
                        style={{
                          ...lab.card,
                          outline: row.getIsSelected()
                            ? "2px solid #5eead4"
                            : undefined,
                        }}
                      >
                        <label
                          style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                            marginBottom: 8,
                            fontSize: 12,
                            color: "#9cb4a4",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={row.getIsSelected()}
                            onChange={row.getToggleSelectedHandler()}
                            aria-label={`Select ${review.title}`}
                          />
                          queue
                        </label>
                        <div style={{ fontWeight: 700, marginBottom: 4 }}>
                          {review.title}
                        </div>
                        <div style={{ fontSize: 12, color: "#9cb4a4" }}>
                          {review.author} · {review.category}
                        </div>
                        <div style={{ marginTop: 10 }}>
                          <Stars value={review.rating} />
                        </div>
                        <div
                          style={{
                            marginTop: 8,
                            fontSize: 11,
                            color: "#9cb4a4",
                          }}
                        >
                          {new Date(review.reviewedAt).getFullYear()}
                        </div>
                      </article>
                    )
                  })
                )}
              </div>
            </div>

            <aside style={lab.side}>
              <MinRatingFilter
                column={table.getColumn("rating") as Column<Review, unknown>}
                title="Min stars"
              />
              <CategoryRailFilter
                column={table.getColumn("category") as Column<Review, unknown>}
                title="Topics"
              />
              <DecadeDialFilter
                column={
                  table.getColumn("reviewedAt") as Column<Review, unknown>
                }
                title="Year dial"
              />
              <SortRail table={table} />
              <WeirdPager table={table} />
              <div style={{ fontSize: 11, color: "#9cb4a4" }}>
                Page {pagination.page} / {pagination.pageCount} ·{" "}
                {table.getFilteredRowModel().rows.length} filtered
              </div>
            </aside>
          </div>

          <SelectionDock table={table} />

          <div style={lab.note}>
            <strong>Flexibility shown:</strong> zero library chrome — cards,
            custom checkboxes, sidebar filters/sort/pager all driven by the
            same <code>useTable</code> instance + controllers.
            <br />
            <strong>Gaps to notice:</strong> use{" "}
            <code>withSelection({"{ column: false }"})</code> so cards do not
            get a hidden select column; no first-class “selection UI” primitive
            for non-grid layouts; column <code>meta.filter</code> is unused
            here because we mount filters manually (registry only helps
            toolbar-driven layouts); resizing / column DnD are grid-header
            concerns and do not apply to cards.
          </div>
        </div>
      </div>
      </Table>
    )
  },
}

/**
 * Intentionally awkward: stock toolbar registry + custom filterComponents map
 * + meta.filter override on one column, to compare override precedence.
 */
export const RegistryOverrideMatrix: Story = {
  name: "Filter registry override matrix",
  render: () => {
    const columns = React.useMemo(() => reviewColumns(), [])
    const table = useTable({
      data: reviews,
      columns,
      features: [withFiltering(), withPagination(), withSorting()],
      initialState: { pagination: { pageSize: 5, pageIndex: 0 } },
      getRowId: (row) => row.id,
    })

    const ratingCol = table.getColumn("rating")

    function LoudNumberFilter({
      column,
      title,
    }: TableColumnFilterProps<Review>) {
      const filter = useColumnFilterControls<Review, number>(column)
      return (
        <button
          type="button"
          style={{ ...lab.chip, ...lab.chipOn, width: "100%" }}
          onClick={() => filter.setValue(filter.value === 3 ? undefined : 3)}
        >
          {title}: variant map says “≥3” {filter.isActive ? "(on)" : "(off)"}
        </button>
      )
    }

    return (
      <Table table={table} emptyMessage="No rows.">
        <div style={{ ...lab.page, gridTemplateColumns: "1fr" }}>
          <div style={lab.main}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>
            Override precedence
          </div>
          <p style={{ fontSize: 13, color: "#b7c9bc", maxWidth: 780 }}>
            Order: <code>meta.filter</code> → toolbar{" "}
            <code>filterComponents[variant]</code> → built-in default. Rating
            keeps <code>meta.filter = MinRatingFilter</code>, so a toolbar map
            entry for <code>number</code> should <em>not</em> win on that
            column.
          </p>

          <div style={lab.card}>
            <div style={lab.label}>Toolbar with filterComponents.number override</div>
            <Table.Toolbar>
              <Table.Filters
                components={{
                  number: LoudNumberFilter,
                }}
              />
            </Table.Toolbar>
            <p style={{ fontSize: 12, color: "#9cb4a4", marginTop: 8 }}>
              Expect star min-filter for Rating (meta wins), not the loud
              “≥3” button. Category / year still use their meta.filter
              components when the toolbar resolves them.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: 12,
            }}
          >
            <div style={lab.card}>
              <div style={lab.label}>TableColumnFilter (resolved)</div>
              {ratingCol ? (
                <TableColumnFilter column={ratingCol} />
              ) : null}
            </div>
            <div style={lab.card}>
              <div style={lab.label}>Same + components.number override</div>
              {ratingCol ? (
                <TableColumnFilter
                  column={ratingCol}
                  components={{ number: LoudNumberFilter }}
                />
              ) : null}
              <p style={{ fontSize: 11, color: "#9cb4a4", marginTop: 8 }}>
                Still stars — meta.filter beats the map.
              </p>
            </div>
            <div style={lab.card}>
              <div style={lab.label}>Cell contract</div>
              <Stars value={4} />
              <div style={{ fontSize: 11, color: "#9cb4a4", marginTop: 8 }}>
                filterFn: rating &gt;= number
              </div>
            </div>
          </div>

          <div
            style={{
              borderRadius: 8,
              overflow: "auto",
              border: "1px solid rgba(167, 243, 208, 0.2)",
            }}
          >
            <Table.Grid />
          </div>

          <div style={lab.note}>
            <strong>Gap:</strong> toolbar column filters render in a horizontal
            strip only — no layout prop for “sidebar” or “stacked”. Sidebars
            must mount <code>TableColumnFilter</code> / custom controls
            manually (as in the other lab stories).
          </div>
          </div>
        </div>
      </Table>
    )
  },
}
