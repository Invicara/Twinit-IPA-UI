import * as React from 'react';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { DROPDOWN_STYLES } from './dropdown-styles';
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
        DROPDOWN_STYLES.triggerBase,
        "ipa-ui-dropdown-shared__trigger",
        disabled && DROPDOWN_STYLES.disabled,
        className
      )}
    >
      {children}
      {customIcon ? (
        <div className={cn(
          enableIconAnimation && "ipa-ui-dropdown-shared__trigger-icon--transition",
          enableIconAnimation && isOpen && "ipa-ui-dropdown-shared__trigger-icon--rotate-180",
          iconClassName
        )}>
          {customIcon}
        </div>
      ) : (
        <ChevronDownIcon className={cn(
          "ipa-ui-dropdown-shared__trigger-icon",
          enableIconAnimation && "ipa-ui-dropdown-shared__trigger-icon--transition",
          enableIconAnimation && isOpen && "ipa-ui-dropdown-shared__trigger-icon--rotate-180",
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
    <div className={DROPDOWN_STYLES.footer} onClick={onClose}>
      <ChevronDownIcon className="ipa-ui-dropdown-single__trigger-icon" />
    </div>
  );

  return (
    <div className={cn(
      DROPDOWN_STYLES.popup,
      popAbove ? "ipa-ui-dropdown-shared__popup--bottom" : "ipa-ui-dropdown-shared__popup--top",
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
      scrollable ? DROPDOWN_STYLES.scrollContent : "ipa-ui-dropdown-shared__no-scroll-content",
      className
    )}>
      {children}
    </div>
  );
}

