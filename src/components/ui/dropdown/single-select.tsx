import * as React from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { cn, mergeStyles } from "../../../lib/utils";
import sharedStyles from "./shared/dropdown-base.module.css";
import styles from "./single-select.module.css";
import {
  DropdownPopup,
  DropdownScrollableContent,
  getDropdownScrollContentMaxHeight,
} from "./shared/dropdown-base";
import { useClickOutside } from "./shared/dropdown-hooks";
import { useDropdownFloating } from "./shared/use-dropdown-floating";
import { startTextAnimation, stopTextAnimation } from "./shared/dropdown-text-utils";

const defaultStyles = { ...sharedStyles, ...styles };

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
  /** Portal root for the listbox (defaults to `#ipa-ui-modal-root` or `document.body`) */
  portalContainer?: HTMLElement | null;
  /** z-index for the portaled listbox (default 1200) */
  floatingZIndex?: number;
  /**
   * Max option rows shown before the list scrolls. Defaults to `10`.
   * Pass `false` for no row cap (only the viewport / floating size limit applies).
   */
  maxVisibleOptions?: number | false;

  // Icons
  icons?: {
    trigger?: React.ReactNode;
    footer?: React.ReactNode;
  };

  // Custom style overrides
  styleOverrides?: Record<string, string>;
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
      portalContainer,
      floatingZIndex,
      maxVisibleOptions = 10,
      icons,
      styleOverrides,
      ...props
    },
    ref
  ) => {
    const s = mergeStyles(defaultStyles, styleOverrides);
    const scrollContentMaxHeight = getDropdownScrollContentMaxHeight(
      maxVisibleOptions,
      !!disableScrolling
    );
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

    const filteredOptions = options.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const floatingOpen =
      isSearchOpen &&
      (filteredOptions.length > 0 ||
        (filteredOptions.length === 0 && searchQuery.length > 0));

    const { refs: floatingRefs, floatingStyles, resolvedPosition, portalRoot } =
      useDropdownFloating({
        open: floatingOpen,
        preferTop: !!popAbove,
        portalContainer,
        floatingZIndex,
      });

    useClickOutside(
      dropdownRef,
      () => {
        if (!disableCloseOnOutsideClick) {
          setIsSearchOpen(false);
          setSearchQuery('');
          setIsInputFocused(false);
        }
      },
      isSearchOpen && !disableCloseOnOutsideClick,
      floatingRefs.floating
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
          <span className={s.highlightedText}>{match}</span>
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

    const closeSearch = React.useCallback(() => {
      setIsSearchOpen(false);
      setSearchQuery('');
      setIsInputFocused(false);
      setFocusedIndex(-1);
      searchInputRef.current?.blur();
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disableKeyboardNavigation) return;
      
      // Set keyboard mode on any key press
      setIsKeyboardMode(true);

      // Always allow Escape to close when dropdown is open (even with no results)
      if (e.key === 'Escape' && isSearchOpen) {
        e.preventDefault();
        closeSearch();
        return;
      }

      if (e.key === 'Enter' && !isSearchOpen && filteredOptions.length > 0) {
        e.preventDefault();
        setIsSearchOpen(true);
        setFocusedIndex(0);
        return;
      }

      if (e.key === 'Tab') {
        // If dropdown is open: select first item if none highlighted, then close and move focus
        if (isSearchOpen) {
          e.preventDefault();
          if (filteredOptions.length > 0) {
            const indexToSelect = focusedIndex >= 0 && focusedIndex < filteredOptions.length ? focusedIndex : 0;
            const optionToSelect = filteredOptions[indexToSelect];
            if (onChange) onChange(optionToSelect.value);
          }
          closeSearch();
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
        // Dropdown closed: open and highlight first item if there are options
        if (filteredOptions.length > 0) {
          e.preventDefault();
          setIsSearchOpen(true);
          setFocusedIndex(0);
        }
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
          if (filteredOptions.length > 0) {
            const indexToSelect = focusedIndex >= 0 && focusedIndex < filteredOptions.length ? focusedIndex : 0;
            const selectedOption = filteredOptions[indexToSelect];
            if (onChange) onChange(selectedOption.value);
          }
          closeSearch();
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
        className={cn(s.singleSelect)}
        data-state={isSearchOpen ? "open" : "closed"}
        data-disabled={disabled ? "true" : undefined}
        data-variant={filter ? "filter" : undefined}
        ref={(node) => {
          dropdownRef.current = node;
          floatingRefs.setReference(node);
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
        <div className={s.container}>
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
            data-disabled={disabled ? "true" : undefined}
            className={cn(s.triggerBase, s.trigger, className)}
          />
          <div className={s.triggerIconContainer}>
            {icons?.trigger ? (
              <div className={cn(
                !disableIconAnimation && s.triggerIconTransition,
                s.triggerIcon
              )}>
                {icons.trigger}
              </div>
            ) : (
              <ChevronDownIcon className={cn(
                s.triggerIcon,
                !disableIconAnimation && s.triggerIconTransition
              )} />
            )}
          </div>
        </div>
        
        {isSearchOpen && filteredOptions.length > 0 && (
          <DropdownPopup
            isOpen={true}
            onClose={closeSearch}
            footer={!hideFooter}
            resolvedPosition={resolvedPosition}
            setFloating={floatingRefs.setFloating}
            floatingStyles={floatingStyles}
            portalRoot={portalRoot}
            styles={s}
          >
            <DropdownScrollableContent
              scrollable={!disableScrolling}
              contentMaxHeight={scrollContentMaxHeight}
              styles={s}
            >
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
                  data-disabled={option.disabled ? "true" : undefined}
                  data-focused={!hideRowHighlight && focusedIndex === index ? "true" : undefined}
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
                    s.itemBase,
                    !hideRowHighlight && !isKeyboardMode && cn(s.itemHover, 'group'),
                    !hideRowHighlight && focusedIndex === index && s.itemFocused,
                    option.disabled && s.itemDisabled
                  )}
                >
                  <div className={s.itemContent}>
                    <span 
                      className={cn(s.itemContentText, 'scrollable-text', s.itemText)}
                    >
                      {filter ? highlightMatch(option.label, searchQuery) : option.label}
                    </span>
                    {!hideLongTextEllipsis && (
                      <span className={cn(
                        s.itemContentEllipsisIndicator,
                        'ellipsis-indicator',
                        !hideRowHighlight && !isKeyboardMode && s.itemContentEllipsisIndicatorHover
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
          <DropdownPopup
            isOpen={true}
            onClose={closeSearch}
            footer={false}
            resolvedPosition={resolvedPosition}
            setFloating={floatingRefs.setFloating}
            floatingStyles={floatingStyles}
            portalRoot={portalRoot}
            styles={s}
          >
            <div className={s.noResults}>
              No options found
            </div>
            {resolvedPosition === 'bottom' && !hideFooter && (
              <div className={cn(s.footer, s.footerGroup)} onClick={closeSearch}>
                {icons?.footer ? (
                  <div className={cn(
                    !disableIconAnimation && s.footerIconAnimate,
                    s.footerIcon
                  )}>
                    {icons.footer}
                  </div>
                ) : (
                  <ChevronDownIcon className={cn(
                    s.footerIcon,
                    !disableIconAnimation && s.footerIconAnimate
                  )} />
                )}
              </div>
            )}
            {resolvedPosition === 'top' && !hideFooter && (
              <div className={cn(s.footer, s.footerGroup)} onClick={closeSearch}>
                {icons?.footer ? (
                  <div className={cn(
                    !disableIconAnimation && s.footerIconAnimate,
                    s.footerIcon
                  )}>
                    {icons.footer}
                  </div>
                ) : (
                  <ChevronDownIcon className={cn(
                    s.footerIcon,
                    !disableIconAnimation && s.footerIconAnimate
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
