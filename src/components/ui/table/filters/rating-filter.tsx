import type { Column, Row } from "@tanstack/react-table"
import { X } from "lucide-react"
import * as React from "react"

import { cn, mergeStyles } from "../../../../lib/utils"
import { Button } from "../../button"
import { useColumnFilterControls } from "../controls"
import { useTableQueryControlsDisabled } from "../table-context"
import styles from "../table.module.css"

const DEFAULT_MAX_STARS = 5

export function parseRatingFilterValue(raw: unknown): number {
  if (typeof raw === "number") return raw
  if (typeof raw === "string") return Number(raw) || 0
  if (
    raw &&
    typeof raw === "object" &&
    "value" in raw &&
    (raw as { value: unknown }).value != null
  ) {
    return Number((raw as { value: unknown }).value) || 0
  }
  return 0
}

/** Client-side `filterFn`: keep rows whose rating is at least the selected min. */
export function tableRatingFilterFn<TData>(
  row: Row<TData>,
  columnId: string,
  filterValue: unknown
): boolean {
  const min = parseRatingFilterValue(filterValue)
  if (!min) return true
  return Number(row.getValue(columnId)) >= min
}

export interface TableRatingStarsProps {
  value: number
  max?: number
  interactive?: boolean
  onPick?: (rating: number) => void
  ariaLabel?: string
  className?: string
  styleOverrides?: Record<string, string>
}

/** Star row used by {@link TableRatingFilter} and rating cells. */
export function TableRatingStars({
  value,
  max = DEFAULT_MAX_STARS,
  interactive = false,
  onPick,
  ariaLabel,
  className,
  styleOverrides,
}: TableRatingStarsProps) {
  const s = mergeStyles(styles, styleOverrides)
  const [hoverRating, setHoverRating] = React.useState(0)
  const displayValue = interactive && hoverRating > 0 ? hoverRating : value

  return (
    <span
      role={interactive ? "slider" : "img"}
      aria-label={ariaLabel ?? `${value} of ${max} stars`}
      aria-valuemin={interactive ? 0 : undefined}
      aria-valuemax={interactive ? max : undefined}
      aria-valuenow={interactive ? value : undefined}
      className={cn(s.ratingStars, className)}
      onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
    >
      {Array.from({ length: max }, (_, index) => {
        const rating = index + 1
        const filled = rating <= displayValue
        const star = (
          <span
            aria-hidden
            data-filled={filled || undefined}
            className={cn(s.ratingStar, filled && s.ratingStarFilled)}
          >
            ★
          </span>
        )
        if (!interactive) {
          return <React.Fragment key={rating}>{star}</React.Fragment>
        }
        return (
          <span
            key={rating}
            role="button"
            tabIndex={0}
            aria-label={`At least ${rating} stars`}
            className={s.ratingStarButton}
            onMouseEnter={() => setHoverRating(rating)}
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              onPick?.(rating === value ? 0 : rating)
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                event.stopPropagation()
                onPick?.(rating === value ? 0 : rating)
              }
            }}
          >
            {star}
          </span>
        )
      })}
    </span>
  )
}

export interface TableRatingFilterProps<TData> {
  column: Column<TData, unknown>
  title?: string
  styleOverrides?: Record<string, string>
}

/**
 * Minimum-star filter (`variant: "rating"`). Writes a `gte` query filter so
 * server-mode mocks / APIs compare `rating >= n`.
 */
export function TableRatingFilter<TData>({
  column,
  title,
  styleOverrides,
}: TableRatingFilterProps<TData>) {
  const s = mergeStyles(styles, styleOverrides)
  const queryControlsDisabled = useTableQueryControlsDisabled()
  const filter = useColumnFilterControls<TData, unknown>(column)
  const min = parseRatingFilterValue(filter.value)
  const isActive = min > 0
  const max =
    column.columnDef.meta?.range?.[1] && column.columnDef.meta.range[1] > 0
      ? column.columnDef.meta.range[1]
      : DEFAULT_MAX_STARS

  const setMin = React.useCallback(
    (rating: number) => {
      if (rating <= 0) {
        filter.clear()
        return
      }
      column.setFilterValue({
        operator: "gte",
        value: String(rating),
        variant: "rating",
        filterId: `${column.id}-gte`,
      })
    },
    [column, filter]
  )

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      disabled={queryControlsDisabled}
      className={cn(s.filterTrigger, isActive && s.filterTriggerActive)}
    >
      {isActive ? (
        <span
          role="button"
          aria-label={`Clear ${title ?? "Rating"} filter`}
          tabIndex={0}
          className={cn(s.filterTriggerIcon, s.filterTriggerClear)}
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            filter.clear()
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault()
              event.stopPropagation()
              filter.clear()
            }
          }}
        >
          <X aria-hidden />
        </span>
      ) : null}
      {title ?? "Rating"}
      <TableRatingStars
        value={min}
        max={max}
        interactive={!queryControlsDisabled}
        ariaLabel="Minimum rating filter"
        onPick={setMin}
        styleOverrides={styleOverrides}
      />
    </Button>
  )
}
