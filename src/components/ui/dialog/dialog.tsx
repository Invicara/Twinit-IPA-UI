import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "../../../lib/utils"
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

  // Custom Classnames for Sub-components
  classNames?: {
    dialog?: string
    content?: string
    header?: string
    title?: string
    closeButton?: string
    body?: string
    footer?: string
  }
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
      classNames,
      container,
      ...props
    },
    ref
  ) => {
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
              className={cn(styles.dialog, classNames?.dialog)}
            />
          )}

          <DialogPrimitive.Content
            ref={ref}
            data-size={size}
            className={cn(
              styles.content,
              hideOverlay && styles.contentPointerEventsAuto,
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
            <div className={cn(styles.header, classNames?.header)}>
              <DialogPrimitive.Title asChild>
                <h2 className={cn(styles.title, classNames?.title)}>
                  {title}
                </h2>
              </DialogPrimitive.Title>
              {!disableCloseButton && (
                <DialogPrimitive.Close asChild>
                  <button
                    type="button"
                    className={cn(styles.closeButton, classNames?.closeButton)}
                    aria-label="Close"
                  >
                    <X className={styles.closeButtonIcon} strokeWidth={2} />
                  </button>
                </DialogPrimitive.Close>
              )}
            </div>

            {/* Body (Scrollable) */}
            <div className={cn(styles.body, "custom-scrollbar", classNames?.body)}>
              {children}
            </div>

            {/* Footer (Conditional) */}
            {footerContent && (
              <div className={cn(styles.footer, classNames?.footer)}>
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
