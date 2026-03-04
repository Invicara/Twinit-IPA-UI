import * as React from "react"

import { cn } from "../../../lib/utils"
import styles from "./link.module.css"

export interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href?: string
  disabled?: boolean
  inline?: boolean // When true, underline style for inline text; default is button-like
  icon?: React.ReactNode

  classNames?: {
    link?: string
    icon?: string
  }

  children: React.ReactNode
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      className,
      inline = false,
      disabled = false,
      href,
      icon,
      classNames,
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
        className={cn(
          styles.link,
          inline && icon != null && styles.withIcon,
          className,
          classNames?.link
        )}
        data-testid="ipa_link"
        data-variant={inline ? "inline" : "default"}
        data-disabled={isDisabled}
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
        {icon != null && (
          <span className={cn(styles.icon, classNames?.icon)}>{icon}</span>
        )}
        {children}
      </a>
    )
  }
)

Link.displayName = "Link"

export { Link }
