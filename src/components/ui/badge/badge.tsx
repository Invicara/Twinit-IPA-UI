import * as React from "react"

import { cn, mergeStyles } from "../../../lib/utils"
import styles from "./badge.module.css"

export type BadgeVariant = "default" | "secondary" | "outline"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  styleOverrides?: Record<string, string>
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", styleOverrides, ...props }, ref) => {
    const s = mergeStyles(styles, styleOverrides)

    return (
      <span
        ref={ref}
        data-testid="ipa_badge"
        data-variant={variant}
        className={cn(s.badge, className)}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }
