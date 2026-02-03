import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
 
import { cn } from "../../../lib/utils"

import '../../../output.css'
import { ButtonProps } from "./button.types"
import styles from "./button.module.css"
 
const buttonVariants = cva(
  styles.base,
  {
    variants: {
      variant: {
        default: styles.variantDefault,
        danger: styles.variantDanger,
        secondary: styles.variantSecondary,
        tertiary: styles.variantTertiary,
      },
      size: {
        default: styles.sizeDefault,
        sm: styles.sizeSm,
        icon: styles.sizeIcon,
      },
    },
    compoundVariants: [
      {
        variant: "tertiary",
        size: "default",
        class: styles.variantTertiarySizeDefault,
      },
      {
        variant: "tertiary",
        size: "sm",
        class: styles.variantTertiarySizeSm,
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