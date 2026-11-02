import React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Button } from "../button"

describe("Popover", () => {
  it("opens content when trigger is clicked", async () => {
    const user = userEvent.setup()
    render(
      <Popover>
        <PopoverTrigger asChild>
          <Button>Open popover</Button>
        </PopoverTrigger>
        <PopoverContent>Popover body</PopoverContent>
      </Popover>
    )

    await user.click(screen.getByRole("button", { name: "Open popover" }))
    expect(await screen.findByText("Popover body")).toBeInTheDocument()
  })
})
