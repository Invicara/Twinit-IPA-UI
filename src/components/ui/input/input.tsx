import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

import { cn, mergeStyles } from "../../../lib/utils"
import styles from "./input.module.css"

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, "size"> {
  // Core Props
  label?: string
  helperText?: string
  state?: "default" | "error" | "success" | "warning" | "readonly"

  // Feature Toggles
  password?: boolean
  textarea?: boolean
  icon?: React.ReactNode

  /** Style overrides: object mapping slot names to class names. Plain object or CSS module. */
  styleOverrides?: Record<string, string>
}


const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      className,
      state = "default",
      label,
      helperText,
      password = false,
      textarea = false,
      icon,
      styleOverrides,
      disabled,
      ...props
    },
    ref
  ) => {
    const s = mergeStyles(styles, styleOverrides)
    const inputId = React.useId()
    const helperId = React.useId()
    const [showPassword, setShowPassword] = React.useState(false)

    const inputType = password && !showPassword ? "password" : props.type || "text"
    const Component = textarea ? "textarea" : "input"

    return (
      <div
        className={s.input}
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
              password && s.withPassword,
              className
            )}
            data-state={state}
            data-disabled={!!disabled}
            {...(textarea ? {} : { type: inputType })}
            id={inputId}
            data-testid="ipa_input"
            ref={ref as any}
            aria-describedby={helperText ? helperId : undefined}
            aria-invalid={state === "error"}
            readOnly={state === "readonly"}
            disabled={disabled}
            {...props}
          />
          {password && (
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
