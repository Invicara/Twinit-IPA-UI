import React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion"
import styles from "./accordion.module.css"

describe("Accordion", () => {
  it("renders with items and triggers", () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Trigger One</AccordionTrigger>
          <AccordionContent>Content One</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Trigger Two</AccordionTrigger>
          <AccordionContent>Content Two</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    expect(screen.getByRole("button", { name: /trigger one/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /trigger two/i })).toBeInTheDocument()
  })

  it("renders with data-testid", () => {
    render(
      <Accordion type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>Trigger</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    expect(screen.getByTestId("ipa_accordion")).toBeInTheDocument()
  })

  it("applies root and item styles", () => {
    render(
      <Accordion type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger>Trigger</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    const root = screen.getByTestId("ipa_accordion")
    expect(root).toHaveClass(styles.accordion)
    const item = root.querySelector("[data-state]")
    expect(item).toHaveClass(styles.item)
  })

  it("expands and collapses item on trigger click", async () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Trigger</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    const trigger = screen.getByRole("button", { name: /trigger/i })
    expect(trigger).toHaveAttribute("data-state", "closed")
    expect(trigger).toHaveAttribute("aria-expanded", "false")

    const user = userEvent.setup()
    await user.click(trigger)

    expect(trigger).toHaveAttribute("data-state", "open")
    expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText("Content")).toBeInTheDocument()

    await user.click(trigger)

    expect(trigger).toHaveAttribute("data-state", "closed")
    expect(trigger).toHaveAttribute("aria-expanded", "false")
  })

  it("applies custom className to root", () => {
    render(
      <Accordion type="single" className="custom-accordion">
        <AccordionItem value="item-1">
          <AccordionTrigger>Trigger</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    expect(screen.getByTestId("ipa_accordion")).toHaveClass("custom-accordion")
  })

  it("applies styleOverrides.accordion", () => {
    render(
      <Accordion type="single" styleOverrides={{ accordion: "custom-accordion-root" }}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Trigger</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    expect(screen.getByTestId("ipa_accordion")).toHaveClass("custom-accordion-root")
  })
})
