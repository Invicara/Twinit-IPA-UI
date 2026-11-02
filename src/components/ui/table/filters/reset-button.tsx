import * as React from "react"

import { cn, mergeStyles } from "../../../../lib/utils"
import { Button } from "../../button"
import styles from "../table.module.css"

export interface TableFilterResetButtonProps {
  onClick: () => void
  className?: string
  styleOverrides?: Record<string, string>
  children?: React.ReactNode
}

/** Secondary outlined Reset control with red text and border. */
export function TableFilterResetButton({
  onClick,
  className,
  styleOverrides,
  children = "Reset",
}: TableFilterResetButtonProps) {
  const s = mergeStyles(styles, styleOverrides)
  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      className={cn(s.filterResetButton, className)}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}
