import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../../lib/utils";
import Button from "../button/button";
import '../../../output.css';
import { DialogProps } from "./dialog.types";

// Style constants
const DIALOG_STYLES = {
  overlay: "fixed inset-0 z-50 bg-neutral-10/75 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  content: "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-0 border-0 bg-neutral-0 shadow-[0_4px_24px_rgba(0,0,0,0.15)] transition-all duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-[8px]",
  header: "flex items-center justify-between bg-neutral-1 px-6 py-5 text-neutral-10 rounded-t-[8px]",
  title: "text-[20px] font-bold font-sans leading-tight",
  closeButton: "transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-0 disabled:pointer-events-none",
  body: "px-6 py-6 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar",
  footer: "flex justify-end gap-3 px-6 py-5 bg-neutral-0 rounded-b-[8px]",
  
  sizes: {
    sm: "max-w-md",
    default: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
    full: "max-w-[90vw]"
  }
} as const;

export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      className,
      size = 'default',
      title,
      children,
      footer,
      open,
      onOpenChange,
      hideOverlay = false,
      acknowledgment = false,
      passive = false,
      disableClickOutside = false,
      disableCloseButton = false,
      disableEscapeKey = false,
      classNames,
      ...props
    },
    ref
  ) => {
    // Determine footer content based on props
    const footerContent = React.useMemo(() => {
      if (passive) return null;
      
      if (acknowledgment) {
        return (
          <DialogPrimitive.Close asChild>
            <Button variant="default">OK</Button>
          </DialogPrimitive.Close>
        );
      }
      
      return footer;
    }, [passive, acknowledgment, footer]);

    return (
      <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
        <DialogPrimitive.Portal>
          {/* Conditional overlay for modal/non-modal */}
          {!hideOverlay && (
            <DialogPrimitive.Overlay 
              className={cn(DIALOG_STYLES.overlay, classNames?.overlay)} 
            />
          )}
          
          <DialogPrimitive.Content
            ref={ref}
            className={cn(
              DIALOG_STYLES.content,
              DIALOG_STYLES.sizes[size],
              hideOverlay && "pointer-events-auto",
              classNames?.content,
              className
            )}
            onInteractOutside={(e) => {
              if (disableClickOutside) e.preventDefault();
            }}
            onEscapeKeyDown={(e) => {
              if (disableEscapeKey) e.preventDefault();
            }}
            {...props}
          >
            {/* Header */}
            <div className={cn(DIALOG_STYLES.header, classNames?.header)}>
              <DialogPrimitive.Title asChild>
                <h2 className={cn(DIALOG_STYLES.title, classNames?.title)}>
                  {title}
                </h2>
              </DialogPrimitive.Title>
              {!disableCloseButton && (
                <DialogPrimitive.Close asChild>
                  <button
                    className={cn(DIALOG_STYLES.closeButton, classNames?.closeButton)}
                    aria-label="Close"
                  >
                    <X className="h-5 w-5 text-neutral-10" strokeWidth={2} />
                  </button>
                </DialogPrimitive.Close>
              )}
            </div>

            {/* Body (Scrollable) */}
            <div className={cn(DIALOG_STYLES.body, classNames?.body)}>
              {children}
            </div>

            {/* Footer (Conditional) */}
            {footerContent && (
              <div className={cn(DIALOG_STYLES.footer, classNames?.footer)}>
                {footerContent}
              </div>
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    );
  }
);

Dialog.displayName = "Dialog";

export default Dialog;
