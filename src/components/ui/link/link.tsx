import * as React from "react"
import { Pencil1Icon } from "@radix-ui/react-icons"
import { cva } from "class-variance-authority"

import { cn } from "../../../lib/utils"
import '../../../output.css'
import { LinkProps } from "./link.types"

const linkVariants = cva(
  "font-sans text-[14px] font-normal leading-[18px] transition-colors focus-visible:outline-none",
  {
    variants: {
      variant: {
        default: "text-brand-8 hover:text-brand-6 active:text-brand-9 focus:text-brand-6 flex items-center gap-[4px]",
        inline: "text-brand-8 hover:text-brand-6 active:text-brand-9 focus:text-brand-6 underline hover:no-underline underline-offset-2",
      },
      disabled: {
        true: "text-neutral-5 cursor-not-allowed pointer-events-none",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      disabled: false,
    },
  }
)

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      className,
      variant = "default",
      disabled = false,
      href,
      testIdPrefix,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || !href

    return (
      <a
        ref={ref}
        href={isDisabled ? undefined : href}
        className={cn(linkVariants({ variant, disabled: isDisabled }), className)}
        data-testid={testIdPrefix}
        aria-disabled={isDisabled}
        {...props}
      >
        {variant === "default" && <Pencil1Icon className="h-[14px] w-[14px]" />}
        {children}
      </a>
    )
  }
)

Link.displayName = "Link"

export { Link, linkVariants }
export default Link
