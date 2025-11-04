import * as React from "react";
import { cn } from "../../../lib/utils";
import { XIcon } from "../../icons";
import { DROPDOWN_STYLES } from "./shared/dropdown-styles";
import { DropdownTrigger, DropdownPopup, DropdownScrollableContent } from "./shared/dropdown-base";
import { useClickOutside } from "./shared/dropdown-hooks";
import { useDropdownKeyboard } from "./shared/use-dropdown-keyboard";
import { startTextAnimation, stopTextAnimation, truncateText } from "./shared/dropdown-text-utils";
import '../../../output.css';

export interface MultiSelectProps {
  className?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  value?: string[];
  onChange?: (value: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
  maxDisplayBadges?: number;
  icons?: {
    trigger?: React.ReactNode;
    close?: React.ReactNode;
    check?: React.ReactNode;
  };
  classNames?: {
    container?: string;
    trigger?: string;
    triggerContent?: string;
    triggerIcon?: string;
    badge?: string;
    badgeText?: string;
    badgeRemove?: string;
    badgeRemoveIcon?: string;
    remainingBadge?: string;
    placeholder?: string;
    popup?: string;
    header?: string;
    scrollContent?: string;
    item?: string;
    itemFocused?: string;
    itemDisabled?: string;
    checkbox?: string;
    checkboxChecked?: string;
    checkIcon?: string;
    itemText?: string;
    ellipsis?: string;
    footer?: string;
  };
}

export const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      className,
      options,
      value = [],
      onChange,
      disabled,
      placeholder = 'Select multiple options',
      maxDisplayBadges = 2,
      icons,
      classNames,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    const {
      focusedIndex,
      isKeyboardMode,
      handleKeyDown,
      handleMouseEnter,
      setItemRef,
      resetFocus
    } = useDropdownKeyboard({
      isOpen,
      options,
      onSelect: (value) => {
        handleMultiSelect(value);
        resetFocus();
      },
      onClose: () => setIsOpen(false)
    });

    useClickOutside(dropdownRef, () => {
      setIsOpen(false);
      resetFocus();
    }, isOpen);

    const getSelectedOptions = () => {
      return options.filter(option => value.includes(option.value));
    };

    const getDisplayBadges = () => {
      const selected = getSelectedOptions();
      const visibleBadges = selected.slice(0, maxDisplayBadges);
      const remainingCount = selected.length - maxDisplayBadges;
      return { visibleBadges, remainingCount };
    };

    const handleMultiSelect = (optionValue: string) => {
      if (!onChange) return;
      const newValues = value.includes(optionValue)
        ? value.filter(v => v !== optionValue)
        : [...value, optionValue];
      onChange(newValues);
    };

    const handleRemoveBadge = (optionValue: string) => {
      if (!onChange) return;
      onChange(value.filter(v => v !== optionValue));
    };

    const { visibleBadges, remainingCount } = getDisplayBadges();

