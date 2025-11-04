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
  iconClassName
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
        "h-[36px] w-[284px]",
        disabled && DROPDOWN_STYLES.disabled,
        className
      )}
    >
      {children}
      {customIcon ? (
        <div className={cn(
          "transition-transform duration-200",
          isOpen && "rotate-180",
          iconClassName
        )}>
          {customIcon}
        </div>
      ) : (
        <ChevronDownIcon className={cn(
          "h-5 w-5 stroke-[1.5] text-neutral-5",
          isOpen && "rotate-180",
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
  footer = true
}: DropdownPopupProps) {
  if (!isOpen) return null;

  return (
    <div className={cn(DROPDOWN_STYLES.popup, className)}>
      {children}
      {footer && (
        <div className={DROPDOWN_STYLES.footer} onClick={onClose}>
          <ChevronDownIcon className="h-5 w-5 text-neutral-5 stroke-[1.5] group-hover:rotate-180 transition-transform duration-200" />
        </div>
      )}
    </div>
  );
}

export function DropdownScrollableContent({ 
  children,
  className
}: { children: ReactNode; className?: string }) {
  return (
    <div className={cn(DROPDOWN_STYLES.scrollContent, className)}>
      {children}
    </div>
  );
}

