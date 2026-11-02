import type { Column, Row } from "@tanstack/react-table"
import { PlusCircle, X } from "lucide-react"
import * as React from "react"

import { cn, mergeStyles } from "../../../../lib/utils"
import { Button } from "../../button"
import { Input } from "../../input"
import { Popover, PopoverContent, PopoverTrigger } from "../../popover"
import { Separator } from "../../separator"
import { Slider } from "../../slider"
import { useTableQueryControlsDisabled } from "../table-context"
import styles from "../table.module.css"
import { TablePopoverClose } from "./popover-close"
import { TableFilterResetButton } from "./reset-button"

type RangeValue = [number, number]

function parseValuesAsNumbers(value: unknown): RangeValue | undefined {
  if (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every((item) => typeof item === "number" || typeof item === "string")
  ) {
    return [Number(value[0]), Number(value[1])]
  }
  return undefined
}

/** Client-side `filterFn`: inclusive numeric range. Unparseable values match no rows. */
export function tableRangeFilterFn<TData>(
  row: Row<TData>,
  columnId: string,
  filterValue: unknown
): boolean {
  if (filterValue === undefined || filterValue === null || filterValue === "") {
    return true
  }
  const range = parseValuesAsNumbers(filterValue)
  if (!range || range.some((bound) => Number.isNaN(bound))) return false
  const n = Number(row.getValue(columnId))
  if (Number.isNaN(n)) return false
  return n >= Math.min(range[0], range[1]) && n <= Math.max(range[0], range[1])
}

Object.assign(tableRangeFilterFn, { autoRemove: () => false })

export interface TableSliderFilterProps<TData> {
  column: Column<TData, unknown>
  title?: string
  styleOverrides?: Record<string, string>
}

/** Generic numeric range filter (hours, currency, scores, …). Configure via `meta.range`, `meta.unit`, `meta.step`. */
export function TableSliderFilter<TData>({
  column,
  title,
  styleOverrides,
}: TableSliderFilterProps<TData>) {
  const s = mergeStyles(styles, styleOverrides)
  const queryControlsDisabled = useTableQueryControlsDisabled()
  const id = React.useId()
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (queryControlsDisabled) setOpen(false)
  }, [queryControlsDisabled])
  const rawFilterValue = column.getFilterValue()
  const columnFilterValue = parseValuesAsNumbers(rawFilterValue)
  const rawLabel =
    typeof rawFilterValue === "string" &&
    rawFilterValue.trim() !== "" &&
    columnFilterValue === undefined
      ? rawFilterValue
      : undefined
  const defaultRange = column.columnDef.meta?.range
  const unit = column.columnDef.meta?.unit

  const { min, max, step } = React.useMemo(() => {
    let minValue = 0
    let maxValue = 100

    if (defaultRange) {
      ;[minValue, maxValue] = defaultRange
    } else {
      const values = column.getFacetedMinMaxValues()
      if (values && values.length === 2) {
        const [facetMin, facetMax] = values
        if (typeof facetMin === "number" && typeof facetMax === "number") {
          minValue = facetMin
          maxValue = facetMax
        }
      }
    }

    const configuredStep = column.columnDef.meta?.step
    const rangeSize = maxValue - minValue
    const stepValue =
      configuredStep != null && configuredStep > 0
        ? configuredStep
        : rangeSize <= 20
          ? 1
          : rangeSize <= 100
            ? Math.ceil(rangeSize / 20)
            : Math.ceil(rangeSize / 50)

    return { min: minValue, max: maxValue, step: stepValue }
  }, [column, defaultRange])

  const range = columnFilterValue ?? [min, max]
  const isFiltered =
    Boolean(rawLabel) ||
    (columnFilterValue !== undefined &&
      (range[0] !== min || range[1] !== max))
  const rangeLabel = rawLabel ?? `${range[0]} to ${range[1]}${unit ?? ""}`

  const setRange = React.useCallback(
    (next: RangeValue) => {
      column.setFilterValue(next[0] === min && next[1] === max ? undefined : next)
    },
    [column, min, max]
  )

  const onReset = React.useCallback(
    (event?: React.MouseEvent | React.KeyboardEvent) => {
      event?.preventDefault()
      event?.stopPropagation()
      column.setFilterValue(undefined)
      setOpen(false)
    },
    [column]
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          disabled={queryControlsDisabled}
          className={cn(s.filterTrigger, isFiltered && s.filterTriggerActive)}
        >
          {isFiltered ? (
            <span
              role="button"
              aria-label={`Clear ${title} filter`}
              tabIndex={0}
              className={cn(s.filterTriggerIcon, s.filterTriggerClear)}
              onClick={onReset}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  onReset(event)
                }
              }}
            >
              <X aria-hidden />
            </span>
          ) : (
            <span className={s.filterTriggerIcon}>
              <PlusCircle aria-hidden />
            </span>
          )}
          {title}
          {isFiltered ? (
            <>
              <Separator
                orientation="vertical"
                className={s.filterTriggerSeparator}
              />
              <span className={s.filterTriggerValue}>{rangeLabel}</span>
            </>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className={s.filterPopoverContentWide}>
        <TablePopoverClose styleOverrides={styleOverrides} />
        <p className={s.filterFieldLabel}>{title}</p>
        <div className={s.filterNumberRow}>
          <div
            className={cn(s.filterNumberWrap, unit && s.filterNumberWrapWithUnit)}
          >
            <Input
              id={`${id}-from`}
              type="number"
              className={s.filterNumberInput}
              min={min}
              max={max}
              step={step}
              value={String(range[0])}
              aria-label={`${title ?? "Range"} from`}
              onChange={(event) =>
                setRange([Number(event.target.value), range[1]])
              }
            />
            {unit ? <span className={s.filterUnit}>{unit}</span> : null}
          </div>
          <div
            className={cn(s.filterNumberWrap, unit && s.filterNumberWrapWithUnit)}
          >
            <Input
              id={`${id}-to`}
              type="number"
              className={s.filterNumberInput}
              min={min}
              max={max}
              step={step}
              value={String(range[1])}
              aria-label={`${title ?? "Range"} to`}
              onChange={(event) =>
                setRange([range[0], Number(event.target.value)])
              }
            />
            {unit ? <span className={s.filterUnit}>{unit}</span> : null}
          </div>
        </div>
        <Slider
          range
          min={min}
          max={max}
          step={step}
          value={range}
          onValueChange={(value) => setRange([value[0], value[1]])}
          label=""
          minLabel=""
          maxLabel=""
          showValueInputs={false}
          aria-label={title ?? "Range"}
          styleOverrides={{ slider: s.filterSlider }}
        />
        {isFiltered ? (
          <div className={s.filterResetFooter}>
            <TableFilterResetButton
              styleOverrides={styleOverrides}
              onClick={() => {
                column.setFilterValue(undefined)
                setOpen(false)
              }}
            />
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}

/** Alias for {@link TableSliderFilter} — numeric range for hours, currency, scores, etc. */
export const TableRangeFilter = TableSliderFilter
