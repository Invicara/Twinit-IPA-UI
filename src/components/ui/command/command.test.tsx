import React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Command, CommandInput, CommandItem, CommandList } from "./command"

describe("Command", () => {
  it("filters items by search input", async () => {
    const user = userEvent.setup()
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandItem>Alpha</CommandItem>
          <CommandItem>Beta</CommandItem>
        </CommandList>
      </Command>
    )

    await user.type(screen.getByPlaceholderText("Search..."), "Al")
    expect(screen.getByText("Alpha")).toBeInTheDocument()
  })
})
