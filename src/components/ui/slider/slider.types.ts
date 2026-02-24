import { type VariantProps } from "class-variance-authority"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { sliderVariants } from "./slider"

export interface SliderProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>, 'disabled'>,
    VariantProps<typeof sliderVariants> {
  label?: string
  minLabel?: string
  maxLabel?: string
  disabled?: boolean
  className?: string
  testIdPrefix?: string
}

