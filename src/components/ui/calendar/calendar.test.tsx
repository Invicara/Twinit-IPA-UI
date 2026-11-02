import React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Calendar } from "./calendar"
import { DatePicker, DateRangePicker } from "./date-picker"

describe("Calendar", () => {
  it("renders the calendar root", () => {
    render(<Calendar mode="single" />)
    expect(screen.getByTestId("ipa_calendar")).toBeInTheDocument()
  })

  it("renders month and year dropdowns by default", () => {
    render(<Calendar mode="single" />)
    expect(screen.getAllByRole("combobox").length).toBeGreaterThanOrEqual(2)
  })
})

describe("DatePicker", () => {
  it("opens the calendar popover from the trigger", async () => {
    const user = userEvent.setup()
    render(<DatePicker placeholder="Pick a date" />)

    await user.click(screen.getByTestId("ipa_date_picker_trigger"))

    expect(await screen.findByTestId("ipa_calendar")).toBeInTheDocument()
  })
})

describe("DateRangePicker", () => {
  it("does not show relative date shortcuts by default", async () => {
    const user = userEvent.setup()
    render(<DateRangePicker placeholder="Pick a range" />)

    await user.click(screen.getByTestId("ipa_date_range_picker_trigger"))

    expect(screen.queryByRole("button", { name: "Today" })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "This week" })).not.toBeInTheDocument()
  })

  it("shows opted-in relative date shortcuts", async () => {
    const user = userEvent.setup()
    render(
      <DateRangePicker
        placeholder="Pick a range"
        showToday
        showThisWeek
        showThisMonth
        showThisQuarter
        showThisYear
      />
    )

    await user.click(screen.getByTestId("ipa_date_range_picker_trigger"))

    expect(screen.getByRole("button", { name: "Today" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "This week" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "This month" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "This quarter" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "This year" })).toBeInTheDocument()
  })

  it("applies Today when that shortcut is clicked", async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()
    render(<DateRangePicker showToday onChange={onChange} />)

    await user.click(screen.getByTestId("ipa_date_range_picker_trigger"))
    await user.click(screen.getByRole("button", { name: "Today" }))

    expect(onChange).toHaveBeenCalled()
    const range = onChange.mock.calls[0][0] as { from: Date; to: Date }
    const now = new Date()
    expect(range.from.getFullYear()).toBe(now.getFullYear())
    expect(range.from.getMonth()).toBe(now.getMonth())
    expect(range.from.getDate()).toBe(now.getDate())
    expect(range.to.getDate()).toBe(now.getDate())
  })
})

describe("DatePicker clear", () => {
  it("closes the popover after clicking Reset", async () => {
    const user = userEvent.setup()
    function Harness() {
      const [value, setValue] = React.useState<Date | undefined>(
        new Date(2024, 0, 15)
      )
      return (
        <DatePicker
          value={value}
          onChange={setValue}
          showClearTrigger
          showPopoverClear
          onClear={() => setValue(undefined)}
          clearAriaLabel="Clear date"
        />
      )
    }

    render(<Harness />)
    await user.click(screen.getByTestId("ipa_date_picker_trigger"))
    expect(await screen.findByTestId("ipa_calendar")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Reset" }))

    expect(screen.queryByTestId("ipa_calendar")).not.toBeInTheDocument()
  })

  it("clears the selection without dismissing when Clear is pressed", async () => {
    const user = userEvent.setup()
    function Harness() {
      const [value, setValue] = React.useState<Date | undefined>(
        new Date(2024, 0, 15)
      )
      return (
        <DatePicker
          value={value}
          onChange={setValue}
          showClearTrigger
          showPopoverClear
          onClear={() => setValue(undefined)}
          clearAriaLabel="Clear date"
        />
      )
    }

    render(<Harness />)
    await user.click(screen.getByTestId("ipa_date_picker_trigger"))
    expect(await screen.findByTestId("ipa_calendar")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Clear" }))

    expect(screen.getByTestId("ipa_calendar")).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument()
  })
})

describe("DateRangePicker clear", () => {
  it("closes the popover after clicking Reset", async () => {
    const user = userEvent.setup()
    function Harness() {
      const [value, setValue] = React.useState<
        { from: Date; to: Date } | undefined
      >({
        from: new Date(2024, 0, 15),
        to: new Date(2024, 0, 20),
      })
      return (
        <DateRangePicker
          value={value}
          onChange={setValue}
          showClearTrigger
          showPopoverClear
          onClear={() => setValue(undefined)}
          clearAriaLabel="Clear range"
        />
      )
    }

    render(<Harness />)
    await user.click(screen.getByTestId("ipa_date_range_picker_trigger"))
    expect(await screen.findByTestId("ipa_calendar")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Reset" }))

    expect(screen.queryByTestId("ipa_calendar")).not.toBeInTheDocument()
  })
})
