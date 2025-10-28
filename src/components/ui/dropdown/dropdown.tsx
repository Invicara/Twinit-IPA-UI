import * as React from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { cn } from "../../../lib/utils";
import { XIcon } from "../../icons";

import '../../../output.css';

interface DropdownProps {
  className?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  disabled?: boolean;
  variant?: 'single' | 'multiselect';
  placeholder?: string;
  maxDisplayBadges?: number;
}

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      className,
      options,
      value,
      onChange,
      disabled,
      variant = 'single',
      placeholder = 'Default',
      maxDisplayBadges = 2,
      ...props
    },
    ref
  ) => {
    const isMultiselect = variant === 'multiselect';
    const selectedValues = isMultiselect ? (Array.isArray(value) ? value : []) : [];
    const singleValue = isMultiselect ? '' : (typeof value === 'string' ? value : '');

    const handleMultiSelect = (optionValue: string) => {
      if (!onChange) return;
      
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue];
      
      onChange(newValues);
    };

    const handleRemoveBadge = (optionValue: string) => {
      if (!onChange || !isMultiselect) return;
      
      const newValues = selectedValues.filter(v => v !== optionValue);
      onChange(newValues);
    };

    const getSelectedOptions = () => {
      return options.filter(option => selectedValues.includes(option.value));
    };

    const getDisplayBadges = () => {
      const selected = getSelectedOptions();
      const visibleBadges = selected.slice(0, maxDisplayBadges);
      const remainingCount = selected.length - maxDisplayBadges;
      
      return { visibleBadges, remainingCount };
    };

    const truncateText = (text: string, maxLength: number = 10) => {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '..';
    };

    // Dynamic text scrolling animation with consistent character-based speed
    const startTextAnimation = (textElement: HTMLElement) => {
      const scrollDistance = textElement.scrollWidth - textElement.clientWidth;
      if (scrollDistance > 0) {
        // Calculate duration based on character count for consistent reading speed
        const textContent = textElement.textContent || '';
        const charCount = textContent.length;
        const charsPerSecond = 6; // Slower readable speed: 6 characters per second
        const duration = Math.max(3, charCount / charsPerSecond); // Minimum 3 seconds
        
        textElement.style.animationDelay = '0s';
        textElement.style.animation = `scrollText${scrollDistance} ${duration}s linear infinite`;
        
        // Create dynamic keyframe if it doesn't exist
        const animationName = `scrollText${scrollDistance}`;
        if (!document.querySelector(`style[data-animation="${animationName}"]`)) {
          const style = document.createElement('style');
          style.setAttribute('data-animation', animationName);
          style.textContent = `
            @keyframes ${animationName} {
              0% { transform: translateX(0); animation-delay: 0s; }
              45% { transform: translateX(-${scrollDistance}px); }
              55% { transform: translateX(-${scrollDistance}px); }
              100% { transform: translateX(0); }
            }
          `;
          document.head.appendChild(style);
        }
      }
    };
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    if (isMultiselect) {
      return (
        <div className="relative" ref={(node) => {
          dropdownRef.current = node;
          if (ref) {
            if (typeof ref === 'function') {
              ref(node);
            } else {
              ref.current = node;
            }
          }
        }} {...props}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            disabled={disabled}
            className={cn(
              "flex items-center justify-between rounded-[4px] border border-neutral-6 bg-neutral-0 px-[8px] py-[8px] font-sans text-[14px] font-normal leading-[19px] text-neutral-6 transition-colors focus-visible:outline-none focus:border-digital-twin-6 focus-visible:border-digital-twin-6 hover:border-neutral-6",
              "min-h-[36px] w-[284px]",
              disabled && "border-neutral-5 bg-neutral-1 text-neutral-5 cursor-not-allowed",
              className
            )}
          >
            <div className="flex flex-wrap gap-1 flex-1 min-w-0">
              {(() => {
                const { visibleBadges, remainingCount } = getDisplayBadges();
                return (
                  <>
                    {visibleBadges.map((option) => (
                      <div
                        key={option.value}
                        className="inline-flex items-center gap-1 bg-digital-twin-3 text-digital-twin-8 px-2 py-1 rounded-[4px] text-xs font-medium"
                      >
                        <span>{truncateText(option.label)}</span>
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveBadge(option.value);
                          }}
                          className="hover:bg-digital-twin-8/20 rounded-[4px] p-0.5 cursor-pointer"
                        >
                          <XIcon className="text-digital-twin-8" />
                        </span>
                      </div>
                    ))}
                    {remainingCount > 0 && (
                      <div className="inline-flex items-center bg-digital-twin-3 text-digital-twin-8 px-2 py-1 rounded-[4px] text-xs font-medium">
                        +{remainingCount}
                      </div>
                    )}
                    {selectedValues.length === 0 && (
                      <span className="text-neutral-5">{placeholder}</span>
                    )}
                  </>
                );
              })()}
            </div>
            <ChevronDownIcon className={cn(
              "h-5 w-5 stroke-[1.5] text-neutral-5 transition-transform duration-200",
              isOpen && "rotate-180"
            )} />
          </button>
          
          {isOpen && (
            <div className="absolute z-50 w-[284px] overflow-hidden rounded-[4px] bg-neutral-0 shadow-[0_8px_25px_-5px_rgba(0,0,0,0.1),0_4px_10px_-2px_rgba(0,0,0,0.04)] border border-neutral-2 top-full mt-1 max-h-[200px] flex flex-col">
              {/* Static Header */}
              <div className="px-[4px] py-[4px] bg-neutral-0 flex flex-shrink-0">
                <span className="px-[6px] text-[13px] text-neutral-4">
                  {selectedValues.length} selected
                </span>
              </div>
              
              {/* Scrollable Content */}
              <div className="overflow-y-auto flex-1 custom-scrollbar">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    disabled={option.disabled}
                    onClick={() => handleMultiSelect(option.value)}
                    className="relative flex w-full cursor-default select-none items-center py-[8px] px-[12px] text-[14px] text-neutral-6 outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-neutral-1 group"
                    ref={(el) => {
                      if (el) {
                        const textElement = el.querySelector('.scrollable-text') as HTMLElement;
                        const ellipsisElement = el.querySelector('.ellipsis-indicator') as HTMLElement;
                        if (textElement && ellipsisElement) {
                          if (textElement.scrollWidth <= textElement.clientWidth) {
                            ellipsisElement.style.display = 'none';
                          }
                        }
                      }
                    }}
                    onMouseEnter={(e) => {
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
                        textElement.style.animation = 'none';
                        textElement.style.transform = 'translateX(0)';
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
                          selectedValues.includes(option.value) 
                            ? "bg-digital-twin-8 border-digital-twin-8" 
                            : "bg-white border-neutral-5"
                        )}
                      >
                        {selectedValues.includes(option.value) && (
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
                      <span className="scrollable-text whitespace-nowrap block text-left">{option.label}</span>
                      <span className="ellipsis-indicator absolute right-0 top-0 bg-neutral-0 px-1 text-neutral-6">..</span>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Static Footer */}
              <div 
                className="flex justify-center py-[2px] flex-shrink-0 cursor-pointer group"
                onClick={() => setIsOpen(false)}
              >
                <ChevronDownIcon className="h-5 w-5 text-neutral-5 stroke-[1.5] group-hover:rotate-180 transition-transform duration-200" />
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="relative" ref={ref} {...props}>
        <Select.Root 
          value={singleValue} 
          onValueChange={onChange} 
          disabled={disabled}
        >
          <Select.Trigger
            className={cn(
              "flex items-center justify-between rounded-[4px] border border-neutral-6 bg-neutral-0 px-[12px] py-[8px] font-sans text-[14px] font-normal leading-[19px] text-neutral-6 transition-colors focus-visible:outline-none focus:border-digital-twin-6 focus-visible:border-digital-twin-6 hover:border-neutral-6 data-[state=open]:border-digital-twin-6",
              isMultiselect ? "min-h-[36px] w-[284px]" : "h-[36px] w-[284px]",
              disabled && "border-neutral-5 bg-neutral-1 text-neutral-5 cursor-not-allowed",
              className
            )}
          >
            <Select.Value placeholder={placeholder} className="text-neutral-6 truncate" />
            <Select.Icon className="text-neutral-5 transition-transform duration-200 data-[state=open]:rotate-180">
              <ChevronDownIcon className="h-5 w-5 stroke-[1.5]" />
            </Select.Icon>
          </Select.Trigger>
          
          <Select.Portal>
            <Select.Content
              className="relative z-50 w-[284px] overflow-hidden rounded-[4px] bg-neutral-0 shadow-[0_8px_25px_-5px_rgba(0,0,0,0.1),0_4px_10px_-2px_rgba(0,0,0,0.04)] border border-neutral-2 max-h-[200px] flex flex-col"
              sideOffset={4}
              align="start"
              position="popper"
            >
              <Select.Viewport className="p-0 overflow-y-auto flex-1 custom-scrollbar">
                {options.map((option) => (
                  <Select.Item
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    className="relative flex w-full cursor-default select-none items-center py-[8px] px-[12px] text-[14px] text-neutral-6 outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-neutral-1"
                  >
                    <Select.ItemText>{option.label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
              <div className="flex justify-center py-[2px] flex-shrink-0 cursor-pointer group" onClick={() => {}}>
                <ChevronDownIcon className="h-5 w-5 text-neutral-5 stroke-[1.5] group-hover:rotate-180 transition-transform duration-200" />
              </div>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>
    );
  }
);

Dropdown.displayName = "Dropdown";

export { Dropdown };
export default Dropdown;