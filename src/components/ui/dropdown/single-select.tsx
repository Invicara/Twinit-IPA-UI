import * as React from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { cn } from "../../../lib/utils";
import { DROPDOWN_STYLES } from "./shared/dropdown-styles";
import { DropdownPopup, DropdownScrollableContent } from "./shared/dropdown-base";
import { useClickOutside } from "./shared/dropdown-hooks";
import { startTextAnimation, stopTextAnimation } from "./shared/dropdown-text-utils";
import '../../../output.css';

export interface SingleSelectProps {
  // Core Props
  className?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  filter?: boolean;
  
  // Feature Toggles & Behavior Options
  hideFooter?: boolean;
  hideRowHighlight?: boolean;
  hideLongTextEllipsis?: boolean;
  hideLongTextTooltip?: boolean;
  disableKeyboardNavigation?: boolean;
  disableIconAnimation?: boolean;
  enableLongTextAnimation?: boolean;
  disableScrolling?: boolean;
  disableCloseOnOutsideClick?: boolean;
  closeOnInputClick?: boolean;
  popAbove?: boolean;
  disableSelectionLooping?: boolean;

  // Icons
  icons?: {
    trigger?: React.ReactNode; 
    footer?: React.ReactNode;  
  };
  
  // Styling
  classNames?: {
    container?: string;
    trigger?: string;
    triggerIconContainer?: string;
    triggerIcon?: string;
    popup?: string;
    scrollContent?: string;
    item?: string;
    itemFocused?: string;
    itemDisabled?: string;
    itemText?: string;
    ellipsis?: string;
    highlightedText?: string;
    noResults?: string;
    footer?: string;
    footerIcon?: string;
  };
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
      hideFooter,
      hideRowHighlight,
      hideLongTextEllipsis,
      hideLongTextTooltip = false,
      disableKeyboardNavigation,
      disableIconAnimation,
      enableLongTextAnimation = false,
      disableScrolling,
      disableCloseOnOutsideClick,
      closeOnInputClick,
      popAbove,
      disableSelectionLooping = false,
      icons,
      classNames,
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
      if (!disableCloseOnOutsideClick) {
        setIsSearchOpen(false);
        setSearchQuery('');
        setIsInputFocused(false);
      }
    }, isSearchOpen && !disableCloseOnOutsideClick);

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
          <span className={cn("ipa-ui-dropdown-single__highlighted-text", classNames?.highlightedText)}>{match}</span>
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
      if (disableKeyboardNavigation) return;
      
      // Set keyboard mode on any key press
      setIsKeyboardMode(true);
      if (e.key === 'Enter' && !isSearchOpen && filteredOptions.length > 0) {
        e.preventDefault();
        setIsSearchOpen(true);
        setFocusedIndex(0);
        return;
      }

      if (e.key === 'Tab' && filteredOptions.length > 0) {
        // If dropdown is already open and an item is highlighted, close dropdown and move to next element
        if (isSearchOpen && focusedIndex >= 0) {
          e.preventDefault();
          setIsSearchOpen(false);
          setFocusedIndex(-1);
          setIsInputFocused(false);
          
          // Blur the input and then move focus to next element
          if (searchInputRef.current) {
            searchInputRef.current.blur();
          }
          
          // Use requestAnimationFrame to ensure blur completes, then find and focus next element
          requestAnimationFrame(() => {
            const focusableElements = Array.from(
              document.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
              )
            ).filter(el => {
              const style = window.getComputedStyle(el);
              return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
            });
            
            const currentIndex = focusableElements.findIndex(el => el === searchInputRef.current);
            const nextIndex = e.shiftKey ? currentIndex - 1 : currentIndex + 1;
            
            if (nextIndex >= 0 && nextIndex < focusableElements.length) {
              focusableElements[nextIndex]?.focus();
            }
          });
          return;
        }
        // Otherwise, open dropdown and highlight first item
        e.preventDefault();
        if (!isSearchOpen) {
          setIsSearchOpen(true);
        }
        setFocusedIndex(0);
        return;
      }

      if (!isSearchOpen || filteredOptions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (disableSelectionLooping) {
            setFocusedIndex((prev) => {
              if (prev < 0) return 0; // Initialize if no item is focused
              return prev < filteredOptions.length - 1 ? prev + 1 : prev;
            });
          } else {
            setFocusedIndex((prev) => {
              if (prev < 0) return 0; // Initialize if no item is focused
              return prev < filteredOptions.length - 1 ? prev + 1 : 0;
            });
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (disableSelectionLooping) {
            setFocusedIndex((prev) => {
              if (prev < 0) return 0; // Initialize if no item is focused
              return prev > 0 ? prev - 1 : 0;
            });
          } else {
            setFocusedIndex((prev) => {
              if (prev < 0) return filteredOptions.length - 1; // Initialize to last item if no item is focused
              return prev > 0 ? prev - 1 : filteredOptions.length - 1;
            });
          }
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
        case ' ':
          // Spacebar selects item but doesn't dismiss dropdown (only for non-filter mode)
          if (!filter) {
            e.preventDefault();
            if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
              const selectedOption = filteredOptions[focusedIndex];
              if (onChange) onChange(selectedOption.value);
              // Keep dropdown open and maintain focus on the selected item
            }
          }
          // If filter mode, allow spacebar to type spaces
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
        className={cn("ipa-ui-dropdown-shared__container", classNames?.container)} 
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
        {/* Note:Maybe instead of using the shared container class directly we should use a more specific class name like ipa-ui-dropdown-single__container that @applys the shared container class */}
        <div className="ipa-ui-dropdown-shared__container">
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
              if (!closeOnInputClick || !isSearchOpen) {
                setIsSearchOpen(true);
              }
              if (!filter) {
                setSearchQuery('');
              } else if (selectedOption) {
                setSearchQuery('');
              }
              setFocusedIndex(-1);
            }}
            onClick={() => {
              if (closeOnInputClick && isSearchOpen) {
                setIsSearchOpen(false);
              }
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
              "ipa-ui-dropdown-single__trigger",
              disabled && "ipa-ui-dropdown-single__trigger--disabled",
              filter && isSearchOpen && "ipa-ui-dropdown-single__trigger--cursor-text",
              filter && !isSearchOpen && "ipa-ui-dropdown-single__trigger--cursor-pointer",
              !filter && "ipa-ui-dropdown-single__trigger--cursor-pointer",
              className,
              classNames?.trigger
            )}
          />
          <div className={cn("ipa-ui-dropdown-single__trigger-icon-container", classNames?.triggerIconContainer)}>
            {icons?.trigger ? (
              <div className={cn(
                !disableIconAnimation && "ipa-ui-dropdown-single__trigger-icon--transition",
                !disableIconAnimation && isSearchOpen && "ipa-ui-dropdown-single__trigger-icon--rotate-180",
                classNames?.triggerIcon
              )}>
                {icons.trigger}
              </div>
            ) : (
              <ChevronDownIcon className={cn(
                "ipa-ui-dropdown-single__trigger-icon",
                !disableIconAnimation && "ipa-ui-dropdown-single__trigger-icon--transition", 
                !disableIconAnimation && isSearchOpen && "ipa-ui-dropdown-single__trigger-icon--rotate-180",
                classNames?.triggerIcon
              )} />
            )}
          </div>
        </div>
        
        {isSearchOpen && filteredOptions.length > 0 && (
          <DropdownPopup isOpen={true} onClose={() => setIsSearchOpen(false)} className={classNames?.popup} footer={!hideFooter} popAbove={popAbove}>
            <DropdownScrollableContent className={classNames?.scrollContent} scrollable={!disableScrolling}>
              {filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                    if (el) {
                      const textElement = el.querySelector('.scrollable-text') as HTMLElement;
                      const ellipsisElement = el.querySelector('.ellipsis-indicator') as HTMLElement;
                      if (textElement) {
                        const isTruncated = textElement.scrollWidth > textElement.clientWidth;
                        // Set tooltip on button only if text is truncated
                        if (!hideLongTextTooltip && isTruncated) {
                          el.setAttribute('title', option.label);
                        } else {
                          el.removeAttribute('title');
                        }
                        // Handle ellipsis visibility
                        if (!hideLongTextEllipsis && ellipsisElement) {
                          if (isTruncated) {
                            ellipsisElement.style.display = '';
                          } else {
                            ellipsisElement.style.display = 'none';
                          }
                        }
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
                    if (enableLongTextAnimation) {
                      const textElement = e.currentTarget.querySelector('.scrollable-text') as HTMLElement;
                      const ellipsisElement = e.currentTarget.querySelector('.ellipsis-indicator') as HTMLElement;
                      if (textElement && textElement.scrollWidth > textElement.clientWidth) {
                        startTextAnimation(textElement);
                        if (ellipsisElement) {
                          ellipsisElement.style.opacity = '0';
                        }
                      }
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (enableLongTextAnimation) {
                      const textElement = e.currentTarget.querySelector('.scrollable-text') as HTMLElement;
                      const ellipsisElement = e.currentTarget.querySelector('.ellipsis-indicator') as HTMLElement;
                      if (textElement) {
                        stopTextAnimation(textElement);
                      }
                      if (ellipsisElement) {
                        ellipsisElement.style.opacity = '1';
                      }
                    }
                  }}
                  className={cn(
                    DROPDOWN_STYLES.itemBase,
                    !hideRowHighlight && focusedIndex === index && "ipa-ui-dropdown-single__item--focused",
                    !hideRowHighlight && !isKeyboardMode && "ipa-ui-dropdown-single__item--hover group",
                    classNames?.item,
                    !hideRowHighlight && focusedIndex === index && classNames?.itemFocused,
                    option.disabled && classNames?.itemDisabled
                  )}
                >
                  <div className="ipa-ui-dropdown-single__item-content">
                    <span 
                      className={cn("ipa-ui-dropdown-single__item-content-text scrollable-text", classNames?.itemText)}
                    >
                      {filter ? highlightMatch(option.label, searchQuery) : option.label}
                    </span>
                    {!hideLongTextEllipsis && (
                      <span className={cn(
                        "ipa-ui-dropdown-single__item-content-ellipsis-indicator ellipsis-indicator",
                        !hideRowHighlight && focusedIndex === index ? "ipa-ui-dropdown-single__item-content-ellipsis-indicator--focused" : "ipa-ui-dropdown-single__item-content-ellipsis-indicator--unfocused",
                        !hideRowHighlight && !isKeyboardMode && "ipa-ui-dropdown-single__item-content-ellipsis-indicator--hover",
                        classNames?.ellipsis
                      )}>
                        ..
                      </span>
                    )}
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
          }} footer={false} popAbove={popAbove} className={classNames?.popup}>
            <div className={cn("ipa-ui-dropdown-single__no-results", classNames?.noResults)}>
              No options found
            </div>
            {!popAbove && !hideFooter && (
              <div className={cn(DROPDOWN_STYLES.footer, classNames?.footer)} onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery('');
                setIsInputFocused(false);
                setFocusedIndex(-1);
              }}>
                {icons?.footer ? (
                  <div className={cn(
                    !disableIconAnimation && "group-hover:rotate-180 transition-transform duration-200",
                    classNames?.footerIcon
                  )}>
                    {icons.footer}
                  </div>
                ) : (
                  <ChevronDownIcon className={cn(
                    "h-5 w-5 text-neutral-5 stroke-[1.5]",
                    !disableIconAnimation && "group-hover:rotate-180 transition-transform duration-200",
                    classNames?.footerIcon
                  )} />
                )}
              </div>
            )}
            {popAbove && !hideFooter && (
              <div className={cn(DROPDOWN_STYLES.footer, classNames?.footer)} onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery('');
                setIsInputFocused(false);
                setFocusedIndex(-1);
              }}>
                {icons?.footer ? (
                  <div className={cn(
                    !disableIconAnimation && "group-hover:rotate-180 transition-transform duration-200",
                    classNames?.footerIcon
                  )}>
                    {icons.footer}
                  </div>
                ) : (
                  <ChevronDownIcon className={cn(
                    "h-5 w-5 text-neutral-5 stroke-[1.5]",
                    !disableIconAnimation && "group-hover:rotate-180 transition-transform duration-200",
                    classNames?.footerIcon
                  )} />
                )}
              </div>
            )}
          </DropdownPopup>
        )}
      </div>
    );
  }
);

SingleSelect.displayName = "SingleSelect";
