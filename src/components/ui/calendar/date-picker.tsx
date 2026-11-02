import {
  endOfDay,
  endOfMonth,
  endOfQuarter,
  endOfWeek,
  endOfYear,
  format,
  isSameDay,
  startOfDay,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
} from "date-fns"
import { CalendarIcon, ChevronDown, X } from "lucide-react"
import * as React from "react"
import type { DateRange } from "react-day-picker"

import { cn, mergeStyles } from "../../../lib/utils"
import { Button, type ButtonSize } from "../button"
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "../popover"
import { Calendar } from "./calendar"
import styles from "./calendar.module.css"

const WEEK_STARTS_ON = 1 as const

export interface DateRangeRelativeFlags {
  showToday?: boolean
  showThisWeek?: boolean
  showThisMonth?: boolean
  showThisQuarter?: boolean
  showThisYear?: boolean
}

type RelativeDatePresetId =
  | "today"
  | "thisWeek"
  | "thisMonth"
  | "thisQuarter"
  | "thisYear"

const RELATIVE_DATE_PRESETS: Array<{
  id: RelativeDatePresetId
  label: string
  flag: keyof DateRangeRelativeFlags
  range: (now: Date) => DateRange
}> = [
  {
    id: "today",
    label: "Today",
    flag: "showToday",
    range: (now) => ({ from: startOfDay(now), to: endOfDay(now) }),
  },
  {
    id: "thisWeek",
    label: "This week",
    flag: "showThisWeek",
    range: (now) => ({
      from: startOfWeek(now, { weekStartsOn: WEEK_STARTS_ON }),
      to: endOfWeek(now, { weekStartsOn: WEEK_STARTS_ON }),
    }),
  },
  {
    id: "thisMonth",
    label: "This month",
    flag: "showThisMonth",
    range: (now) => ({ from: startOfMonth(now), to: endOfMonth(now) }),
  },
  {
    id: "thisQuarter",
    label: "This quarter",
    flag: "showThisQuarter",
    range: (now) => ({ from: startOfQuarter(now), to: endOfQuarter(now) }),
  },
  {
    id: "thisYear",
    label: "This year",
    flag: "showThisYear",
    range: (now) => ({ from: startOfYear(now), to: endOfYear(now) }),
  },
]

function isPresetActive(value: DateRange | undefined, range: DateRange) {
  if (!value?.from || !value.to || !range.from || !range.to) return false
  return isSameDay(value.from, range.from) && isSameDay(value.to, range.to)
}

interface SharedPickerProps {
  placeholder?: string
  disabled?: boolean
  id?: string
  className?: string
  /** date-fns format string for the trigger label. Default: `PPP`. */
  displayFormat?: string
  styleOverrides?: Record<string, string>
  size?: ButtonSize
  triggerClassName?: string
  popoverContentClassName?: string
  /** When set, replaces the calendar icon with a clear control while a value is selected. */
  showClearTrigger?: boolean
  onClear?: () => void
  clearAriaLabel?: string
  hideChevron?: boolean
  showPopoverClear?: boolean
  triggerTestId?: string
  closeOnSelect?: boolean
  /** Overrides the formatted date shown on the trigger (e.g. a menu-entered string). */
  triggerLabel?: string
}

