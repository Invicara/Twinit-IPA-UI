import * as React from "react"
import { Eye, EyeOff, X } from "lucide-react"

import { cn, mergeStyles } from "../../../lib/utils"
import styles from "./input.module.css"

export type InputSize = "default" | "sm" | "lg"

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, "size"> {
  // Core Props
  label?: string
  helperText?: string
  state?: "default" | "error" | "success" | "warning" | "readonly"
  size?: InputSize

  // Feature Toggles
  password?: boolean
  textarea?: boolean
  icon?: React.ReactNode
  /** When true, shows an X control inside the field to clear the current value. */
  clearable?: boolean

  /** When true, outer wrapper uses fit-content width instead of 100%. */
  fitContent?: boolean

  /** Style overrides: object mapping slot names to class names. Plain object or CSS module. */
  styleOverrides?: Record<string, string>
}


const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      className,
      state = "default",
      size = "default",
      label,
      helperText,
      password = false,
      textarea = false,
      icon,
      clearable = false,
      fitContent = false,
      styleOverrides,
      disabled,
      type,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const s = mergeStyles(styles, styleOverrides)
    const inputId = React.useId()
    const helperId = React.useId()
    const [showPassword, setShowPassword] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement | HTMLTextAreaElement>(null)
    const isControlled = value !== undefined
    const [uncontrolledValue, setUncontrolledValue] = React.useState(
      String(defaultValue ?? "")
    )

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement & HTMLTextAreaElement)

    const currentValue = isControlled ? String(value ?? "") : uncontrolledValue
    const showClearButton =
      clearable &&
      !textarea &&
      !disabled &&
      state !== "readonly" &&
      currentValue.length > 0

    const showPasswordToggle = password && !textarea
    const inputValueProps = isControlled
      ? { value }
      : defaultValue !== undefined
        ? { defaultValue }
        : {}

    const inputType =
      password && !showPassword ? "password" : type ?? "text"
    const Component = textarea ? "textarea" : "input"

    const handleChange = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      if (!isControlled) {
        setUncontrolledValue(event.target.value)
      }
      onChange?.(event)
    }

    const setInputRef = React.useCallback(
      (node: HTMLInputElement | HTMLTextAreaElement | null) => {
        inputRef.current = node
      },
      []
    )

    const handleClear = () => {
      if (disabled || !inputRef.current) return

      const input = inputRef.current
      const prototype = textarea
        ? window.HTMLTextAreaElement.prototype
        : window.HTMLInputElement.prototype
      const valueSetter = Object.getOwnPropertyDescriptor(prototype, "value")?.set

      valueSetter?.call(input, "")
      if (!isControlled) {
        setUncontrolledValue("")
      }

      onChange?.({
        target: { ...input, value: "" },
        currentTarget: input,
      } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)

      input.focus()
    }

    return (
      <div
        className={cn(
          s.input,
          fitContent && s.inputFitContent,
          className
        )}
        data-fit-content={fitContent || undefined}
        data-state={state}
      >
        {label && (
          <label
            className={s.label}
            data-state={state}
            htmlFor={inputId}
          >
            {label}
          </label>
        )}
        <div className={s.wrapper}>
          {icon != null && (
            <div className={s.iconContainer}>
              <span className={s.icon}>{icon}</span>
            </div>
          )}
          <Component
            className={cn(
              s.inputBox,
              textarea ? s.variantTextarea : s.variantInput,
              icon != null && s.withIcon,
              showPasswordToggle && s.withPassword,
              showClearButton && s.withClear
            )}
            data-state={state}
            data-size={size}
            data-disabled={!!disabled}
            id={inputId}
            data-testid="ipa_input"
            ref={setInputRef as React.Ref<HTMLInputElement & HTMLTextAreaElement>}
            aria-describedby={helperText ? helperId : undefined}
            aria-invalid={state === "error"}
            readOnly={state === "readonly"}
            disabled={disabled}
            onChange={handleChange}
            {...inputValueProps}
            {...props}
            {...(textarea ? {} : { type: inputType })}
          />
          {showClearButton && (
            <button
              className={cn(
                s.clearButton,
                showPasswordToggle && s.clearButtonWithPassword
              )}
              type="button"
              data-size={size}
              onClick={(event) => {
                event.preventDefault()
                handleClear()
              }}
              tabIndex={-1}
              aria-label="Clear input"
              data-testid="ipa_input_clear"
            >
              <X className={s.clearButtonIcon} aria-hidden strokeWidth={2} />
            </button>
          )}
          {showPasswordToggle && (
            <button
              className={s.passwordToggle}
              type="button"
              onClick={() => !disabled && setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={disabled}
            >
              {showPassword ? (
                <Eye className={s.passwordToggleIcon} />
              ) : (
                <EyeOff className={s.passwordToggleIcon} />
              )}
            </button>
          )}
        </div>
        {helperText && (
          <p
            className={s.helperText}
            data-state={state}
            id={helperId}
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
export default Input
