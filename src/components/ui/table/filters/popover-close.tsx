import { X } from "lucide-react"
import * as React from "react"

import { cn, mergeStyles } from "../../../../lib/utils"
import { PopoverClose } from "../../popover"
import styles from "../table.module.css"

export interface TablePopoverCloseProps {
  className?: string
  styleOverrides?: Record<string, string>
}

/** Small grey close control, absolutely positioned in the popover corner. */
export function TablePopoverClose({
  className,
  styleOverrides,
}: TablePopoverCloseProps) {
  const s = mergeStyles(styles, styleOverrides)
  return (
    <PopoverClose
      type="button"
      aria-label="Close"
      className={cn(s.popoverClose, className)}
    >
      <X aria-hidden size={12} strokeWidth={2} />
    </PopoverClose>
  )
}
