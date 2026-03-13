import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

import { cn, mergeStyles } from "../../../lib/utils"
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

  /** Style overrides: object mapping slot names to class names. Plain object or CSS module. */
  styleOverrides?: Record<string, string>
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
      styleOverrides,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const s = mergeStyles(styles, styleOverrides)
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
        className={s.radioGroup}
        data-disabled={disabled}
      >
        {label && (
          <div
            className={s.label}
            id={groupId}
          >
            {label}
          </div>
        )}
        <RadioGroupPrimitive.Root
          ref={ref}
          className={cn(s.group, className)}
          data-orientation={horizontal ? "horizontal" : "vertical"}
          orientation={horizontal ? "horizontal" : "vertical"}
          aria-labelledby={label ? groupId : undefined}
          data-testid="ipa_radio_group"
          disabled={disabled}
          {...props}
        >
          {options.map((option) => {
            const isDisabled = disabled || option.disabled
            return (
              <div
                key={option.value}
                className={s.item}
                data-disabled={isDisabled}
              >
                <RadioGroupPrimitive.Item
                  value={option.value}
                  id={`${groupId}-${option.value}`}
                  disabled={isDisabled}
                  tabIndex={isDisabled ? -1 : 0}
                  className={s.radio}
                  onKeyDownCapture={handleItemKeyDown}
                >
                  <RadioGroupPrimitive.Indicator
                    className={s.indicator}
                  />
                </RadioGroupPrimitive.Item>
                <div
                  className={s.itemContent}
                >
                  <label
                    htmlFor={`${groupId}-${option.value}`}
                    className={s.itemLabel}
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
