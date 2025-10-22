import { type VariantProps } from "class-variance-authority"
import { LinkProps as NextLinkProps } from "next/link"

import { linkVariants } from "./link"

export interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    VariantProps<typeof linkVariants> {
  href?: string
  disabled?: boolean
  className?: string
  testIdPrefix?: string
  children: React.ReactNode
}
