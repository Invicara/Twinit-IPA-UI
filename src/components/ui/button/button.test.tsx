import React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Button } from "./button"
import styles from "./button.module.css"

describe("Button", () => {
  it("renders with children", () => {
    render(<Button>Click me</Button>)

    const button = screen.getByRole("button", { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent("Click me")
  })

  it("renders with data-testid", () => {
    render(<Button>Button</Button>)

    expect(screen.getByTestId("ipa_button")).toBeInTheDocument()
  })

  it("applies button class and data-variant / data-size", () => {
    render(<Button>Default</Button>)

    const button = screen.getByRole("button")
    expect(button).toHaveClass(styles.button)
    expect(button).toHaveAttribute("data-variant", "default")
    expect(button).toHaveAttribute("data-size", "default")
  })

  it("applies data-variant and data-size when set", () => {
    render(
      <Button variant="secondary" size="sm">
        Secondary
      </Button>
    )

    const button = screen.getByRole("button")
    expect(button).toHaveAttribute("data-variant", "secondary")
    expect(button).toHaveAttribute("data-size", "sm")
  })

  it("applies data-disabled when disabled", () => {
    render(<Button disabled>Disabled</Button>)

    const button = screen.getByRole("button")
    expect(button).toHaveAttribute("data-disabled", "true")
  })

  it("applies data-disabled false when not disabled", () => {
    render(<Button>Enabled</Button>)

    expect(screen.getByRole("button")).toHaveAttribute("data-disabled", "false")
  })

  it("calls onClick when clicked", async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)

    const button = screen.getByRole("button")
    const user = userEvent.setup()
    await user.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("does not call onClick when disabled", async () => {
    const handleClick = jest.fn()
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    )

    const button = screen.getByRole("button")
    const user = userEvent.setup()
    await user.click(button)

    expect(handleClick).not.toHaveBeenCalled()
  })

  it("applies custom className", () => {
    render(<Button className="custom-btn">Button</Button>)

    expect(screen.getByRole("button")).toHaveClass("custom-btn")
  })

  it("applies classNames.button", () => {
    render(<Button classNames={{ button: "custom-button" }}>Button</Button>)

    expect(screen.getByRole("button")).toHaveClass("custom-button")
  })
})
