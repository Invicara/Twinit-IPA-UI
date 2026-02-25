import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

import { cn } from "../../../lib/utils"
import "../../../output.css"
import styles from "./radio-group.module.css"

export interface RadioGroupProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>,
    "children" | "disabled"
  > {
  // Core Props
  label?: string
  disabled?: boolean
  horizontal?: boolean
  options: Array<{
    value: string
    label: string
    disabled?: boolean
  }>

  classNames?: {
    container?: string
    label?: string
    group?: string
    item?: string
    radio?: string
    indicator?: string
    itemContent?: string
    itemLabel?: string
  }
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(
  (
    {
      className,
      options,
      label,
      horizontal = false,
      classNames,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const groupId = React.useId()

    const handleItemKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      const target = e.currentTarget
      const key = e.key

      if (key === "Enter") {
        e.preventDefault()
        target.click()
        return
      }

      const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]
      if (!arrowKeys.includes(key)) return

      e.preventDefault()
      const root = target.closest('[role="radiogroup"]')
      if (!root) return
      const items = Array.from(
        root.querySelectorAll<HTMLButtonElement>('[role="radio"]:not([disabled])')
      )
      const index = items.indexOf(target)
      if (index === -1) return

      const isNext = key === "ArrowDown" || key === "ArrowRight"
      const nextIndex = isNext ? index + 1 : index - 1
      const next = items[nextIndex]
      next?.focus()
    }

    return (
      <div
        className={cn(styles.container, classNames?.container)}
        data-disabled={disabled}
      >
        {label && (
          <div
            className={cn(styles.label, classNames?.label)}
            id={groupId}
          >
            {label}
          </div>
        )}
        <RadioGroupPrimitive.Root
          ref={ref}
          className={cn(
            styles.group,
            horizontal && styles.groupOrientationHorizontal,
            className,
            classNames?.group
          )}
          orientation={horizontal ? "horizontal" : "vertical"}
          aria-labelledby={label ? groupId : undefined}
          data-testid={"ipa_radio_group"}
          disabled={disabled}
          {...props}
        >
          {options.map((option) => {
            const isDisabled = disabled || option.disabled
            return (
              <div
                key={option.value}
                className={cn(styles.item, classNames?.item)}
                data-disabled={isDisabled}
              >
                <RadioGroupPrimitive.Item
                  value={option.value}
                  id={`${groupId}-${option.value}`}
                  disabled={isDisabled}
                  tabIndex={isDisabled ? -1 : 0}
                  className={cn(styles.radio, classNames?.radio)}
                  onKeyDownCapture={handleItemKeyDown}
                >
                  <RadioGroupPrimitive.Indicator
                    className={cn(styles.indicator, classNames?.indicator)}
                  />
                </RadioGroupPrimitive.Item>
                <div
                  className={cn(styles.itemContent, classNames?.itemContent)}
                >
                  <label
                    htmlFor={`${groupId}-${option.value}`}
                    className={cn(styles.itemLabel, classNames?.itemLabel)}
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

export { RadioGroup }
