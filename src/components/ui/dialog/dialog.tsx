import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn, mergeStyles } from "../../../lib/utils"
import { Button } from "../button"
import styles from "./dialog.module.css"

export interface DialogProps {
  // Core Props
  className?: string
  size?: "sm" | "default" | "lg" | "xl" | "full"
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void

  // Feature Toggles
  hideOverlay?: boolean;           // Non-modal mode - no dark background overlay
  acknowledgment?: boolean;        // Auto-generate "OK" button footer
  passive?: boolean;               // Hide footer entirely
  disableClickOutside?: boolean;   // Prevent closing by clicking outside dialog
  disableCloseButton?: boolean;    // Hide the X close button in header
  disableEscapeKey?: boolean;      // Prevent closing with Escape key

  /** Portal container (e.g. element with id "ipa-ui-modal-root" inside theme wrapper so modals inherit theme variables) */
  container?: HTMLElement | null

  /** Style overrides: object mapping slot names (dialog, content, header, title, closeButton, body, footer) to class names. Plain object or CSS module. */
  styleOverrides?: Record<string, string>
}

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
      styleOverrides,
      container,
      ...props
    },
    ref
  ) => {
    const s = mergeStyles(styles, styleOverrides)
    const portalContainer =
      container ??
      (typeof document !== 'undefined'
        ? document.getElementById('ipa-ui-modal-root') ?? undefined
        : undefined);

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
        <DialogPrimitive.Portal container={portalContainer}>
          {/* Conditional overlay for modal/non-modal */}
          {!hideOverlay && (
            <DialogPrimitive.Overlay
              data-testid="ipa_dialog_overlay"
              className={s.dialog}
            />
          )}

          <DialogPrimitive.Content
            ref={ref}
            data-size={size}
            className={cn(
              s.content,
              hideOverlay && s.contentPointerEventsAuto,
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
            <div className={s.header}>
              <DialogPrimitive.Title asChild>
                <h2 className={s.title}>
                  {title}
                </h2>
              </DialogPrimitive.Title>
              {!disableCloseButton && (
                <DialogPrimitive.Close asChild>
                  <button
                    type="button"
                    className={s.closeButton}
                    aria-label="Close"
                  >
                    <X className={s.closeButtonIcon} strokeWidth={2} />
                  </button>
                </DialogPrimitive.Close>
              )}
            </div>

            {/* Body (Scrollable) */}
            <div className={cn(s.body, "custom-scrollbar")}>
              {children}
            </div>

            {/* Footer (Conditional) */}
            {footerContent && (
              <div className={s.footer}>
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
