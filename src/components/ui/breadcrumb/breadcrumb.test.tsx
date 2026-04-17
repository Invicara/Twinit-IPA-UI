import React from "react"
import { render, screen } from "@testing-library/react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "./breadcrumb"
import styles from "./breadcrumb.module.css"

describe("Breadcrumb", () => {
  it("renders nav with aria-label", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )

    const nav = screen.getByRole("navigation", { name: "breadcrumb" })
    expect(nav).toBeInTheDocument()
  })

  it("renders with data-testid", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )

    expect(screen.getByTestId("ipa_breadcrumb")).toBeInTheDocument()
  })

  it("renders list with items, links and current page", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/components">Components</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/")
    expect(screen.getByRole("link", { name: "Components" })).toHaveAttribute(
      "href",
      "/components"
    )
    const current = screen.getByRole("link", { name: "Breadcrumb" })
    expect(current).toHaveAttribute("aria-current", "page")
    expect(current).toHaveAttribute("aria-disabled", "true")
  })

  it("applies list and link styles", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )

    const list = screen.getByRole("navigation").querySelector("ol")
    expect(list).toHaveClass(styles.list)
    const link = screen.getByRole("link", { name: "Home" })
    expect(link).toHaveClass(styles.link)
  })

  it("renders current page with page style", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Current</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )

    const page = screen.getByRole("link", { name: "Current" })
    expect(page).toHaveClass(styles.page)
  })

  it("renders separator with default chevron", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Page</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )

    const separators = screen.getByRole("navigation").querySelectorAll("li[role='presentation']")
    expect(separators.length).toBeGreaterThanOrEqual(1)
    expect(separators[0]).toHaveAttribute("aria-hidden", "true")
  })

  it("renders BreadcrumbEllipsis with accessible label", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )

    const more = screen.getByText("More")
    expect(more).toBeInTheDocument()
  })

  it("applies custom className to root", () => {
    render(
      <Breadcrumb className="custom-breadcrumb">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )

    expect(screen.getByTestId("ipa_breadcrumb")).toHaveClass("custom-breadcrumb")
  })
})
