import { parseTableDateInput, parseTableDateRangeInput } from "./format"

function expectLocalDay(
  parsed: Date | undefined,
  year: number,
  monthIndex: number,
  day: number
) {
  expect(parsed?.getFullYear()).toBe(year)
  expect(parsed?.getMonth()).toBe(monthIndex)
  expect(parsed?.getDate()).toBe(day)
}

describe("parseTableDateInput", () => {
  it("parses the table display format", () => {
    expectLocalDay(parseTableDateInput("Jan 12, 2023"), 2023, 0, 12)
  })

  it.each([
    ["14-11-2023", 2023, 10, 14],
    ["14 11 2023", 2023, 10, 14],
    ["14.11.2023", 2023, 10, 14],
    ["14-11-23", 2023, 10, 14],
    ["14 11 23", 2023, 10, 14],
    ["14.11.23", 2023, 10, 14],
  ])("parses day-first numeric %s", (input, year, monthIndex, day) => {
    expectLocalDay(parseTableDateInput(input), year, monthIndex, day)
  })

  it.each([
    ["01/02/2024", 2024, 1, 1],
    ["01-02-2024", 2024, 1, 1],
    ["01 02 2024", 2024, 1, 1],
    ["1/2/2024", 2024, 1, 1],
    ["01.02.2024", 2024, 1, 1],
  ])("parses day-first slash, dash, and space dates %s", (input, year, monthIndex, day) => {
    expectLocalDay(parseTableDateInput(input), year, monthIndex, day)
  })

  it.each([
    ["09-01-2023", 2023, 0, 9],
    ["9-1-2023", 2023, 0, 9],
    ["09.1.23", 2023, 0, 9],
    ["9 01 23", 2023, 0, 9],
    ["07-7-2023", 2023, 6, 7],
    ["7.07.23", 2023, 6, 7],
  ])("accepts padded or unpadded day/month in %s", (input, year, monthIndex, day) => {
    expectLocalDay(parseTableDateInput(input), year, monthIndex, day)
  })

  it("returns undefined for free text", () => {
    expect(parseTableDateInput("whenever")).toBeUndefined()
  })
})

describe("parseTableDateRangeInput", () => {
  it("duplicates a single date into a same-day range", () => {
    const range = parseTableDateRangeInput("Jan 12, 2023")
    expect(range).toHaveLength(2)
    expect(range?.[0].getTime()).toBe(range?.[1].getTime())
    expect(range?.[0].getDate()).toBe(12)
  })

  it("parses a dashed pair", () => {
    const range = parseTableDateRangeInput("Jan 12, 2023 - Apr 3, 2023")
    expect(range?.[0].getMonth()).toBe(0)
    expect(range?.[0].getDate()).toBe(12)
    expect(range?.[1].getMonth()).toBe(3)
    expect(range?.[1].getDate()).toBe(3)
  })

  it.each([
    "01/02/2024",
    "01-02-2024",
    "01 02 2024",
  ])("turns a single numeric date %s into a same-day range", (input) => {
    const range = parseTableDateRangeInput(input)
    expect(range).toHaveLength(2)
    expect(range?.[0].getTime()).toBe(range?.[1].getTime())
    expect(range?.[0].getFullYear()).toBe(2024)
    expect(range?.[0].getMonth()).toBe(1)
    expect(range?.[0].getDate()).toBe(1)
  })

  it.each([
    "01/02/2024 - 03/04/2024",
    "01-02-2024 - 03-04-2024",
    "01 02 2024 - 03 04 2024",
    "01/02/2024 to 03/04/2024",
    "01-02-2024 to 3/4/2024",
  ])("parses a numeric from–to range %s", (input) => {
    const range = parseTableDateRangeInput(input)
    expect(range?.[0].getFullYear()).toBe(2024)
    expect(range?.[0].getMonth()).toBe(1)
    expect(range?.[0].getDate()).toBe(1)
    expect(range?.[1].getFullYear()).toBe(2024)
    expect(range?.[1].getMonth()).toBe(3)
    expect(range?.[1].getDate()).toBe(3)
    expect(range?.[0].getTime()).not.toBe(range?.[1].getTime())
  })
})
