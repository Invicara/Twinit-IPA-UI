import * as React from "react"
import { cva } from "class-variance-authority"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "../../../lib/utils"

import '../../../output.css'
import { InputProps } from "./input.types"

const inputVariants = cva(
  // Base styles matching Figma Section 1: 36px height (or min-height for textarea), 4px border radius, Inter Regular 14px
  "flex w-full rounded-[4px] border bg-neutral-0 px-[12px] py-[8px] font-sans text-[14px] font-normal leading-[18px] text-neutral-9 placeholder:text-neutral-4 transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      state: {
        default: "border-neutral-5 hover:border-neutral-7 focus:border-digital-twin-6",
        error: "border-alert-7 focus:border-alert-5",
        success: "border-positive-7 focus:border-positive-5",
        warning: "border-warning-9 focus:border-warning-7",
        readonly: "border-neutral-3 bg-neutral-1 text-neutral-5 placeholder:text-neutral-3 select-text cursor-text",
      },
      variant: {
        input: "h-[36px]",
        textarea: "min-h-[80px] resize-y",
      },
    },
    defaultVariants: {
      state: "default",
      variant: "input",
    },
  }
)

const labelVariants = cva(
  "font-sans text-[14px] font-medium leading-[18px] flex items-center gap-[8px]",
  {
    variants: {
      state: {
        default: "text-neutral-9",
        error: "text-alert-7",
        success: "text-positive-7",
        warning: "text-warning-9",
        readonly: "text-neutral-9",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
)

const helperTextVariants = cva(
  "font-sans text-[13px] font-normal leading-[17.5px]",
  {
    variants: {
      state: {
        default: "text-neutral-7",
        error: "text-alert-7",
        success: "text-positive-7",
        warning: "text-warning-9",
        readonly: "text-neutral-7",
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
      <div className="w-full flex flex-col gap-[4px]">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(labelVariants({ state }))}
          >
            {label}
          </label>
        )}
        <div className="relative w-full">
          {Icon && (
            <div className="absolute left-[12px] top-1/2 -translate-y-1/2 text-neutral-5 pointer-events-none">
              <Icon className="h-[16px] w-[16px]" />
            </div>
          )}
          <Component
            id={inputId}
            data-testid={testIdPrefix}
            className={cn(
              inputVariants({ state, variant, className }),
              Icon && "pl-[36px]",
              password && "pr-[36px]"
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
              className="absolute right-[12px] top-1/2 -translate-y-1/2 text-neutral-5 hover:text-neutral-7 transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <Eye className="h-[16px] w-[16px]" />
              ) : (
                <EyeOff className="h-[16px] w-[16px]" />
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
