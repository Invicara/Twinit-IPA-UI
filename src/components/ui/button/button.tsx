import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
 
import { cn } from "../../../lib/utils"

import '../../../output.css'
import { ButtonProps } from "./button.types"
 
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:border-0 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:brightness-70 active:text-primary-foreground",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/80",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/80 focus-visible:outline-destructive",
        outline:
          "border border-input border-primary text-primary shadow-sm hover:bg-accent hover:text-primary focus-visible:bg-muted focus-visible:bg-primary/5 active:brightness-90",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 focus-visible:outline-secondary",
        ghost: "hover:bg-accent hover:text-accent-foreground focus-visible:outline-dotted active:brightness-90",
        link: "text-primary underline-offset-4 focus-visible:outline-dotted  hover:underline",
      },
      size: {
        default: "h-10 px-8",
        sm: "h-8 rounded-sm px-3 text-xs",
        icon: "h-9 w-9",
      },
    },
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