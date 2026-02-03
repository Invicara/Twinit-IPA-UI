import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cva } from "class-variance-authority"

import { cn } from "../../../lib/utils"
import '../../../output.css'
import { SliderProps } from "./slider.types"
import styles from "./slider.module.css"

const sliderVariants = cva(
  styles.container,
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
  styles.label
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
        
        <div className={styles.controls}>
          <span className={styles.minLabel}>
            {minLabel}
          </span>
          
          <div className={styles.sliderContainer}>
            <SliderPrimitive.Root
              ref={ref}
              className={cn(
                styles.root,
                disabled && styles.rootDisabled
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
                  styles.track,
                  disabled ? styles.trackDisabled : styles.trackEnabled
                )}
              >
                <SliderPrimitive.Range
                  className={cn(
                    styles.range,
                    disabled ? styles.rangeDisabled : styles.rangeEnabled
                  )}
                />
              </SliderPrimitive.Track>
              
              {currentValue.map((_: number, index: number) => (
                <SliderPrimitive.Thumb
                  key={index}
                  className={cn(
                    styles.thumb,
                    disabled ? styles.thumbDisabled : styles.thumbEnabled
                  )}
                />
              ))}
            </SliderPrimitive.Root>
          </div>
          
          <span className={styles.maxLabel}>
            {maxLabel}
          </span>
        </div>
        
        <div className={styles.inputs}>
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
                  styles.input,
                  disabled ? styles.inputDisabled : styles.inputEnabled
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
                  styles.input,
                  disabled ? styles.inputDisabled : styles.inputEnabled
                )}
              />
            </>
          ) : (
            <div className={styles.inputContainer}>
              <input
                type="number"
                value={currentValue[0]}
                onChange={(e) => handleInputChange(0, e.target.value)}
                disabled={disabled}
                min={min}
                max={max}
                step={step}
                className={cn(
                  styles.input,
                  disabled ? styles.inputDisabled : styles.inputEnabled
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

