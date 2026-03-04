import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "../../../lib/utils"
import styles from "./slider.module.css"

export interface SliderProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
    "disabled"
  > {
  label?: string
  minLabel?: string
  maxLabel?: string
  disabled?: boolean
  range?: boolean // When true, use two thumbs for range selection

  classNames?: {
    slider?: string
    label?: string
    controls?: string
    minLabel?: string
    maxLabel?: string
    sliderContainer?: string
    root?: string
    track?: string
    range?: string
    thumb?: string
    inputs?: string
    inputBox?: string
    inputContainer?: string
  }
}

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
      range = false,
      disabled = false,
      classNames,
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
    const sliderId = React.useId()

    const [internalValue, setInternalValue] = React.useState<number[]>(
      defaultValue ?? (range ? [25, 75] : [50])
    )

    const currentValue = value ?? internalValue

    const handleValueChange = (newValue: number[]) => {
      if (value == null) {
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
      <div
        className={cn(styles.slider, classNames?.slider)}
        data-disabled={disabled}
      >
        {label && (
          <label
            className={cn(styles.label, classNames?.label)}
            id={sliderId}
          >
            {label}
          </label>
        )}

        <div className={cn(styles.controls, classNames?.controls)}>
          <span className={cn(styles.minLabel, classNames?.minLabel)}>
            {minLabel}
          </span>

          <div
            className={cn(styles.sliderContainer, classNames?.sliderContainer)}
          >
            <SliderPrimitive.Root
              ref={ref}
              className={cn(styles.root, className, classNames?.root)}
              value={currentValue}
              onValueChange={handleValueChange}
              min={min}
              max={max}
              step={step}
              disabled={disabled}
              data-disabled={disabled}
              aria-labelledby={label ? sliderId : undefined}
              data-testid="ipa_slider"
              {...props}
            >
              <SliderPrimitive.Track
                className={cn(styles.track, classNames?.track)}
              >
                <SliderPrimitive.Range
                  className={cn(styles.range, classNames?.range)}
                />
              </SliderPrimitive.Track>

              {currentValue.map((_: number, index: number) => (
                <SliderPrimitive.Thumb
                  key={index}
                  className={cn(styles.thumb, classNames?.thumb)}
                />
              ))}
            </SliderPrimitive.Root>
          </div>

          <span className={cn(styles.maxLabel, classNames?.maxLabel)}>
            {maxLabel}
          </span>
        </div>

        <div className={cn(styles.inputs, classNames?.inputs)}>
          {range ? (
            <>
              <input
                type="number"
                value={currentValue[0]}
                onChange={(e) => handleInputChange(0, e.target.value)}
                disabled={disabled}
                min={min}
                max={max}
                step={step}
                className={cn(styles.inputBox, classNames?.inputBox)}
              />
              <input
                type="number"
                value={currentValue[1]}
                onChange={(e) => handleInputChange(1, e.target.value)}
                disabled={disabled}
                min={min}
                max={max}
                step={step}
                className={cn(styles.inputBox, classNames?.inputBox)}
              />
            </>
          ) : (
            <div className={cn(styles.inputContainer, classNames?.inputContainer)}>
              <input
                type="number"
                value={currentValue[0]}
                onChange={(e) => handleInputChange(0, e.target.value)}
                disabled={disabled}
                min={min}
                max={max}
                step={step}
                className={cn(styles.inputBox, classNames?.inputBox)}
              />
            </div>
          )}
        </div>
      </div>
    )
  }
)

Slider.displayName = "Slider"

export { Slider }
