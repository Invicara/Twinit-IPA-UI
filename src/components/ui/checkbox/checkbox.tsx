import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import type { CheckedState } from "@radix-ui/react-checkbox"
import { CheckIcon, Minus } from "lucide-react"

import { cn, mergeStyles } from "../../../lib/utils"
import styles from "./checkbox.module.css"

export type { CheckedState }

/** Coerce Storybook / form string values so Radix state stays correct. */
function normalizeCheckedState(value: unknown): CheckedState | undefined {
  if (value === undefined || value === null) return undefined
  if (value === "indeterminate") return "indeterminate"
  if (value === true || value === "true") return true
  if (value === false || value === "false") return false
  if (value === 1) return true
  if (value === 0) return false
  return value as CheckedState
}

/** indeterminate → checked → unchecked → indeterminate (consistent loop). */
function nextTriState(prev: CheckedState): CheckedState {
  if (prev === "indeterminate") return true
  if (prev === true) return false
  return "indeterminate"
}

/** Standard two-state toggle; indeterminate steps to checked. */
function nextBinaryState(prev: CheckedState): CheckedState {
  if (prev === "indeterminate") return true
  return !prev
}

function resolveUncontrolledInitial(
  defaultCheckedProp: CheckedState | undefined,
  indeterminate: boolean
): CheckedState {
  if (defaultCheckedProp !== undefined) {
    const d = normalizeCheckedState(defaultCheckedProp)
    return (d ?? false) as CheckedState
  }
  if (indeterminate) return "indeterminate"
  return false
}

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  /**
   * When `true` (uncontrolled only): initial checked state is **mixed** if `defaultChecked` is omitted,
   * and clicks use the **tri-state loop** (mixed → on → off → mixed). When `false`, use plain
   * on/off toggling unless `defaultChecked` is the literal `'indeterminate'`.
   */
  indeterminate?: boolean
  /** Style overrides: object mapping slot names (checkbox, indicator, icon) to class names. Plain object or CSS module. */
  styleOverrides?: Record<string, string>
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(
  (
    {
      className,
      styleOverrides,
      disabled = false,
      indeterminate = false,
      checked: checkedProp,
      defaultChecked: defaultCheckedProp,
      onCheckedChange,
      ...props
    },
    ref
  ) => {
    const s = mergeStyles(styles, styleOverrides)
    const checkedNorm = normalizeCheckedState(checkedProp)
    const isControlled = checkedProp !== undefined

    const [internal, setInternal] = React.useState<CheckedState>(() =>
      resolveUncontrolledInitial(defaultCheckedProp, indeterminate)
    )

    const prevResetRef = React.useRef<{
      rawDefault: typeof defaultCheckedProp
      indeterminate: boolean
    } | null>(null)

    React.useEffect(() => {
      if (isControlled) return
      const prev = prevResetRef.current
      if (
        prev?.rawDefault === defaultCheckedProp &&
        prev?.indeterminate === indeterminate
      ) {
        return
      }
      prevResetRef.current = { rawDefault: defaultCheckedProp, indeterminate }
      setInternal(resolveUncontrolledInitial(defaultCheckedProp, indeterminate))
    }, [isControlled, defaultCheckedProp, indeterminate])

    const handleUncontrolledChange = React.useCallback(() => {
      setInternal((prev) => {
        const useTriCycle =
          indeterminate ||
          normalizeCheckedState(defaultCheckedProp) === "indeterminate" ||
          prev === "indeterminate"
        const next = useTriCycle ? nextTriState(prev) : nextBinaryState(prev)
        onCheckedChange?.(next)
        return next
      })
    }, [indeterminate, defaultCheckedProp, onCheckedChange])

    if (isControlled) {
      return (
        <CheckboxPrimitive.Root
          ref={ref}
          data-testid="ipa_checkbox"
          data-disabled={disabled}
          className={cn(s.checkbox, className)}
          disabled={disabled}
          checked={checkedNorm as CheckedState}
          onCheckedChange={onCheckedChange}
          {...props}
        >
          <CheckboxPrimitive.Indicator className={s.indicator}>
            <CheckIcon className={cn(s.icon, s.iconCheck)} />
            <Minus className={cn(s.icon, s.iconIndeterminate)} />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
      )
    }

    return (
      <CheckboxPrimitive.Root
        ref={ref}
        data-testid="ipa_checkbox"
        data-disabled={disabled}
        className={cn(s.checkbox, className)}
        disabled={disabled}
        checked={internal}
        onCheckedChange={handleUncontrolledChange}
        {...props}
      >
        <CheckboxPrimitive.Indicator className={s.indicator}>
          <CheckIcon className={cn(s.icon, s.iconCheck)} />
          <Minus className={cn(s.icon, s.iconIndeterminate)} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    )
  }
)

Checkbox.displayName = "Checkbox"

export { Checkbox }