export interface DatePickerProps extends SharedPickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
  id,
  className,
  displayFormat = "PPP",
  styleOverrides,
  size = "default",
  triggerClassName,
  popoverContentClassName,
  showClearTrigger = false,
  onClear,
  clearAriaLabel,
  hideChevron = false,
  showPopoverClear = false,
  triggerTestId = "ipa_date_picker_trigger",
  closeOnSelect = true,
  triggerLabel,
}: DatePickerProps) {
  const s = mergeStyles(styles, styleOverrides)
  const [open, setOpen] = React.useState(false)
  const hasValue = Boolean(value || triggerLabel)

  const clearSelection = React.useCallback(() => {
    onChange?.(undefined)
    onClear?.()
  }, [onChange, onClear])

  const handleClear = React.useCallback(
    (event?: React.MouseEvent | React.KeyboardEvent) => {
      event?.preventDefault()
      event?.stopPropagation()
      clearSelection()
      setOpen(false)
    },
    [clearSelection]
  )

  const leadingIcon =
    showClearTrigger && hasValue ? (
      <span
        role="button"
        aria-label={clearAriaLabel}
        tabIndex={0}
        className={cn(s.clearTriggerIcon, s.clearTriggerDestructive)}
        onClick={handleClear}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") handleClear(event)
        }}
      >
        <X aria-hidden />
      </span>
    ) : (
      <span className={s.clearTriggerIcon}>
        <CalendarIcon aria-hidden />
      </span>
    )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="secondary"
          size={size}
          disabled={disabled}
          data-empty={!hasValue}
          data-testid={triggerTestId}
          className={cn(
            hideChevron ? s.datePickerTriggerCompact : s.datePickerTrigger,
            triggerClassName,
            className
          )}
        >
          <span className={s.datePickerTriggerLabel}>
            {leadingIcon}
            {triggerLabel ?? (value ? format(value, displayFormat) : placeholder)}
          </span>
          {!hideChevron ? <ChevronDown aria-hidden /> : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn(s.datePickerContent, popoverContentClassName)}
        styleOverrides={styleOverrides}
      >
        <PopoverClose type="button" aria-label="Close" className={s.datePickerClose}>
          <X aria-hidden size={12} strokeWidth={2} />
        </PopoverClose>
        <Calendar
          mode="single"
          selected={value}
          defaultMonth={value}
          onSelect={(date) => {
            onChange?.(date)
            if (closeOnSelect) setOpen(false)
          }}
          styleOverrides={styleOverrides}
        />
        {showPopoverClear && value ? (
          <div className={s.datePickerResetRow}>
            <Button
              variant="secondary"
              size="sm"
              className={s.datePickerClear}
              onClick={() => clearSelection()}
            >
              Clear
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className={s.datePickerReset}
              onClick={() => handleClear()}
            >
              Reset
            </Button>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}

export interface DateRangePickerProps
  extends SharedPickerProps, DateRangeRelativeFlags {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  numberOfMonths?: number
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Pick a date range",
  disabled = false,
  id,
  className,
  displayFormat = "LLL dd, y",
  numberOfMonths = 2,
  styleOverrides,
  size = "default",
  triggerClassName,
  popoverContentClassName,
  showClearTrigger = false,
  onClear,
  clearAriaLabel,
  hideChevron = false,
  showPopoverClear = false,
  triggerTestId = "ipa_date_range_picker_trigger",
  closeOnSelect = false,
  showToday = false,
  showThisWeek = false,
  showThisMonth = false,
  showThisQuarter = false,
  showThisYear = false,
  triggerLabel,
}: DateRangePickerProps) {
  const s = mergeStyles(styles, styleOverrides)
  const [open, setOpen] = React.useState(false)
  const relativeFlags: DateRangeRelativeFlags = {
    showToday,
    showThisWeek,
    showThisMonth,
    showThisQuarter,
    showThisYear,
  }
  const visiblePresets = RELATIVE_DATE_PRESETS.filter(
    (preset) => relativeFlags[preset.flag]
  )

  const clearSelection = React.useCallback(() => {
    onChange?.(undefined)
    onClear?.()
  }, [onChange, onClear])

  const handleClear = React.useCallback(
    (event?: React.MouseEvent | React.KeyboardEvent) => {
      event?.preventDefault()
      event?.stopPropagation()
      clearSelection()
      setOpen(false)
    },
    [clearSelection]
  )

  const label = React.useMemo(() => {
    if (triggerLabel) return triggerLabel
    if (!value?.from) return placeholder
    if (value.to) {
      return `${format(value.from, displayFormat)} - ${format(value.to, displayFormat)}`
    }
    return format(value.from, displayFormat)
  }, [displayFormat, placeholder, triggerLabel, value])

  const hasValue = Boolean(value?.from || value?.to || triggerLabel)

  const leadingIcon =
    showClearTrigger && hasValue ? (
      <span
        role="button"
        aria-label={clearAriaLabel}
        tabIndex={0}
        className={cn(s.clearTriggerIcon, s.clearTriggerDestructive)}
        onClick={handleClear}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") handleClear(event)
        }}
      >
        <X aria-hidden />
      </span>
    ) : (
      <span className={s.clearTriggerIcon}>
        <CalendarIcon aria-hidden />
      </span>
    )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="secondary"
          size={size}
          disabled={disabled}
          data-empty={!hasValue}
          data-testid={triggerTestId}
          className={cn(
            hideChevron ? s.datePickerTriggerCompact : s.datePickerTrigger,
            triggerClassName,
            className
          )}
        >
          <span className={s.datePickerTriggerLabel}>
            {leadingIcon}
            {label}
          </span>
          {!hideChevron ? <ChevronDown aria-hidden /> : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn(s.datePickerContent, popoverContentClassName)}
        styleOverrides={styleOverrides}
      >
        <PopoverClose type="button" aria-label="Close" className={s.datePickerClose}>
          <X aria-hidden size={12} strokeWidth={2} />
        </PopoverClose>
        <Calendar
          mode="range"
          selected={value}
          defaultMonth={value?.from}
          numberOfMonths={numberOfMonths}
          onSelect={(range) => {
            onChange?.(range)
            if (closeOnSelect && range?.from && range?.to) setOpen(false)
          }}
          styleOverrides={styleOverrides}
        />
        {visiblePresets.length > 0 ? (
          <div className={s.relativeDateRow}>
            {visiblePresets.map((preset) => {
              const range = preset.range(new Date())
              const active = isPresetActive(value, range)
              return (
                <Button
                  key={preset.id}
                  type="button"
                  variant="default"
                  size="sm"
                  data-active={active || undefined}
                  className={s.relativeDateButton}
                  onClick={() => onChange?.(range)}
                >
                  {preset.label}
                </Button>
              )
            })}
          </div>
        ) : null}
        {showPopoverClear && hasValue ? (
          <div className={s.datePickerResetRow}>
            <Button
              variant="secondary"
              size="sm"
              className={s.datePickerClear}
              onClick={() => clearSelection()}
            >
              Clear
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className={s.datePickerReset}
              onClick={() => handleClear()}
            >
              Reset
            </Button>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}
