import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon, Minus } from "lucide-react"

import { cn, mergeStyles } from "../../../lib/utils"
import styles from "./checkbox.module.css"

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  /** Style overrides: object mapping slot names (checkbox, indicator, icon) to class names. Plain object or CSS module. */
  styleOverrides?: Record<string, string>
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, styleOverrides, disabled = false, ...props }, ref) => {
  const s = mergeStyles(styles, styleOverrides)
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      data-testid="ipa_checkbox"
      data-disabled={disabled}
      className={cn(s.checkbox, "peer", className)}
      disabled={disabled}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={s.indicator}
      >
        <CheckIcon className={cn(s.icon, s.iconCheck)} />
        <Minus className={cn(s.icon, s.iconIndeterminate)} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})

Checkbox.displayName = "Checkbox"

export { Checkbox }
