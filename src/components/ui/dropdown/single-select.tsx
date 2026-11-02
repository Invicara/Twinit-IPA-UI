import * as React from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { cn, mergeStyles } from "../../../lib/utils";
import sharedStyles from "./shared/dropdown-base.module.css";
import styles from "./single-select.module.css";
import {
  DropdownPopup,
  DropdownScrollableContent,
  DROPDOWN_DEFAULT_MAX_VISIBLE_OPTIONS,
  getDropdownScrollContentMaxHeight,
  getPopupMaxHeightPx,
} from "./shared/dropdown-base";
import { useClickOutside } from "./shared/dropdown-hooks";
import { moveFocusAfterCloseFromElement } from "./shared/dropdown-focus-utils";
import { useDropdownFloating } from "./shared/use-dropdown-floating";
import { useSuppressDropdownKeyDefaults } from "./shared/use-dropdown-keyboard";
import { startTextAnimation, stopTextAnimation } from "./shared/dropdown-text-utils";

const defaultStyles = { ...sharedStyles, ...styles };

// Props: docs/dropdown.md — "SingleSelect props (main)"
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
  disableClickOutside?: boolean;
  popAbove?: boolean;
  disableSelectionLooping?: boolean;
  openOnFocus?: boolean;
  portalContainer?: HTMLElement | null;
  floatingZIndex?: number;
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
      disableClickOutside,
      popAbove,
      disableSelectionLooping = false,
      openOnFocus,
      portalContainer,
      floatingZIndex,
      maxVisibleOptions = DROPDOWN_DEFAULT_MAX_VISIBLE_OPTIONS,
      icons,
      styleOverrides,
      ...props
    },
    ref
  ) => {
    const s = mergeStyles(defaultStyles, styleOverrides);
    const disableKbNav =
      disableKeyboardNavigation === true ||
      String(disableKeyboardNavigation) === "true";
    const disableClickOutsideActive =
      disableClickOutside === true || String(disableClickOutside) === "true";
    const openOnFocusEnabled =
      openOnFocus === true || String(openOnFocus) === "true";
    const scrollContentMaxHeight = getDropdownScrollContentMaxHeight(
      maxVisibleOptions,
      !!disableScrolling
    );
    const maxPopupHeightPx = getPopupMaxHeightPx(
      scrollContentMaxHeight,
      !hideFooter
    );
    const defaultPlaceholder = filter ? 'Type to search...' : 'Select an option';
    const effectivePlaceholder = placeholder || defaultPlaceholder;
    const [searchQuery, setSearchQuery] = React.useState('');
    const [isSearchOpen, setIsSearchOpen] = React.useState(false);
    useSuppressDropdownKeyDefaults(disableKbNav && isSearchOpen);
    const [isInputFocused, setIsInputFocused] = React.useState(false);
    const [focusedIndex, setFocusedIndex] = React.useState(-1);
    const [isKeyboardMode, setIsKeyboardMode] = React.useState(false);
    /** Until controlled `value` catches up after a pick, show this label in filter mode. */
    const [filterSelectionDisplay, setFilterSelectionDisplay] = React.useState<
      string | null
    >(null);
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
        maxPopupHeightPx,
      });

    useClickOutside(
      dropdownRef,
      () => {
        if (disableClickOutsideActive) return;
        setIsSearchOpen(false);
        setIsInputFocused(false);
        if (filter) {
          const opt = options.find((o) => o.value === value);
          setSearchQuery(opt ? opt.label : "");
        } else {
          setSearchQuery("");
        }
      },
      isSearchOpen,
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
      itemRefs.current = new Array(filteredOptions.length);
    }, [filteredOptions.length]);

    React.useEffect(() => {
      if (
        !filter ||
        !openOnFocusEnabled ||
        !searchQuery.trim() ||
        isSearchOpen ||
        !isInputFocused
      ) {
        return;
      }
      setIsSearchOpen(true);
    }, [
      filter,
      openOnFocusEnabled,
      searchQuery,
      isSearchOpen,
      isInputFocused,
    ]);

    const rowHighlightIndex = React.useMemo(() => {
      if (
        !disableKbNav &&
        filter &&
        isSearchOpen &&
        searchQuery.trim() !== "" &&
        focusedIndex < 0 &&
        filteredOptions.length > 0
      ) {
        return 0;
      }
      return focusedIndex;
    }, [
      disableKbNav,
      filter,
      isSearchOpen,
      searchQuery,
      focusedIndex,
      filteredOptions.length,
    ]);

    React.useLayoutEffect(() => {
      if (
        !isKeyboardMode ||
        !isSearchOpen ||
        focusedIndex < 0 ||
        focusedIndex >= itemRefs.current.length
      ) {
        return;
      }
      const focusedItem = itemRefs.current[focusedIndex];
      if (focusedItem) {
        focusedItem.scrollIntoView({ block: "center", inline: "nearest" });
      }
    }, [focusedIndex, isSearchOpen, isKeyboardMode]);

    React.useEffect(() => {
      if (!filter || filterSelectionDisplay == null) return;
      const opt = options.find((o) => o.value === value);
      if (opt && opt.label === filterSelectionDisplay) {
        setFilterSelectionDisplay(null);
      }
    }, [filter, value, options, filterSelectionDisplay]);

    // Track actual mouse movement to re-enable hover
    React.useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        const moved =
          Math.abs(e.clientX - lastMousePosition.current.x) > 2 ||
          Math.abs(e.clientY - lastMousePosition.current.y) > 2;

        if (moved) {
          setIsKeyboardMode(false);
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

    const closeSearch = React.useCallback(
      (opts?: { filterQuerySeed?: string }) => {
        setIsSearchOpen(false);
        // Do not set isInputFocused false here: the filter input often keeps DOM
        // focus while the list closes (Enter/Escape). focus() then no-ops and skips
        // onFocus — wrong empty-query display. Blur still clears via onBlur.
        setFocusedIndex(-1);
        if (filter) {
          if (opts?.filterQuerySeed !== undefined) {
            setSearchQuery(opts.filterQuerySeed);
          } else {
            const opt = options.find((o) => o.value === value);
            setSearchQuery(opt ? opt.label : "");
          }
        } else {
          setSearchQuery("");
        }
      },
      [filter, options, value]
    );

    const handleChevronClick = React.useCallback(
      (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;
        if (isSearchOpen) {
          closeSearch();
        } else {
          setIsSearchOpen(true);
          setFocusedIndex(-1);
          requestAnimationFrame(() => {
            searchInputRef.current?.focus();
          });
        }
      },
      [disabled, isSearchOpen, closeSearch]
    );

    const handleChevronKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLElement>) => {
        if (disabled) return;
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        if (isSearchOpen) {
          closeSearch();
        } else {
          setIsSearchOpen(true);
          setFocusedIndex(-1);
          requestAnimationFrame(() => {
            searchInputRef.current?.focus();
          });
        }
      },
      [disabled, isSearchOpen, closeSearch]
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const isPrintableChar =
        e.key.length === 1 && e.key !== " " && !e.ctrlKey && !e.metaKey;
      if (!isPrintableChar && !disableKbNav) {
        setIsKeyboardMode(true);
      }

      if (e.key === "Escape") {
        if (isSearchOpen) {
          e.preventDefault();
          closeSearch();
          requestAnimationFrame(() => {
            searchInputRef.current?.focus();
          });
          return;
        }
        if (
          filter &&
          searchQuery.trim() === "" &&
          value !== undefined &&
          value !== ""
        ) {
          const opt = options.find((o) => o.value === value);
          if (opt) {
            e.preventDefault();
            setSearchQuery(opt.label);
          }
        }
        return;
      }

      if (e.key === "Tab") {
        if (isSearchOpen) {
          e.preventDefault();
          const origin = searchInputRef.current;
          closeSearch();
          moveFocusAfterCloseFromElement(origin, e);
        }
        return;
      }

      if (
        filter &&
        !isSearchOpen &&
        searchQuery.trim() === "" &&
        (e.key === "Enter" || e.key === " ")
      ) {
        e.preventDefault();
        onChange?.("");
        setFilterSelectionDisplay(null);
        setFocusedIndex(-1);
        return;
      }

      const openFromClosed = (
        keyEvent: React.KeyboardEvent,
        vertical: "down" | "up"
      ) => {
        if (filteredOptions.length === 0) return false;
        keyEvent.preventDefault();
        setIsSearchOpen(true);
        if (disableKbNav) {
          setFocusedIndex(-1);
          return true;
        }
        const sel = filteredOptions.findIndex((o) => o.value === value);
        if (vertical === "up") {
          setFocusedIndex(sel >= 0 ? sel : filteredOptions.length - 1);
        } else {
          setFocusedIndex(sel >= 0 ? sel : 0);
        }
        return true;
      };

      if (!isSearchOpen && filteredOptions.length > 0) {
        if (e.key === "Enter" || e.key === " ") {
          openFromClosed(e, "down");
          return;
        }
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          if (disableKbNav) {
            e.preventDefault();
            return;
          }
          openFromClosed(e, e.key === "ArrowDown" ? "down" : "up");
          return;
        }
      }

      if (!isSearchOpen || filteredOptions.length === 0) return;

      if (
        e.key === " " &&
        filter &&
        searchQuery.trim() !== "" &&
        focusedIndex < 0
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          if (disableKbNav) {
            if (isSearchOpen && filteredOptions.length > 0) {
              e.preventDefault();
            }
            return;
          }
          e.preventDefault();
          if (disableSelectionLooping) {
            setFocusedIndex((prev) => {
              if (prev < 0) return 0;
              return prev < filteredOptions.length - 1 ? prev + 1 : prev;
            });
          } else {
            setFocusedIndex((prev) => {
              if (prev < 0) return 0;
              return prev < filteredOptions.length - 1 ? prev + 1 : 0;
            });
          }
          break;
        case "ArrowUp":
          if (disableKbNav) {
            if (isSearchOpen && filteredOptions.length > 0) {
              e.preventDefault();
            }
            return;
          }
          e.preventDefault();
          if (disableSelectionLooping) {
            setFocusedIndex((prev) => {
              if (prev < 0) return 0;
              return prev > 0 ? prev - 1 : 0;
            });
          } else {
            setFocusedIndex((prev) => {
              if (prev < 0) return filteredOptions.length - 1;
              return prev > 0 ? prev - 1 : filteredOptions.length - 1;
            });
          }
          break;
        case "Enter":
          e.preventDefault();
          if (disableKbNav) break;
          if (filter && searchQuery.trim() === "") {
            if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
              const picked = filteredOptions[focusedIndex];
              onChange?.(picked.value);
              setFilterSelectionDisplay(picked.label);
              closeSearch({ filterQuerySeed: picked.label });
            } else {
              onChange?.("");
              setFilterSelectionDisplay(null);
              closeSearch({ filterQuerySeed: "" });
            }
            requestAnimationFrame(() => {
              searchInputRef.current?.focus();
            });
            break;
          }
          if (filteredOptions.length > 0) {
            const indexToSelect =
              focusedIndex >= 0 && focusedIndex < filteredOptions.length
                ? focusedIndex
                : Math.max(0, rowHighlightIndex);
            const picked = filteredOptions[indexToSelect];
            if (onChange) onChange(picked.value);
            if (filter) setFilterSelectionDisplay(picked.label);
            closeSearch(filter ? { filterQuerySeed: picked.label } : undefined);
          } else {
            closeSearch();
          }
          requestAnimationFrame(() => {
            searchInputRef.current?.focus();
          });
          break;
        case " ":
          e.preventDefault();
          if (disableKbNav) break;
          if (filter && searchQuery.trim() === "") {
            if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
              const picked = filteredOptions[focusedIndex];
              onChange?.(picked.value);
              setFilterSelectionDisplay(picked.label);
              closeSearch({ filterQuerySeed: picked.label });
            } else {
              onChange?.("");
              setFilterSelectionDisplay(null);
              closeSearch({ filterQuerySeed: "" });
            }
            requestAnimationFrame(() => {
              searchInputRef.current?.focus();
            });
            break;
          }
          if (filteredOptions.length > 0) {
            const indexToSelect =
              focusedIndex >= 0 && focusedIndex < filteredOptions.length
                ? focusedIndex
                : Math.max(0, rowHighlightIndex);
            const picked = filteredOptions[indexToSelect];
            if (onChange) onChange(picked.value);
            if (filter) setFilterSelectionDisplay(picked.label);
            closeSearch(filter ? { filterQuerySeed: picked.label } : undefined);
          } else {
            closeSearch();
          }
          requestAnimationFrame(() => {
            searchInputRef.current?.focus();
          });
          break;
      }
    };

    const selectedOption = options.find(opt => opt.value === value);
    const displayValue = !filter
      ? (selectedOption ? selectedOption.label : '')
      : searchQuery !== ""
        ? searchQuery
        : isInputFocused
          ? ""
          : filterSelectionDisplay != null
            ? filterSelectionDisplay
            : (selectedOption?.label ?? "");

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
              const next = e.target.value;
              setSearchQuery(next);
              if (next === "") {
                setFilterSelectionDisplay(null);
                setFocusedIndex(-1);
                setIsKeyboardMode(false);
              }
              if (!isSearchOpen) {
                setIsSearchOpen(true);
              }
            }}
            onFocus={(ev) => {
              setIsInputFocused(true);
              setFocusedIndex(-1);
              if (!filter) {
                setSearchQuery("");
                if (
                  openOnFocusEnabled &&
                  !disabled &&
                  filteredOptions.length > 0 &&
                  !isSearchOpen
                ) {
                  try {
                    if (ev.currentTarget.matches(":focus-visible")) {
                      setIsSearchOpen(true);
                    }
                  } catch {
                    setIsSearchOpen(true);
                  }
                }
                return;
              }
              if (
                searchQuery.trim() === "" &&
                value !== undefined &&
                value !== ""
              ) {
                const opt = options.find((o) => o.value === value);
                if (opt) {
                  setSearchQuery(opt.label);
                }
              }
            }}
            onClick={() => {
              if (!isSearchOpen) {
                setIsSearchOpen(true);
              }
            }}
            onBlur={() => {
              setIsInputFocused(false);
              if (
                filter &&
                searchQuery.trim() === "" &&
                value !== undefined &&
                value !== ""
              ) {
                const opt = options.find((o) => o.value === value);
                if (opt) {
                  setSearchQuery(opt.label);
                }
              }
            }}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={effectivePlaceholder}
            readOnly={!filter}
            data-disabled={disabled ? "true" : undefined}
            className={cn(s.triggerBase, s.trigger, className)}
          />
          <span
            role="button"
            tabIndex={-1}
            aria-label={isSearchOpen ? "Close options" : "Open options"}
            aria-disabled={disabled ? "true" : undefined}
            className={s.triggerIconButton}
            onClick={handleChevronClick}
            onKeyDown={handleChevronKeyDown}
          >
            {icons?.trigger ? (
              <div
                className={cn(
                  !disableIconAnimation && s.triggerIconTransition,
                  s.triggerIcon
                )}
              >
                {icons.trigger}
              </div>
            ) : (
              <ChevronDownIcon
                className={cn(
                  s.triggerIcon,
                  !disableIconAnimation && s.triggerIconTransition
                )}
              />
            )}
          </span>
        </div>

        {isSearchOpen && filteredOptions.length > 0 && (
          <DropdownPopup
            isOpen={true}
            onClose={() => closeSearch()}
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
              blockArrowKeys={disableKbNav}
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
                  data-focused={
                    !hideRowHighlight && rowHighlightIndex === index
                      ? "true"
                      : undefined
                  }
                  onClick={() => {
                    if (onChange) {
                      onChange(option.value);
                    }
                    if (filter) {
                      setFilterSelectionDisplay(option.label);
                      setSearchQuery(option.label);
                    } else {
                      setSearchQuery("");
                    }
                    setIsSearchOpen(false);
                    setIsInputFocused(false);
                    setFocusedIndex(-1);
                    requestAnimationFrame(() => {
                      searchInputRef.current?.focus();
                    });
                  }}
                  onMouseEnter={(e) => {
                    setIsKeyboardMode(false);
                    setFocusedIndex(index);
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
                    !hideRowHighlight && !isKeyboardMode && s.itemHover,
                    !hideRowHighlight &&
                    rowHighlightIndex === index &&
                    s.itemFocused,
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
                      <span
                        className={cn(
                          s.itemContentEllipsisIndicator,
                          'ellipsis-indicator'
                        )}
                      >
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
            onClose={() => closeSearch()}
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
              <div className={cn(s.footer, s.footerGroup)} onClick={() => closeSearch()}>
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
              <div className={cn(s.footer, s.footerGroup)} onClick={() => closeSearch()}>
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
