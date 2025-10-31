import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { cva } from "class-variance-authority"

import { cn } from "../../../lib/utils"
import '../../../output.css'
import { RadioGroupProps } from "./radio-group.types"

const radioGroupVariants = cva(
  "flex gap-[8px]",
  {
    variants: {
      orientation: {
        vertical: "flex-col",
        horizontal: "flex-row flex-wrap",
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  }
)

const labelVariants = cva(
  "font-sans text-[14px] font-medium leading-[18px] text-neutral-9"
)

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(
  (
    {
      className,
      options,
      label,
      orientation = "vertical",
      testIdPrefix,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const groupId = React.useId()

    return (
      <div className="w-full flex flex-col gap-[8px]">
        {label && (
          <div
            className={cn(labelVariants())}
            id={groupId}
          >
            {label}
          </div>
        )}
        <RadioGroupPrimitive.Root
          ref={ref}
          className={cn(radioGroupVariants({ orientation }), className)}
          orientation={orientation}
          aria-labelledby={label ? groupId : undefined}
          data-testid={testIdPrefix}
          disabled={disabled}
          {...props}
        >
          {options.map((option) => {
            const isDisabled = disabled || option.disabled
            return (
              <div key={option.value} className="flex items-start gap-[8px]">
                <RadioGroupPrimitive.Item
                  value={option.value}
                  id={`${groupId}-${option.value}`}
                  disabled={isDisabled}
                  className={cn(
                    "group relative h-[16px] w-[16px] rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-3",
                    isDisabled 
                      ? "border-neutral-4 bg-neutral-1 cursor-not-allowed"
                      : "border-neutral-5 hover:border-brand-8 data-[state=checked]:border-brand-8 data-[state=checked]:bg-white"
                  )}
                >
                  <RadioGroupPrimitive.Indicator 
                    className={cn(
                      "flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[8px] after:h-[8px] after:rounded-full",
                      isDisabled ? "after:bg-neutral-5" : "after:bg-brand-8"
                    )}
                  />
                </RadioGroupPrimitive.Item>
                <div className="flex flex-col gap-[2px] flex-1">
                  <label
                    htmlFor={`${groupId}-${option.value}`}
                    className={cn(
                      "font-sans text-[14px] font-normal leading-[18px] cursor-pointer select-none",
                      isDisabled ? "text-neutral-5 cursor-not-allowed" : "text-neutral-9"
                    )}
                  >
                    {option.label}
                  </label>
                </div>
              </div>
            )
          })}
        </RadioGroupPrimitive.Root>
      </div>
    )
  }
)

RadioGroup.displayName = "RadioGroup"

export { RadioGroup, radioGroupVariants }
export default RadioGroup

