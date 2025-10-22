import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cva } from "class-variance-authority"

import { cn } from "../../../lib/utils"
import '../../../output.css'
import { SliderProps } from "./slider.types"

const sliderVariants = cva(
  "flex flex-col gap-[8px] w-[336px]",
  {
    variants: {
      variant: {
        default: "",
        range: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const labelVariants = cva(
  "font-sans text-[14px] font-medium leading-[18px] text-neutral-9"
)

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    {
      className,
      label = "Select Amount",
      minLabel = "0",
      maxLabel = "100",
      variant = "default",
      disabled = false,
      testIdPrefix,
      value,
      defaultValue,
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      ...props
    },
    ref
  ) => {
    const isRange = variant === "range"
    const sliderId = React.useId()
    
    // Internal state for uncontrolled component
    const [internalValue, setInternalValue] = React.useState<number[]>(
      defaultValue || (isRange ? [25, 75] : [50])
    )
    
    const currentValue = value || internalValue
    
    const handleValueChange = (newValue: number[]) => {
      if (!value) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
    }

    const handleInputChange = (index: number, inputValue: string) => {
      const numValue = parseFloat(inputValue)
      if (isNaN(numValue) || disabled) return
      
      const clampedValue = Math.min(Math.max(numValue, min), max)
      const newValue = [...currentValue]
      newValue[index] = clampedValue
      
      handleValueChange(newValue)
    }

    return (
      <div className={cn(sliderVariants({ variant }), className)}>
        {label && (
          <label
            className={cn(labelVariants())}
            id={sliderId}
          >
            {label}
          </label>
        )}
        
        <div className="flex items-center gap-[8px]">
          <span className="font-sans text-[14px] font-normal text-neutral-7 min-w-[32px] text-center">
            {minLabel}
          </span>
          
          <div className="flex-1 relative flex items-center">
            <SliderPrimitive.Root
              ref={ref}
              className={cn(
                "relative flex items-center select-none touch-none w-full h-[20px]",
                disabled && "cursor-not-allowed"
              )}
              value={currentValue}
              onValueChange={handleValueChange}
              min={min}
              max={max}
              step={step}
              disabled={disabled}
              aria-labelledby={label ? sliderId : undefined}
              data-testid={testIdPrefix}
              {...props}
            >
              <SliderPrimitive.Track
                className={cn(
                  "relative grow rounded-full h-[4px]",
                  disabled ? "bg-neutral-3" : "bg-neutral-4"
                )}
              >
                <SliderPrimitive.Range
                  className={cn(
                    "absolute h-full rounded-full",
                    disabled ? "bg-neutral-5" : "bg-digital-twin-8"
                  )}
                />
              </SliderPrimitive.Track>
              
              {currentValue.map((_: number, index: number) => (
                <SliderPrimitive.Thumb
                  key={index}
                  className={cn(
                    "block w-[20px] h-[20px] rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-digital-twin-8 focus-visible:ring-offset-0",
                    disabled 
                      ? "bg-neutral-5 cursor-not-allowed"
                      : "bg-digital-twin-8 hover:bg-digital-twin-7 cursor-grab active:cursor-grabbing"
                  )}
                />
              ))}
            </SliderPrimitive.Root>
          </div>
          
          <span className="font-sans text-[14px] font-normal text-neutral-7 min-w-[32px] text-center">
            {maxLabel}
          </span>
        </div>
        
        <div className="flex justify-between">
          {isRange ? (
            <>
              <input
                type="number"
                value={currentValue[0]}
                onChange={(e) => handleInputChange(0, e.target.value)}
                disabled={disabled}
                min={min}
                max={max}
                step={step}
                className={cn(
                  "w-[60px] h-[36px] rounded-[4px] border bg-neutral-0 px-[8px] py-[8px] font-sans text-[14px] font-normal leading-[18px] text-neutral-9 text-center transition-colors focus-visible:outline-none",
                  disabled
                    ? "border-neutral-4 bg-neutral-1 text-neutral-5 cursor-not-allowed"
                    : "border-neutral-5 hover:border-neutral-7 focus:border-digital-twin-6"
                )}
              />
              <input
                type="number"
                value={currentValue[1]}
                onChange={(e) => handleInputChange(1, e.target.value)}
                disabled={disabled}
                min={min}
                max={max}
                step={step}
                className={cn(
                  "w-[60px] h-[36px] rounded-[4px] border bg-neutral-0 px-[8px] py-[8px] font-sans text-[14px] font-normal leading-[18px] text-neutral-9 text-center transition-colors focus-visible:outline-none",
                  disabled
                    ? "border-neutral-4 bg-neutral-1 text-neutral-5 cursor-not-allowed"
                    : "border-neutral-5 hover:border-neutral-7 focus:border-digital-twin-6"
                )}
              />
            </>
          ) : (
            <div className="flex justify-end w-full">
              <input
                type="number"
                value={currentValue[0]}
                onChange={(e) => handleInputChange(0, e.target.value)}
                disabled={disabled}
                min={min}
                max={max}
                step={step}
                className={cn(
                  "w-[60px] h-[36px] rounded-[4px] border bg-neutral-0 px-[8px] py-[8px] font-sans text-[14px] font-normal leading-[18px] text-neutral-9 text-center transition-colors focus-visible:outline-none",
                  disabled
                    ? "border-neutral-4 bg-neutral-1 text-neutral-5 cursor-not-allowed"
                    : "border-neutral-5 hover:border-neutral-7 focus:border-digital-twin-6"
                )}
              />
            </div>
          )}
        </div>
      </div>
    )
  }
)

Slider.displayName = "Slider"

export { Slider, sliderVariants }
export default Slider

