import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "../../../lib/utils"
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
  
  classNames?: {
    input?: string
    label?: string
    wrapper?: string
    iconContainer?: string
    icon?: string
    inputBox?: string
    passwordToggle?: string
    passwordToggleIcon?: string
    helperText?: string
  }
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
      classNames,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = React.useId()
    const helperId = React.useId()
    const [showPassword, setShowPassword] = React.useState(false)

    const inputType = password && !showPassword ? "password" : props.type || "text"
    const Component = textarea ? "textarea" : "input"

    return (
      <div
        className={cn(styles.input, classNames?.input)}
        data-state={state}
      >
        {label && (
          <label
            className={cn(styles.label, classNames?.label)}
            data-state={state}
            htmlFor={inputId}
          >
            {label}
          </label>
        )}
        <div className={cn(styles.wrapper, classNames?.wrapper)}>
          {icon != null && (
            <div className={cn(styles.iconContainer, classNames?.iconContainer)}>
              <span className={cn(styles.icon, classNames?.icon)}>{icon}</span>
            </div>
          )}
          <Component
            className={cn(
              styles.inputBox,
              textarea ? styles.variantTextarea : styles.variantInput,
              icon != null && styles.withIcon,
              password && styles.withPassword,
              className,
              classNames?.inputBox
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
              className={cn(styles.passwordToggle, classNames?.passwordToggle)}
              type="button"
              onClick={() => !disabled && setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={disabled}
            >
              {showPassword ? (
                <Eye className={cn(styles.passwordToggleIcon, classNames?.passwordToggleIcon)} />
              ) : (
                <EyeOff className={cn(styles.passwordToggleIcon, classNames?.passwordToggleIcon)} />
              )}
            </button>     
          )}
        </div>
        {helperText && (
          <p
            className={cn(styles.helperText, classNames?.helperText)}
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
