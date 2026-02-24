import * as React from 'react';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import styles from './dropdown-base.module.css';
import { cn } from '../../../../lib/utils';
import type { ReactNode } from 'react';

interface DropdownPopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  footer?: boolean;
  popAbove?: boolean;
}

interface DropdownTriggerProps {
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
}

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
  enableIconAnimation = true
}: DropdownTriggerProps) {
  if (customTrigger) {
    return <>{customTrigger}</>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={onKeyDown}
      disabled={disabled}
      className={cn(
        styles.triggerBase,
        styles.trigger,
        disabled && styles.triggerDisabled,
        className
      )}
    >
      {children}
      {customIcon ? (
        <div className={cn(
          enableIconAnimation && styles.triggerIconTransition,
          enableIconAnimation && isOpen && styles.triggerIconRotate180,
          iconClassName
        )}>
          {customIcon}
        </div>
      ) : (
        <ChevronDownIcon className={cn(
          styles.triggerIcon,
          enableIconAnimation && styles.triggerIconTransition,
          enableIconAnimation && isOpen && styles.triggerIconRotate180,
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
  popAbove = false
}: DropdownPopupProps) {
  if (!isOpen) return null;

  const footerElement = footer && (
    <div className={styles.footer} onClick={onClose}>
      <ChevronDownIcon className={cn(styles.triggerIcon)} />
    </div>
  );

  return (
    <div className={cn(
      styles.popup,
      popAbove ? styles.popupBottom : styles.popupTop,
      className
    )}>
      {popAbove && footerElement}
      {children}
      {!popAbove && footerElement}
    </div>
  );
}

export function DropdownScrollableContent({ 
  children,
  className,
  scrollable = true
}: { children: ReactNode; className?: string; scrollable?: boolean }) {
  return (
    <div className={cn(
      scrollable ? cn(styles.scrollContent, 'custom-scrollbar') : styles.noScrollContent,
      className
    )}>
      {children}
    </div>
  );
}
