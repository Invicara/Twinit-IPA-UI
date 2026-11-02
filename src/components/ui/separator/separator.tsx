import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn, mergeStyles } from "../../../lib/utils"
import styles from "./separator.module.css"

export interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  styleOverrides?: Record<string, string>
}

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(({ className, styleOverrides, orientation = "horizontal", decorative = true, ...props }, ref) => {
  const s = mergeStyles(styles, styleOverrides)

  return (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      data-testid="ipa_separator"
      data-orientation={orientation}
      className={cn(s.separator, className)}
      {...props}
    />
  )
})
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
