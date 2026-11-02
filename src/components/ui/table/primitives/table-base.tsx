import * as React from "react"

import { cn, mergeStyles } from "../../../../lib/utils"
import styles from "./table-base.module.css"

export interface TableRootProps extends React.HTMLAttributes<HTMLTableElement> {
  styleOverrides?: Record<string, string>
}

const TableRoot = React.forwardRef<HTMLTableElement, TableRootProps>(
  ({ className, styleOverrides, ...props }, ref) => {
    const s = mergeStyles(styles, styleOverrides)
    return (
      <div className={s.tableWrapper} data-testid="ipa_table_root_wrapper">
        <table
          ref={ref}
          data-testid="ipa_table_root"
          className={cn(s.tableRoot, className)}
          {...props}
        />
      </div>
    )
  }
)
TableRoot.displayName = "TableRoot"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & {
    styleOverrides?: Record<string, string>
  }
>(({ className, styleOverrides, ...props }, ref) => {
  const s = mergeStyles(styles, styleOverrides)
  return (
    <thead
      ref={ref}
      data-testid="ipa_table_header"
      className={cn(s.header, className)}
      {...props}
    />
  )
})
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} data-testid="ipa_table_body" className={className} {...props} />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement> & {
    styleOverrides?: Record<string, string>
  }
>(({ className, styleOverrides, ...props }, ref) => {
  const s = mergeStyles(styles, styleOverrides)
  return (
    <tfoot
      ref={ref}
      data-testid="ipa_table_footer"
      className={cn(s.footer, className)}
      {...props}
    />
  )
})
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    data-testid="ipa_table_row"
    className={className}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> & {
    styleOverrides?: Record<string, string>
  }
>(({ className, styleOverrides, ...props }, ref) => {
  const s = mergeStyles(styles, styleOverrides)
  return (
    <th
      ref={ref}
      data-testid="ipa_table_head_cell"
      className={cn(s.headCell, className)}
      {...props}
    />
  )
})
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & {
    styleOverrides?: Record<string, string>
  }
>(({ className, styleOverrides, ...props }, ref) => {
  const s = mergeStyles(styles, styleOverrides)
  return (
    <td
      ref={ref}
      data-testid="ipa_table_body_cell"
      className={cn(s.bodyCell, className)}
      {...props}
    />
  )
})
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement> & {
    styleOverrides?: Record<string, string>
  }
>(({ className, styleOverrides, ...props }, ref) => {
  const s = mergeStyles(styles, styleOverrides)
  return (
    <caption
      ref={ref}
      data-testid="ipa_table_caption"
      className={cn(s.caption, className)}
      {...props}
    />
  )
})
TableCaption.displayName = "TableCaption"

export {
  TableRoot,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
