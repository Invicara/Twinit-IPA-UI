import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
 
import { cn } from "../../../lib/utils"

import '../../../output.css'
import { ButtonProps } from "./button.types"
 
const buttonVariants = cva(
  "ipa-ui-btn-base",
  {
    variants: {
      variant: {
        default:
          "ipa-ui-btn-variant-default",
        danger:
          "ipa-ui-btn-variant-danger",
        secondary:
          "ipa-ui-btn-variant-secondary",
        tertiary: 
          "ipa-ui-btn-variant-tertiary",
      },
      size: {
        default: "ipa-ui-btn-size-default",
        sm: "ipa-ui-btn-size-sm",
        icon: "ipa-ui-btn-size-icon",
      },
    },
    compoundVariants: [
      {
        variant: "tertiary",
        size: "default",
        class: "px-4",
      },
      {
        variant: "tertiary",
        size: "sm",
        class: "px-2",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
 
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, testIdPrefix, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
      data-testid={`${testIdPrefix}`}
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
      />
    )
  }
)
Button.displayName = "Button"
 
export { Button, buttonVariants }
export default Button;