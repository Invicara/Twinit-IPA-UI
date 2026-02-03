import * as React from "react"
import { cva } from "class-variance-authority"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "../../../lib/utils"

import '../../../output.css'
import { InputProps } from "./input.types"
import styles from "./input.module.css"

const inputVariants = cva(
  styles.base,
  {
    variants: {
      state: {
        default: styles.stateDefault,
        error: styles.stateError,
        success: styles.stateSuccess,
        warning: styles.stateWarning,
        readonly: styles.stateReadonly,
      },
      variant: {
        input: styles.variantInput,
        textarea: styles.variantTextarea,
      },
    },
    defaultVariants: {
      state: "default",
      variant: "input",
    },
  }
)

const labelVariants = cva(
  styles.label,
  {
    variants: {
      state: {
        default: styles.labelStateDefault,
        error: styles.labelStateError,
        success: styles.labelStateSuccess,
        warning: styles.labelStateWarning,
        readonly: styles.labelStateReadonly,
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
)

const helperTextVariants = cva(
  styles.helperText,
  {
    variants: {
      state: {
        default: styles.helperTextStateDefault,
        error: styles.helperTextStateError,
        success: styles.helperTextStateSuccess,
        warning: styles.helperTextStateWarning,
        readonly: styles.helperTextStateReadonly,
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
)

const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ className, state = "default", testIdPrefix, label, helperText, password = false, textarea = false, icon: Icon, ...props }, ref) => {
    const inputId = React.useId()
    const helperId = React.useId()
    const [showPassword, setShowPassword] = React.useState(false)

    const inputType = password && !showPassword ? "password" : props.type || "text"
    const variant = textarea ? "textarea" : "input"
    const Component = textarea ? "textarea" : "input"

    return (
      <div className={styles.container}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(labelVariants({ state }))}
          >
            {label}
          </label>
        )}
        <div className={styles.wrapper}>
          {Icon && (
            <div className={styles.iconContainer}>
              <Icon className={styles.icon} />
            </div>
          )}
          <Component
            id={inputId}
            data-testid={testIdPrefix}
            className={cn(
              inputVariants({ state, variant, className }),
              Icon && styles.withIcon,
              password && styles.withPassword
            )}
            ref={ref as any}
            aria-describedby={helperText ? helperId : undefined}
            readOnly={state === "readonly"}
            {...(textarea ? {} : { type: inputType })}
            {...props}
          />
          {password && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.passwordToggle}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <Eye className={styles.passwordToggleIcon} />
              ) : (
                <EyeOff className={styles.passwordToggleIcon} />
              )}
            </button>
          )}
        </div>
        {helperText && (
          <p id={helperId} className={cn(helperTextVariants({ state }))}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
export default Input
