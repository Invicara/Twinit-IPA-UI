import * as React from "react"
import { Pencil1Icon } from "@radix-ui/react-icons"
import { cva } from "class-variance-authority"

import { cn } from "../../../lib/utils"
import '../../../output.css'
import { LinkProps } from "./link.types"
import styles from "./link.module.css"

const linkVariants = cva(
  styles.base,
  {
    variants: {
      variant: {
        default: styles.variantDefault,
        inline: styles.variantInline,
      },
      disabled: {
        true: styles.disabled,
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
      onClick,
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
        onClick={(event) => {
          if (isDisabled) {
            event.preventDefault()
            event.stopPropagation()
            return
          }

          onClick?.(event)
        }}
        {...props}
      >
        {variant === "default" && <Pencil1Icon className={styles.icon} />}
        {children}
      </a>
    )
  }
)

Link.displayName = "Link"

export { Link, linkVariants }
export default Link
