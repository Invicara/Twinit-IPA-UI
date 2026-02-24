import { type VariantProps } from "class-variance-authority"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

import { radioGroupVariants } from "./radio-group"

export interface RadioGroupOption {
  value: string
  label: string
  disabled?: boolean
  helperText?: string
}

export interface RadioGroupProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>, 'children' | 'disabled'>,
    VariantProps<typeof radioGroupVariants> {
  options: RadioGroupOption[]
  label?: string
  disabled?: boolean
  orientation?: "vertical" | "horizontal"
  className?: string
  testIdPrefix?: string
}

