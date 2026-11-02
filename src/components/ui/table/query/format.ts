import { format, isValid, parse, startOfDay } from "date-fns"

const DATE_INPUT_FORMATS = [
  "MMM d, yyyy",
  "MMMM d, yyyy",
  "MMM d yyyy",
  "d MMM yyyy",
  "d MMMM yyyy",
  "do MMM yyyy",
  "do MMMM yyyy",
  "MMM do, yyyy",
  "MMMM do, yyyy",
  "yyyy-MM-dd",
  "yyyy/MM/dd",
  "dd/MM/yyyy",
  "d/M/yyyy",
  "MM/dd/yyyy",
  "M/d/yyyy",
  "dd-MM-yyyy",
  "d-M-yyyy",
  "do MMM",
  "d MMM",
  "MMM d",
  "MMMM d",
]

function parseWithFormats(input: string, reference: Date): Date | undefined {
  for (const dateFormat of DATE_INPUT_FORMATS) {
    const parsed = parse(input, dateFormat, reference)
    if (isValid(parsed)) return startOfDay(parsed)
  }
  return undefined
}

/** Day-first numeric dates: `14-11-2023`, `9.1.23`, `09 01 23`, etc. */
const DAY_FIRST_NUMERIC =
  /^(\d{1,2})[.\-\/\s]+(\d{1,2})[.\-\/\s]+(\d{2}|\d{4})$/

function dateFromDayMonthYear(
  day: number,
  month: number,
  year: number
): Date | undefined {
  if (month < 1 || month > 12 || day < 1 || day > 31) return undefined
  const date = startOfDay(new Date(year, month - 1, day))
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined
  }
  return date
}

function parseDayFirstNumeric(input: string): Date | undefined {
  const match = DAY_FIRST_NUMERIC.exec(input)
  if (!match) return undefined

  const day = Number(match[1])
  const month = Number(match[2])
  const yearToken = match[3]
  const year = yearToken.length === 2 ? 2000 + Number(yearToken) : Number(yearToken)
  if (!Number.isFinite(day) || !Number.isFinite(month) || !Number.isFinite(year)) {
    return undefined
  }
  return dateFromDayMonthYear(day, month, year)
}

/**
 * Parse a typed/calendar date into local midnight, or `undefined` if unparseable.
 *
 * Numeric strings are day-first (D-M-Y). Separators may be `-`, space, `.`, or `/`.
 * Day and month may be one or two digits (`9` / `09`). Two-digit years map to 20xx
 * (`14-11-23` → 14 Nov 2023). Also accepts named months (`Jan 12, 2023`) and ISO `yyyy-MM-dd`.
 */
export function parseTableDateInput(
  raw: Date | number | string | undefined
): Date | undefined {
  if (raw === undefined || raw === null || raw === "") return undefined

  if (raw instanceof Date) {
    return Number.isNaN(raw.getTime()) ? undefined : startOfDay(raw)
  }

  if (typeof raw === "number") {
    const date = new Date(raw)
    return Number.isNaN(date.getTime()) ? undefined : startOfDay(date)
  }

  const trimmed = raw.trim()
  if (!trimmed) return undefined

  if (/^-?\d{11,13}$/.test(trimmed)) {
    const date = new Date(Number(trimmed))
    return Number.isNaN(date.getTime()) ? undefined : startOfDay(date)
  }

  const numeric = parseDayFirstNumeric(trimmed)
  if (numeric) return numeric

  const reference = new Date()
  const direct = parseWithFormats(trimmed, reference)
  if (direct) return direct

  const withoutOrdinals = trimmed.replace(/(\d+)(st|nd|rd|th)\b/gi, "$1")
  const titleCased = withoutOrdinals.replace(/\b[a-z]/g, (char) =>
    char.toUpperCase()
  )
  return (
    parseWithFormats(withoutOrdinals, reference) ??
    parseWithFormats(titleCased, reference)
  )
}

/**
 * Parse one date or a from–to pair. Split on ` - ` (spaces around the dash) or
 * ` to `; each side uses {@link parseTableDateInput}. Formats may be mixed
 * (`14-07-23 - 17-9-2025`). A single date becomes a same-day range.
 */
export function parseTableDateRangeInput(
  raw: string
): [Date, Date] | undefined {
  const trimmed = raw.trim()
  if (!trimmed) return undefined

  const parts = trimmed
    .split(/\s+[-–—]\s+|\s+to\s+/i)
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length >= 2) {
    const from = parseTableDateInput(parts[0])
    const to = parseTableDateInput(parts[1])
    if (from && to) return [from, to]
    return undefined
  }

  const single = parseTableDateInput(trimmed)
  if (!single) return undefined
  return [single, single]
}

export function formatTableDate(
  date: Date | number | string | undefined,
  dateFormat = "MMM d, yyyy"
) {
  if (date === undefined || date === null || date === "") return ""

  const value =
    typeof date === "number"
      ? new Date(date)
      : typeof date === "string" && /^-?\d{11,13}$/.test(date.trim())
        ? new Date(Number(date))
        : new Date(date)
  if (Number.isNaN(value.getTime())) return ""

  return format(value, dateFormat)
}
