import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon, Minus } from "lucide-react"

import { cn } from "../../../lib/utils"
import styles from "./checkbox.module.css"

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  classNames?: {
    checkbox?: string
    indicator?: string
    icon?: string
  }
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, classNames, disabled = false, ...props }, ref) => {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      data-testid="ipa_checkbox"
      data-disabled={disabled}
      className={cn(styles.checkbox, "peer", className, classNames?.checkbox)}
      disabled={disabled}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn(styles.indicator, classNames?.indicator)}
      >
        <CheckIcon className={cn(styles.icon, styles.iconCheck, classNames?.icon)} />
        <Minus className={cn(styles.icon, styles.iconIndeterminate, classNames?.icon)} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})

Checkbox.displayName = "Checkbox"

export { Checkbox }
