import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
 
import { cn } from "../../../lib/utils"

import '../../../output.css'
import Button from "../button/button"
import { DialogProps } from "./dialog.types"


// 1. Define the Dialog variants (mostly for size/width)
const dialogVariants = cva(
  // Ensure consistent rounding here (sm:rounded-lg)
  "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-0 border bg-white shadow-2xl transition-all duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg sm:rounded-lg",
  {
      variants: {
          size: {
              default: "max-w-xl", 
              lg: "max-w-3xl",
          },
      },
      defaultVariants: {
          size: "default",
      },
  }
);

/**
 * Custom Radix-based Dialog component styled to match the Invicara UI design.
 * @param {('modal' | 'non-modal')} type - Determines if background overlay is applied.
 * @param {('default' | 'acknowledgment' | 'passive')} variant - Determines footer actions.
 */
const Dialog: React.FC<DialogProps> = ({
  size = "default",
  type = "modal", // New prop: modal (default) or non-modal
  variant = "default", // New prop: default, acknowledgment, or passive
  title,
  bodyContent,
  actionButtons,
  open,
  onOpenChange,
  className,
  ...props
}) => {

  const isModal = type === 'modal';
  const isPassive = variant === 'passive';
  const isAcknowledgment = variant === 'acknowledgment';
  
  // Logic to determine footer content based on variant
  const footerContent = React.useMemo(() => {
      if (isPassive) return null;

      if (isAcknowledgment) {
          return (
              <DialogPrimitive.Close asChild>
                  <Button variant="default">OK</Button>
              </DialogPrimitive.Close>
          );
      }
      
      // Default variant
      return actionButtons;
  }, [variant, actionButtons]);


  const Content = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { className?: string }>(({ className, ...props }, ref) => (
      <DialogPrimitive.Portal>
          {/* Conditional Overlay for Modal Type - made darker (bg-black/75) */}
          {isModal && (
              <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/75 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          )}
          
          <DialogPrimitive.Content
              ref={ref}
              // Disables pointer events if non-modal, so user can click background
              className={cn(dialogVariants({ size }), className, !isModal && "pointer-events-auto")}
              {...props}
          >
              {/* 1. Header (Fixed): Apply rounded-t-lg to match dialog corners */}
              <div className="flex items-center justify-between bg-gray-50 p-4 text-gray-800 rounded-t-lg">
                  <DialogPrimitive.Title asChild>
                      <h2 className="text-lg font-semibold">{title}</h2>
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Close asChild>
                      <button
                          // Fix: Removed focus-visible outline/ring to stop border on click
                          className="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-0 focus-visible:outline-none disabled:pointer-events-none"
                          aria-label="Close"
                      >
                          <X className="h-5 w-5 text-gray-500" />
                      </button>
                  </DialogPrimitive.Close>
              </div>

              {/* 2. Body (Scrollable with Max Height) */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-white">
                  {bodyContent}
              </div>

              {/* 3. Actions (Fixed Footer) - Apply rounded-b-lg to match dialog corners */}
              {footerContent && (
                  <div className="flex justify-end p-4 bg-gray-50/50 rounded-b-lg">
                      {footerContent}
                  </div>
              )}

          </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
  ));
  Content.displayName = "Dialog";


  return (
      <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
          <Content {...props} />
      </DialogPrimitive.Root>
  )
}

export { Dialog, dialogVariants }
export default Dialog;