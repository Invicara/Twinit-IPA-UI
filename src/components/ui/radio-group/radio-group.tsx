import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { cva } from "class-variance-authority"

import { cn } from "../../../lib/utils"
import '../../../output.css'
import { RadioGroupProps } from "./radio-group.types"
import styles from "./radio-group.module.css"

const radioGroupVariants = cva(
  styles.group,
  {
    variants: {
      orientation: {
        vertical: styles.groupOrientationVertical,
        horizontal: styles.groupOrientationHorizontal,
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  }
)

const labelVariants = cva(
  styles.label
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
      <div className={styles.container}>
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
              <div key={option.value} className={styles.item}>
                <RadioGroupPrimitive.Item
                  value={option.value}
                  id={`${groupId}-${option.value}`}
                  disabled={isDisabled}
                  className={cn(
                    "group",
                    styles.radio,
                    isDisabled ? styles.radioDisabled : styles.radioEnabled
                  )}
                >
                  <RadioGroupPrimitive.Indicator 
                    className={cn(
                      styles.indicator,
                      isDisabled ? styles.indicatorDisabled : styles.indicatorEnabled
                    )}
                  />
                </RadioGroupPrimitive.Item>
                <div className={styles.itemContent}>
                  <label
                    htmlFor={`${groupId}-${option.value}`}
                    className={cn(
                      styles.itemLabel,
                      isDisabled ? styles.itemLabelDisabled : styles.itemLabelEnabled
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

