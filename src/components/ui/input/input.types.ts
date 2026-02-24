import { type VariantProps } from "class-variance-authority"
import { LucideIcon } from "lucide-react"

import { inputVariants } from "./input"

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  testIdPrefix?: string
  label?: string
  helperText?: string
  password?: boolean
  textarea?: boolean
  icon?: LucideIcon | React.ComponentType<{ className?: string }>
}
