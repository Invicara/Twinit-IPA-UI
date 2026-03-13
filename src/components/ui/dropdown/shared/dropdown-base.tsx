import * as React from 'react';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { cn } from '../../../../lib/utils';
import type { ReactNode } from 'react';

export function DropdownTrigger({
  onClick,
  disabled,
  children,
  isOpen = false,
  className,
  customTrigger,
  onKeyDown,
  customIcon,
  iconClassName,
  enableIconAnimation = true,
  styles: s
}: {
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
  isOpen?: boolean;
  className?: string;
  customTrigger?: ReactNode;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  customIcon?: ReactNode;
  iconClassName?: string;
  enableIconAnimation?: boolean;
  styles: Record<string, string>;
}) {
  if (customTrigger) {
    return <>{customTrigger}</>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={onKeyDown}
      disabled={disabled}
      data-disabled={disabled ? "true" : undefined}
      data-state={isOpen ? "open" : "closed"}
      className={cn(s.triggerBase, className)}
    >
      {children}
      {customIcon ? (
        <div className={cn(
          enableIconAnimation && s.triggerIconTransition,
          s.triggerIcon,
          iconClassName
        )}>
          {customIcon}
        </div>
      ) : (
        <ChevronDownIcon className={cn(
          s.triggerIcon,
          enableIconAnimation && s.triggerIconTransition,
          iconClassName
        )} />
      )}
    </button>
  );
}

export function DropdownPopup({
  isOpen,
  onClose,
  children,
  className,
  footer = true,
  popAbove = false,
  styles: s
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  footer?: boolean;
  popAbove?: boolean;
  styles: Record<string, string>;
}) {
  if (!isOpen) return null;

  const footerElement = footer && (
    <div className={s.footer} onClick={onClose}>
      <ChevronDownIcon className={s.triggerIcon} />
    </div>
  );

  return (
    <div
      role="listbox"
      data-position={popAbove ? "top" : "bottom"}
      className={cn(s.popup, className)}
    >
      {popAbove && footerElement}
      {children}
      {!popAbove && footerElement}
    </div>
  );
}

export function DropdownScrollableContent({
  children,
  className,
  scrollable = true,
  styles: s
}: {
  children: ReactNode;
  className?: string;
  scrollable?: boolean;
  styles: Record<string, string>;
}) {
  return (
    <div
      className={cn(s.scrollContent, scrollable && 'custom-scrollbar', className)}
      data-scrollable={scrollable ? "true" : undefined}
    >
      {children}
    </div>
  );
}
