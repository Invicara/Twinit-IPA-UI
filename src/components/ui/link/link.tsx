import * as React from "react"

import { cn, mergeStyles } from "../../../lib/utils"
import styles from "./link.module.css"

export interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href?: string
  disabled?: boolean
  inline?: boolean // When true, underline style for inline text; default is button-like
  icon?: React.ReactNode

  /** Style overrides: object mapping slot names (link, icon) to class names. Plain object or CSS module. */
  styleOverrides?: Record<string, string>

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
      styleOverrides,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const s = mergeStyles(styles, styleOverrides)
    const isDisabled = disabled || !href

    return (
      <a
        ref={ref}
        href={isDisabled ? undefined : href}
        className={cn(
          s.link,
          inline && icon != null && s.withIcon,
          className
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
          <span className={s.icon}>{icon}</span>
        )}
        {children}
      </a>
    )
  }
)

Link.displayName = "Link"

export { Link }
