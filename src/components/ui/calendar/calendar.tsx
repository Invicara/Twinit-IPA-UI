import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import * as React from "react"
import {
  DayButton,
  DayPicker,
  getDefaultClassNames,
} from "react-day-picker"

import { cn, mergeStyles } from "../../../lib/utils"
import styles from "./calendar.module.css"

function CalendarDayButton({
  className,
  day,
  modifiers,
  styles: s,
  ...props
}: React.ComponentProps<typeof DayButton> & { styles: Record<string, string> }) {
  const ref = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  const isRangeEndpoint =
    modifiers.range_start || modifiers.range_end || modifiers.range_middle
  const isSelectedSingle =
    modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle

  return (
    <button
      ref={ref}
      type="button"
      data-testid="ipa_calendar_day"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={isSelectedSingle}
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      data-outside={modifiers.outside}
      data-focused={modifiers.focused}
      data-today={modifiers.today}
      data-disabled={modifiers.disabled}
      disabled={modifiers.disabled}
      className={cn(
        s.dayButton,
        modifiers.outside && !isSelectedSingle && !isRangeEndpoint && s.dayButtonOutside,
        className
      )}
      {...props}
    />
  )
}

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  styleOverrides?: Record<string, string>
}

function Calendar({
  className,
  styleOverrides,
  classNames,
  showOutsideDays = true,
  captionLayout = "dropdown",
  formatters,
  components,
  showWeekNumber,
  navLayout = "around",
  ...props
}: CalendarProps) {
  const s = mergeStyles(styles, styleOverrides)
  const defaultClassNames = getDefaultClassNames()
  const usesInlineNav = navLayout === "around"

  return (
    <DayPicker
      data-testid="ipa_calendar"
      showOutsideDays={showOutsideDays}
      className={cn(
        s.calendar,
        usesInlineNav ? s.calendarNavAround : s.calendarNavBar,
        className
      )}
      captionLayout={captionLayout}
      navLayout={navLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn(s.root, defaultClassNames.root, classNames?.root),
        months: cn(s.months, defaultClassNames.months, classNames?.months),
        month: cn(
          s.month,
          usesInlineNav && s.monthInlineNavHeader,
          defaultClassNames.month,
          classNames?.month
        ),
        nav: cn(s.nav, defaultClassNames.nav, classNames?.nav),
        button_previous: cn(
          s.navButton,
          defaultClassNames.button_previous,
          classNames?.button_previous
        ),
        button_next: cn(
          s.navButton,
          defaultClassNames.button_next,
          classNames?.button_next
        ),
        month_caption: cn(
          s.monthCaption,
          usesInlineNav ? s.monthCaptionInlineNav : s.monthCaptionBarNav,
          defaultClassNames.month_caption,
          classNames?.month_caption
        ),
        dropdowns: cn(s.dropdowns, defaultClassNames.dropdowns, classNames?.dropdowns),
        dropdown_root: cn(
          s.dropdownRoot,
          defaultClassNames.dropdown_root,
          classNames?.dropdown_root
        ),
        dropdown: cn(s.dropdown, defaultClassNames.dropdown, classNames?.dropdown),
        caption_label: cn(
          s.captionLabel,
          captionLayout === "label" ? s.captionLabelText : s.captionLabelDropdown,
          defaultClassNames.caption_label,
          classNames?.caption_label
        ),
        month_grid: cn(s.monthGrid, defaultClassNames.month_grid, classNames?.month_grid),
        weekdays: cn(s.weekdays, defaultClassNames.weekdays, classNames?.weekdays),
        weekday: cn(s.weekday, defaultClassNames.weekday, classNames?.weekday),
        week: cn(s.week, defaultClassNames.week, classNames?.week),
        week_number_header: cn(
          s.weekNumberHeader,
          defaultClassNames.week_number_header,
          classNames?.week_number_header
        ),
        week_number: cn(s.weekNumber, defaultClassNames.week_number, classNames?.week_number),
        day: cn(s.day, defaultClassNames.day, classNames?.day),
        range_start: cn(s.rangeStart, defaultClassNames.range_start, classNames?.range_start),
        range_middle: cn(
          s.rangeMiddle,
          defaultClassNames.range_middle,
          classNames?.range_middle
        ),
        range_end: cn(s.rangeEnd, defaultClassNames.range_end, classNames?.range_end),
        today: cn(s.today, defaultClassNames.today, classNames?.today),
        outside: cn(s.outside, defaultClassNames.outside, classNames?.outside),
        disabled: cn(s.disabled, defaultClassNames.disabled, classNames?.disabled),
        hidden: cn(s.hidden, defaultClassNames.hidden, classNames?.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className: rootClassName, rootRef, ...rootProps }) => (
          <div
            data-slot="calendar"
            ref={rootRef}
            className={cn(rootClassName)}
            {...rootProps}
          />
        ),
        Chevron: ({ className: chevronClassName, orientation, ...chevronProps }) => {
          if (orientation === "left") {
            return (
              <ChevronLeft
                className={cn(s.chevronIcon, chevronClassName)}
                aria-hidden
                {...chevronProps}
              />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRight
                className={cn(s.chevronIcon, chevronClassName)}
                aria-hidden
                {...chevronProps}
              />
            )
          }

          return (
            <ChevronDown
              className={cn(s.chevronIconSmall, chevronClassName)}
              aria-hidden
              {...chevronProps}
            />
          )
        },
        DayButton: (dayButtonProps) => (
          <CalendarDayButton {...dayButtonProps} styles={s} />
        ),
        WeekNumber: ({ children, ...weekProps }) => (
          <th {...weekProps}>
            <div className={s.weekNumber}>{children}</div>
          </th>
        ),
        ...components,
      }}
      showWeekNumber={showWeekNumber}
      {...props}
    />
  )
}

Calendar.displayName = "Calendar"

export { Calendar, CalendarDayButton }