    const triggerKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          handleKeyDown(e);
        }
      } else if (isOpen) {
        handleKeyDown(e);
      }
    };

    return (
      <div 
        className={cn("relative", classNames?.container)} 
        ref={(node) => {
          dropdownRef.current = node;
          if (ref) {
            if (typeof ref === 'function') {
              ref(node);
            } else {
              ref.current = node;
            }
          }
        }} 
        {...props}
      >
        <DropdownTrigger
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={triggerKeyDown}
          disabled={disabled}
          isOpen={isOpen}
          className={cn("min-h-[36px]", className, classNames?.trigger)}
          customIcon={icons?.trigger}
          iconClassName={classNames?.triggerIcon}
        >
          <div className={cn("flex flex-wrap gap-1 flex-1 min-w-0", classNames?.triggerContent)}>
            {visibleBadges.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "inline-flex items-center gap-1 bg-brand-3 text-brand-8 px-2 py-1 rounded-[4px] text-xs font-medium",
                  classNames?.badge
                )}
              >
                <span className={classNames?.badgeText}>{truncateText(option.label)}</span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveBadge(option.value);
                  }}
                  className={cn(
                    "hover:bg-brand-8/20 rounded-[4px] p-0.5 cursor-pointer",
                    classNames?.badgeRemove
                  )}
                >
                  {icons?.close || <XIcon className={cn("text-brand-8", classNames?.badgeRemoveIcon)} />}
                </span>
              </div>
            ))}
            {remainingCount > 0 && (
              <div className={cn(
                "inline-flex items-center bg-brand-3 text-brand-8 px-2 py-1 rounded-[4px] text-xs font-medium",
                classNames?.remainingBadge
              )}>
                +{remainingCount}
              </div>
            )}
            {value.length === 0 && (
              <span className={cn("text-neutral-4", classNames?.placeholder)}>{placeholder}</span>
            )}
          </div>
        </DropdownTrigger>
        
        <DropdownPopup isOpen={isOpen} onClose={() => setIsOpen(false)} className={classNames?.popup}>
          {/* Static Header */}
          <div className={cn("px-[4px] py-[4px] bg-neutral-0 flex flex-shrink-0", classNames?.header)}>
            <span className="px-[6px] text-[13px] text-neutral-4">
              {value.length} selected
            </span>
          </div>
          
          {/* Scrollable Content */}
          <DropdownScrollableContent className={classNames?.scrollContent}>
            {options.map((option, index) => (
              <button
                key={option.value}
                type="button"
                disabled={option.disabled}
                onClick={() => handleMultiSelect(option.value)}
                className={cn(
                  DROPDOWN_STYLES.itemBase,
                  focusedIndex === index && "bg-brand-1",
                  !isKeyboardMode && "hover:bg-brand-1",
                  classNames?.item,
                  focusedIndex === index && classNames?.itemFocused,
                  option.disabled && classNames?.itemDisabled
                )}
                ref={(el) => {
                  setItemRef(el, index);
                  if (el) {
                    const textElement = el.querySelector('.scrollable-text') as HTMLElement;
                    const ellipsisElement = el.querySelector('.ellipsis-indicator') as HTMLElement;
                    if (textElement && ellipsisElement && textElement.scrollWidth <= textElement.clientWidth) {
                      ellipsisElement.style.display = 'none';
                    }
                  }
                }}
                onMouseEnter={(e) => {
                  handleMouseEnter(index);
                  const textElement = e.currentTarget.querySelector('.scrollable-text') as HTMLElement;
                  const ellipsisElement = e.currentTarget.querySelector('.ellipsis-indicator') as HTMLElement;
                  if (textElement && textElement.scrollWidth > textElement.clientWidth) {
                    startTextAnimation(textElement);
                    if (ellipsisElement) {
                      ellipsisElement.style.opacity = '0';
                    }
                  }
                }}
                onMouseLeave={(e) => {
                  const textElement = e.currentTarget.querySelector('.scrollable-text') as HTMLElement;
                  const ellipsisElement = e.currentTarget.querySelector('.ellipsis-indicator') as HTMLElement;
                  if (textElement) {
                    stopTextAnimation(textElement);
                  }
                  if (ellipsisElement) {
                    ellipsisElement.style.opacity = '1';
                  }
                }}
              >
                <div className="mr-3 flex items-center justify-center">
                  <div
                    className={cn(
                      "w-4 h-4 rounded-[4px] flex items-center justify-center border",
                      value.includes(option.value) 
                        ? "bg-brand-8 border-brand-8" 
                        : "bg-white border-neutral-5",
                      classNames?.checkbox,
                      value.includes(option.value) && classNames?.checkboxChecked
                    )}
                  >
                    {value.includes(option.value) && (
                      icons?.check || (
                        <svg 
                          width="12" 
                          height="12" 
                          viewBox="0 0 12 12" 
                          fill="none" 
                          className={cn("text-white", classNames?.checkIcon)}
                        >
                          <path 
                            d="M2 6.5L4.5 9L10 3.5" 
                            stroke="currentColor" 
                            strokeWidth="2.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </svg>
                      )
                    )}
                  </div>
                </div>
                <div className="flex-1 overflow-hidden relative">
                  <span className={cn("scrollable-text whitespace-nowrap block text-left", classNames?.itemText)}>
                    {option.label}
                  </span>
                  <span className={cn("ellipsis-indicator absolute right-0 top-0 bg-neutral-0 px-1 text-neutral-6", classNames?.ellipsis)}>
                    ..
                  </span>
                </div>
              </button>
            ))}
          </DropdownScrollableContent>
        </DropdownPopup>
      </div>
    );
  }
);

MultiSelect.displayName = "MultiSelect";

