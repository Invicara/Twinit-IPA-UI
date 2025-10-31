import * as React from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
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
        className="relative" 
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
          className={cn("min-h-[36px]", className)}
        >
          <div className="flex flex-wrap gap-1 flex-1 min-w-0">
            {visibleBadges.map((option) => (
              <div
                key={option.value}
                className="inline-flex items-center gap-1 bg-brand-3 text-brand-8 px-2 py-1 rounded-[4px] text-xs font-medium"
              >
                <span>{truncateText(option.label)}</span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveBadge(option.value);
                  }}
                  className="hover:bg-brand-8/20 rounded-[4px] p-0.5 cursor-pointer"
                >
                  <XIcon className="text-brand-8" />
                </span>
              </div>
            ))}
            {remainingCount > 0 && (
              <div className="inline-flex items-center bg-brand-3 text-brand-8 px-2 py-1 rounded-[4px] text-xs font-medium">
                +{remainingCount}
              </div>
            )}
            {value.length === 0 && (
              <span className="text-neutral-4">{placeholder}</span>
            )}
          </div>
        </DropdownTrigger>
        
        <DropdownPopup isOpen={isOpen} onClose={() => setIsOpen(false)}>
          {/* Static Header */}
          <div className="px-[4px] py-[4px] bg-neutral-0 flex flex-shrink-0">
            <span className="px-[6px] text-[13px] text-neutral-4">
              {value.length} selected
            </span>
          </div>
          
          {/* Scrollable Content */}
          <DropdownScrollableContent>
            {options.map((option, index) => (
              <button
                key={option.value}
                type="button"
                disabled={option.disabled}
                onClick={() => handleMultiSelect(option.value)}
                className={cn(
                  DROPDOWN_STYLES.itemBase,
                  focusedIndex === index && "bg-brand-1",
                  !isKeyboardMode && "hover:bg-brand-1"
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
                        : "bg-white border-neutral-5"
                    )}
                  >
                    {value.includes(option.value) && (
                      <svg 
                        width="12" 
                        height="12" 
                        viewBox="0 0 12 12" 
                        fill="none" 
                        className="text-white"
                      >
                        <path 
                          d="M2 6.5L4.5 9L10 3.5" 
                          stroke="currentColor" 
                          strokeWidth="2.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex-1 overflow-hidden relative">
                  <span className="scrollable-text whitespace-nowrap block text-left">
                    {option.label}
                  </span>
                  <span className="ellipsis-indicator absolute right-0 top-0 bg-neutral-0 px-1 text-neutral-6">
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

