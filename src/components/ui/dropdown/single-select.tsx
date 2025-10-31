import * as React from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { cn } from "../../../lib/utils";
import { DROPDOWN_STYLES } from "./shared/dropdown-styles";
import { DropdownPopup, DropdownScrollableContent } from "./shared/dropdown-base";
import { useClickOutside } from "./shared/dropdown-hooks";
import { startTextAnimation, stopTextAnimation } from "./shared/dropdown-text-utils";
import '../../../output.css';

export interface SingleSelectProps {
  className?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  filter?: boolean;
}

export const SingleSelect = React.forwardRef<HTMLDivElement, SingleSelectProps>(
  (
    {
      className,
      options,
      value,
      onChange,
      disabled,
      placeholder,
      filter = false,
      ...props
    },
    ref
  ) => {
    const defaultPlaceholder = filter ? 'Type to search...' : 'Select an option';
    const effectivePlaceholder = placeholder || defaultPlaceholder;
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);
    const [isInputFocused, setIsInputFocused] = React.useState(false);
    const [focusedIndex, setFocusedIndex] = React.useState(-1);
    const [isKeyboardMode, setIsKeyboardMode] = React.useState(false);
    const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
    const lastMousePosition = React.useRef({ x: 0, y: 0 });
    
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const searchInputRef = React.useRef<HTMLInputElement | null>(null);

    useClickOutside(dropdownRef, () => {
      setIsSearchOpen(false);
      setSearchQuery('');
      setIsInputFocused(false);
    }, isSearchOpen);

    const filteredOptions = options.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const highlightMatch = (text: string, query: string) => {
      if (!query.trim()) return text;
      
      const lowerText = text.toLowerCase();
      const lowerQuery = query.toLowerCase();
      const index = lowerText.indexOf(lowerQuery);
      
      if (index === -1) return text;
      
      const before = text.substring(0, index);
      const match = text.substring(index, index + query.length);
      const after = text.substring(index + query.length);
      
      return (
        <>
          {before}
          <span className="font-bold">{match}</span>
          {after}
        </>
      );
    };

    React.useEffect(() => {
      if (searchQuery && !isSearchOpen) {
        setIsSearchOpen(true);
      }
      if (searchQuery !== '') {
        setFocusedIndex(-1);
        itemRefs.current = new Array(filteredOptions.length);
      }
    }, [searchQuery, isSearchOpen, filteredOptions.length]);

    React.useEffect(() => {
      if (isSearchOpen && focusedIndex >= 0 && focusedIndex < itemRefs.current.length) {
        const focusedItem = itemRefs.current[focusedIndex];
        if (focusedItem) {
          focusedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
    }, [focusedIndex, isSearchOpen]);

    // Track actual mouse movement to re-enable hover
    React.useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        const moved = 
          Math.abs(e.clientX - lastMousePosition.current.x) > 2 ||
          Math.abs(e.clientY - lastMousePosition.current.y) > 2;
        
        if (moved) {
          setIsKeyboardMode(false);
          setFocusedIndex(-1); // Clear keyboard focus when mouse moves
          lastMousePosition.current = { x: e.clientX, y: e.clientY };
        }
      };

      if (isSearchOpen) {
        document.addEventListener('mousemove', handleMouseMove);
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
        };
      }
    }, [isSearchOpen]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Set keyboard mode on any key press
      setIsKeyboardMode(true);
      if (e.key === 'Enter' && !isSearchOpen && filteredOptions.length > 0) {
        e.preventDefault();
        setIsSearchOpen(true);
        setFocusedIndex(0);
        return;
      }

      if (!isSearchOpen || filteredOptions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((prev) => 
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
            const selectedOption = filteredOptions[focusedIndex];
            if (onChange) onChange(selectedOption.value);
            setSearchQuery('');
            setIsSearchOpen(false);
            setIsInputFocused(false);
            setFocusedIndex(-1);
            if (searchInputRef.current) {
              searchInputRef.current.blur();
            }
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsSearchOpen(false);
          setFocusedIndex(-1);
          if (searchInputRef.current) {
            searchInputRef.current.blur();
          }
          break;
      }
    };

    const selectedOption = options.find(opt => opt.value === value);
    const displayValue = !filter
      ? (selectedOption ? selectedOption.label : '')
      : (searchQuery !== '' 
        ? searchQuery 
        : (isInputFocused || !selectedOption ? '' : selectedOption.label));

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
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            value={displayValue}
            onChange={(e) => {
              if (!filter) return;
              setSearchQuery(e.target.value);
              if (!isSearchOpen) {
                setIsSearchOpen(true);
              }
              setFocusedIndex(-1);
            }}
            onFocus={() => {
              setIsInputFocused(true);
              setIsSearchOpen(true);
              if (!filter) {
                setSearchQuery('');
              } else if (selectedOption) {
                setSearchQuery('');
              }
              setFocusedIndex(-1);
            }}
            onBlur={() => {
              setIsInputFocused(false);
            }}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={effectivePlaceholder}
            readOnly={!filter}
            className={cn(
              DROPDOWN_STYLES.triggerBase,
              "h-[36px] w-[284px]",
              "placeholder:text-neutral-4",
              "text-ellipsis overflow-hidden pr-[36px]",
              disabled && DROPDOWN_STYLES.disabled,
              filter && isSearchOpen && "cursor-text",
              filter && !isSearchOpen && "cursor-pointer",
              !filter && "cursor-pointer",
              className
            )}
          />
          <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronDownIcon className={cn(
              "h-5 w-5 stroke-[1.5] text-neutral-5 transition-transform duration-200", 
              isSearchOpen && "rotate-180"
            )} />
          </div>
        </div>
        
        {isSearchOpen && filteredOptions.length > 0 && (
          <DropdownPopup isOpen={true} onClose={() => setIsSearchOpen(false)}>
            <DropdownScrollableContent>
              {filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                    if (el) {
                      const textElement = el.querySelector('.scrollable-text') as HTMLElement;
                      const ellipsisElement = el.querySelector('.ellipsis-indicator') as HTMLElement;
                      if (textElement && ellipsisElement && textElement.scrollWidth <= textElement.clientWidth) {
                        ellipsisElement.style.display = 'none';
                      }
                    }
                  }}
                  type="button"
                  disabled={option.disabled}
                  onClick={() => {
                    if (onChange) {
                      onChange(option.value);
                    }
                    setSearchQuery('');
                    setIsSearchOpen(false);
                    setIsInputFocused(false);
                    setFocusedIndex(-1);
                    if (searchInputRef.current) {
                      searchInputRef.current.blur();
                    }
                  }}
                  onMouseEnter={(e) => {
                    if (!isKeyboardMode) {
                      setFocusedIndex(index);
                    }
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
                  className={cn(
                    DROPDOWN_STYLES.itemBase,
                    focusedIndex === index && "bg-brand-1",
                    !isKeyboardMode && "hover:bg-brand-1"
                  )}
                >
                  <div className="flex-1 overflow-hidden relative">
                    <span className="scrollable-text whitespace-nowrap block text-left">
                      {filter ? highlightMatch(option.label, searchQuery) : option.label}
                    </span>
                    <span className="ellipsis-indicator absolute right-0 top-0 bg-neutral-0 px-1 text-neutral-6">
                      ..
                    </span>
                  </div>
                </button>
              ))}
            </DropdownScrollableContent>
          </DropdownPopup>
        )}
        
        {isSearchOpen && filteredOptions.length === 0 && searchQuery && (
          <DropdownPopup isOpen={true} onClose={() => {
            setIsSearchOpen(false);
            setSearchQuery('');
            setIsInputFocused(false);
            setFocusedIndex(-1);
          }} footer={false}>
            <div className="px-[12px] py-[8px] text-[14px] text-neutral-5 text-center">
              No options found
            </div>
            <div className={DROPDOWN_STYLES.footer} onClick={() => {
              setIsSearchOpen(false);
              setSearchQuery('');
              setIsInputFocused(false);
              setFocusedIndex(-1);
            }}>
              <ChevronDownIcon className="h-5 w-5 text-neutral-5 stroke-[1.5] group-hover:rotate-180 transition-transform duration-200" />
            </div>
          </DropdownPopup>
        )}
      </div>
    );
  }
);

SingleSelect.displayName = "SingleSelect";
