import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
 
import { cn } from "../../../lib/utils"

import '../../../output.css'
import { ButtonProps } from "./button.types"
 
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:border-0 cursor-pointer disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/80 active:bg-brand-9 active:text-white disabled:bg-neutral-3 disabled:text-neutral-5 disabled:shadow-none disabled:hover:bg-neutral-3 disabled:active:bg-neutral-3 disabled:active:text-neutral-5",
        danger:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/80 focus-visible:outline-destructive active:bg-alert-8 active:text-white disabled:bg-neutral-3 disabled:text-neutral-5 disabled:shadow-none disabled:hover:bg-neutral-3 disabled:active:bg-neutral-3 disabled:active:text-neutral-5",
        secondary:
          "border border-input border-primary text-primary shadow-sm hover:bg-brand-1 focus-visible:bg-brand-1 focus-visible:outline-none focus-visible:border focus-visible:border-primary active:bg-brand-2 disabled:bg-white disabled:border-neutral-3 disabled:text-neutral-4 disabled:shadow-none disabled:hover:bg-white disabled:focus-visible:bg-white disabled:focus-visible:border-neutral-3 disabled:active:bg-white",
        tertiary: "border border-transparent text-primary focus-visible:outline-dotted hover:text-brand-7 active:text-brand-9 disabled:text-neutral-4 disabled:hover:text-neutral-4 disabled:active:text-neutral-4",
      },
      size: {
        default: "h-10 px-8",
        sm: "h-8 rounded-sm px-3 text-xs",
        icon: "h-9 w-9",
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