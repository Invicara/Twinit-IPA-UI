import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "../../../lib/utils"
import styles from "./button.module.css"

export type ButtonVariant = "default" | "danger" | "secondary" | "tertiary"
export type ButtonSize = "default" | "sm" | "icon"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
  classNames?: {
    button?: string
  }
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      disabled = false,
      classNames,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        data-testid="ipa_button"
        data-variant={variant}
        data-size={size}
        data-disabled={disabled}
        className={cn(styles.button, className, classNames?.button)}
        {...(asChild ? {} : { disabled })}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
