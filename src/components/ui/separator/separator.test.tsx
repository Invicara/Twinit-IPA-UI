import React from "react"
import { render, screen } from "@testing-library/react"
import { Separator } from "./separator"

describe("Separator", () => {
  it("renders horizontal separator by default", () => {
    render(<Separator />)
    expect(screen.getByTestId("ipa_separator")).toHaveAttribute(
      "data-orientation",
      "horizontal"
    )
  })

  it("renders vertical separator", () => {
    render(<Separator orientation="vertical" />)
    expect(screen.getByTestId("ipa_separator")).toHaveAttribute(
      "data-orientation",
      "vertical"
    )
  })
})
