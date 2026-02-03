import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../../lib/utils";
import Button from "../button/button";
import '../../../output.css';
import { DialogProps } from "./dialog.types";
import styles from "./dialog.module.css";

const sizeClasses = {
  sm: styles.sizeSm,
  default: styles.sizeDefault,
  lg: styles.sizeLg,
  xl: styles.sizeXl,
  full: styles.sizeFull
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

    console.log('Dialog render open', open);
    return (
      <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
        <DialogPrimitive.Portal>
          {/* Conditional overlay for modal/non-modal */}
          {!hideOverlay && (
            <DialogPrimitive.Overlay 
              className={cn(
                styles.overlay,
                classNames?.overlay 
              )}
            />
          )}

          <DialogPrimitive.Content
            ref={ref}
            className={cn(
              styles.content,
              sizeClasses[size],
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
