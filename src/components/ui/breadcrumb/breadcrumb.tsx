import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn, mergeStyles } from "../../../lib/utils"
import styles from "./breadcrumb.module.css"

const BreadcrumbStylesContext = React.createContext<Record<string, string> | null>(null)

export interface BreadcrumbProps extends React.ComponentProps<"nav"> {
  /** Style overrides: object mapping slot names to class names. Plain object or CSS module. */
  styleOverrides?: Record<string, string>
}

const Breadcrumb = React.forwardRef<HTMLNavElement, BreadcrumbProps>(
  ({ className, styleOverrides, ...props }, ref) => {
    const s = mergeStyles(styles, styleOverrides)
    return (
      <BreadcrumbStylesContext.Provider value={s}>
        <nav
          ref={ref}
          aria-label="breadcrumb"
          data-testid="ipa_breadcrumb"
          className={cn(s.breadcrumb, className)}
          {...props}
        />
      </BreadcrumbStylesContext.Provider>
    )
  }
)
Breadcrumb.displayName = "Breadcrumb"

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  const s = React.useContext(BreadcrumbStylesContext) ?? styles
  return <ol className={cn(s.list, className)} {...props} />
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  const s = React.useContext(BreadcrumbStylesContext) ?? styles
  return <li className={cn(s.item, className)} {...props} />
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<"a"> & { asChild?: boolean }) {
  const s = React.useContext(BreadcrumbStylesContext) ?? styles
  const Comp = asChild ? Slot : "a"
  return <Comp className={cn(s.link, className)} {...props} />
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  const s = React.useContext(BreadcrumbStylesContext) ?? styles
  return (
    <span
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(s.page, className)}
      {...props}
    />
  )
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  const s = React.useContext(BreadcrumbStylesContext) ?? styles
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cn(s.separator, className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  )
}

function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  const s = React.useContext(BreadcrumbStylesContext) ?? styles
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={cn(s.ellipsis, className)}
      {...props}
    >
      <MoreHorizontal className={s.ellipsisIcon} />
      <span className={s.srOnly}>More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
