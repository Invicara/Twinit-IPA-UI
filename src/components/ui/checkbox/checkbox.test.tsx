import React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Checkbox } from "./checkbox"
import styles from "./checkbox.module.css"

describe("Checkbox", () => {
  it("renders unchecked by default", () => {
    render(<Checkbox aria-label="Accept terms" />)

    const checkbox = screen.getByRole("checkbox", { name: /accept terms/i })
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).toHaveAttribute("data-state", "unchecked")
  })

  it("renders with data-testid", () => {
    render(<Checkbox aria-label="Check" />)

    expect(screen.getByTestId("ipa_checkbox")).toBeInTheDocument()
  })

  it("renders checked when defaultChecked is true", () => {
    render(<Checkbox aria-label="Check" defaultChecked />)

    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).toHaveAttribute("data-state", "checked")
  })

  it("renders indeterminate when defaultChecked is indeterminate", () => {
    render(<Checkbox aria-label="Check" defaultChecked="indeterminate" />)

    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).toHaveAttribute("data-state", "indeterminate")
  })

  it("applies root styles", () => {
    render(<Checkbox aria-label="Check" />)

    const root = screen.getByTestId("ipa_checkbox")
    expect(root).toHaveClass(styles.checkbox)
  })

  it("toggles checked state on click", async () => {
    render(<Checkbox aria-label="Accept terms" />)

    const checkbox = screen.getByRole("checkbox", { name: /accept terms/i })
    expect(checkbox).toHaveAttribute("data-state", "unchecked")

    const user = userEvent.setup()
    await user.click(checkbox)

    expect(checkbox).toHaveAttribute("data-state", "checked")

    await user.click(checkbox)

    expect(checkbox).toHaveAttribute("data-state", "unchecked")
  })

  it("calls onCheckedChange when toggled", async () => {
    const handleChange = jest.fn()
    render(<Checkbox aria-label="Check" onCheckedChange={handleChange} />)

    const checkbox = screen.getByRole("checkbox")
    const user = userEvent.setup()
    await user.click(checkbox)

    expect(handleChange).toHaveBeenCalledWith(true)

    await user.click(checkbox)

    expect(handleChange).toHaveBeenCalledWith(false)
  })

  it("applies disabled state", () => {
    render(<Checkbox aria-label="Check" disabled />)

    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).toBeDisabled()
    expect(checkbox).toHaveAttribute("data-disabled", "true")
  })

  it("does not toggle when disabled", async () => {
    render(<Checkbox aria-label="Check" disabled defaultChecked />)

    const checkbox = screen.getByRole("checkbox")
    const user = userEvent.setup()
    await user.click(checkbox)

    expect(checkbox).toHaveAttribute("data-state", "checked")
  })

  it("applies custom className", () => {
    render(<Checkbox aria-label="Check" className="custom-checkbox" />)

    expect(screen.getByTestId("ipa_checkbox")).toHaveClass("custom-checkbox")
  })
})
