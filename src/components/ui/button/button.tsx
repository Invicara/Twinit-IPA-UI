import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn, mergeStyles } from "../../../lib/utils"
import styles from "./button.module.css"

export type ButtonVariant = "default" | "danger" | "secondary" | "tertiary"
export type ButtonSize = "default" | "sm" | "icon"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
  /** Style overrides: object mapping slot names to class names. Plain object or CSS module. */
  styleOverrides?: Record<string, string>
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      disabled = false,
      styleOverrides,
      ...props
    },
    ref
  ) => {
    const s = mergeStyles(styles, styleOverrides)
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        data-testid="ipa_button"
        data-variant={variant}
        data-size={size}
        data-disabled={disabled}
        className={cn(s.button, className)}
        {...(asChild ? {} : { disabled })}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
