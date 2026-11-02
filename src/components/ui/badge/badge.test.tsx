import React from "react"
import { render, screen } from "@testing-library/react"
import { Badge } from "./badge"

describe("Badge", () => {
  it("renders with default variant", () => {
    render(<Badge>New</Badge>)
    const badge = screen.getByTestId("ipa_badge")
    expect(badge).toHaveTextContent("New")
    expect(badge).toHaveAttribute("data-variant", "default")
  })

  it("renders secondary variant", () => {
    render(<Badge variant="secondary">Draft</Badge>)
    expect(screen.getByTestId("ipa_badge")).toHaveAttribute(
      "data-variant",
      "secondary"
    )
  })
})
