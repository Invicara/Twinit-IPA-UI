import * as React from "react";
import { cn, mergeStyles } from "../../../lib/utils";
import { XIcon } from "../../icons";
import sharedStyles from "./shared/dropdown-base.module.css";
import defaultStyles from "./multi-select.module.css";
import {
  DropdownTrigger,
  DropdownPopup,
  DropdownScrollableContent,
  DROPDOWN_DEFAULT_MAX_VISIBLE_OPTIONS,
  getDropdownScrollContentMaxHeight,
  getPopupMaxHeightPx,
} from "./shared/dropdown-base";
import { useClickOutside } from "./shared/dropdown-hooks";
import { useDropdownFloating } from "./shared/use-dropdown-floating";
import { moveFocusAfterCloseFromElement } from "./shared/dropdown-focus-utils";
import { useDropdownKeyboard } from "./shared/use-dropdown-keyboard";
import { startTextAnimation, stopTextAnimation, truncateText } from "./shared/dropdown-text-utils";

const styles = { ...sharedStyles, ...defaultStyles };

// Props: docs/dropdown.md — "MultiSelect props (main)"
export interface MultiSelectProps {
  // Core Props
  className?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  value?: string[];
  onChange?: (value: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
  maxDisplayBadges?: number;

  // Feature Toggles & Behavior Options
  hideFooter?: boolean;
  hideRowHighlight?: boolean;
  hideLongTextEllipsis?: boolean;
  hideLongTextTooltip?: boolean;
  hideRemainingBadge?: boolean;
  hideSelectionCount?: boolean;
  hideCheckboxes?: boolean;
  hideBadgeRemove?: boolean;
  disableKeyboardNavigation?: boolean;
  disableIconAnimation?: boolean;
  enableLongTextAnimation?: boolean;
  disableScrolling?: boolean;
  disableSelectionLooping?: boolean;
  disableClickOutside?: boolean;
  disableCloseOnTriggerClick?: boolean;
  rightAlignCheckboxes?: boolean;
  wrapBadges?: boolean;
  popAbove?: boolean;
  openOnFocus?: boolean;
  portalContainer?: HTMLElement | null;
  floatingZIndex?: number;
  maxVisibleOptions?: number | false;

  // Icons
  icons?: {
    trigger?: React.ReactNode;
    badgeClose?: React.ReactNode;
    check?: React.ReactNode;
  };

  // Custom style overrides
  styleOverrides?: Record<string, string>;
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
      hideFooter,
      hideRowHighlight,
      hideLongTextEllipsis,
      hideLongTextTooltip = false,
      hideRemainingBadge,
      hideSelectionCount,
      hideCheckboxes,
      hideBadgeRemove,
      disableKeyboardNavigation,
      disableIconAnimation,
      enableLongTextAnimation = false,
      disableScrolling,
      disableClickOutside,
      disableCloseOnTriggerClick,
      rightAlignCheckboxes,
      wrapBadges,
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
    const s = mergeStyles(styles, styleOverrides);
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
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    const {
      focusedIndex,
      isKeyboardMode,
      handleKeyDown,
      handleMouseEnter,
      setItemRef,
      resetFocus,
      focusOptionAt,
    } = useDropdownKeyboard({
      isOpen,
      options,
      onSelect: (optionValue) => {
        handleMultiSelect(optionValue);
      },
      onClose: () => setIsOpen(false),
      disableSelectionLooping,
      disableArrowNavigation: disableKbNav,
    });

    const { refs: floatingRefs, floatingStyles, resolvedPosition, portalRoot } =
      useDropdownFloating({
        open: isOpen,
        preferTop: !!popAbove,
        portalContainer,
        floatingZIndex,
        maxPopupHeightPx,
      });

    useClickOutside(
      dropdownRef,
      () => {
        if (disableClickOutsideActive) return;
        setIsOpen(false);
        resetFocus();
      },
      isOpen,
      floatingRefs.floating
    );

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

    const handleTriggerFocus = React.useCallback(
      (ev: React.FocusEvent<HTMLButtonElement>) => {
        if (
          !openOnFocusEnabled ||
          disabled ||
          options.length === 0 ||
          isOpen
        ) {
          return;
        }
        try {
          if (ev.currentTarget.matches(":focus-visible")) {
            setIsOpen(true);
          }
        } catch {
          setIsOpen(true);
        }
      },
      [openOnFocusEnabled, disabled, options.length, isOpen]
    );

    const { visibleBadges, remainingCount } = getDisplayBadges();

    const triggerKeyDown = (e: React.KeyboardEvent) => {
      if (
        (e.key === 'ArrowDown' || e.key === 'ArrowUp') &&
        !isOpen &&
        options.length > 0
      ) {
        e.preventDefault();
        if (disableKbNav) return;
        const goDown = e.key === 'ArrowDown';
        const firstSelected = options.findIndex((o) => value.includes(o.value));
        setIsOpen(true);
        if (!disableKbNav) {
          requestAnimationFrame(() => {
            if (goDown) {
              focusOptionAt(firstSelected >= 0 ? firstSelected : 0);
            } else {
              focusOptionAt(
                firstSelected >= 0 ? firstSelected : options.length - 1
              );
            }
          });
        }
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (!isOpen && options.length > 0) {
          const firstSelected = options.findIndex((o) => value.includes(o.value));
          setIsOpen(true);
          if (!disableKbNav) {
            requestAnimationFrame(() => {
              focusOptionAt(firstSelected >= 0 ? firstSelected : 0);
            });
          }
        } else if (isOpen) {
          handleKeyDown(e);
        }
        return;
      }

      if (e.key === ' ') {
        e.preventDefault();
        if (!isOpen && options.length > 0) {
          const firstSelected = options.findIndex((o) => value.includes(o.value));
          setIsOpen(true);
          if (!disableKbNav) {
            requestAnimationFrame(() => {
              focusOptionAt(firstSelected >= 0 ? firstSelected : 0);
            });
          }
        } else if (isOpen) {
          handleKeyDown(e);
        }
        return;
      }

      if (e.key === 'Tab' && isOpen) {
        e.preventDefault();
        const origin = document.activeElement as HTMLElement | null;
        setIsOpen(false);
        resetFocus();
        moveFocusAfterCloseFromElement(origin, e);
        return;
      }

      if (isOpen) {
        handleKeyDown(e);
      }
    };

    return (
      <div
        className={cn(s.multiSelect)}
        data-state={isOpen ? "open" : "closed"}
        data-disabled={disabled ? "true" : undefined}
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
          referenceRef={floatingRefs.setReference}
          onFocus={handleTriggerFocus}
          onClick={() => {
            if (isOpen && !disableCloseOnTriggerClick) {
              setIsOpen(false);
            } else {
              setIsOpen(!isOpen);
            }
          }}
          onKeyDown={triggerKeyDown}
          disabled={disabled}
          isOpen={isOpen}
          className={cn(s.trigger, className)}
          customIcon={icons?.trigger}
          iconClassName={s.triggerIcon}
          enableIconAnimation={!disableIconAnimation}
          styles={s}
        >
          <div className={cn(
            s.triggerContent,
            wrapBadges
              ? s.triggerContentWrap
              : s.triggerContentNoWrap
          )}>
            {visibleBadges.map((option) => (
              <div
                key={option.value}
                className={s.badge}
              >
                <span className={s.badgeText}>{truncateText(option.label)}</span>
                {!hideBadgeRemove && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveBadge(option.value);
                    }}
                    className={s.badgeRemove}
                  >
                    {icons?.badgeClose || <XIcon className={s.badgeRemoveIcon} />}
                  </span>
                )}
              </div>
            ))}
            {!hideRemainingBadge && remainingCount > 0 && (
              <div className={s.remainingBadge}>
                +{remainingCount}
              </div>
            )}
            {value.length === 0 && (
              <span className={s.placeholder}>{placeholder}</span>
            )}
          </div>
        </DropdownTrigger>

        <DropdownPopup
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          footer={!hideFooter}
          resolvedPosition={resolvedPosition}
          setFloating={floatingRefs.setFloating}
          floatingStyles={floatingStyles}
          portalRoot={portalRoot}
          styles={s}
        >
          {/* Header - shown at top when below, at bottom when above (after flip) */}
          {resolvedPosition === 'bottom' && !hideSelectionCount && (
            <div className={s.header}>
              <span className={s.headerText}>
                {value.length} selected
              </span>
            </div>
          )}

          {/* Scrollable Content */}
          <DropdownScrollableContent
            scrollable={!disableScrolling}
            contentMaxHeight={scrollContentMaxHeight}
            blockArrowKeys={disableKbNav}
            styles={s}
          >
            {options.map((option, index) => (
              <button
                key={option.value}
                type="button"
                disabled={option.disabled}
                data-disabled={option.disabled ? "true" : undefined}
                onClick={() => handleMultiSelect(option.value)}
                data-focused={!hideRowHighlight && focusedIndex === index ? "true" : undefined}
                className={cn(
                  s.itemBase,
                  !hideRowHighlight && !isKeyboardMode && s.itemHover,
                  !hideRowHighlight && focusedIndex === index && s.itemFocused,
                  option.disabled && s.itemDisabled,
                  rightAlignCheckboxes && s.itemRightAlign
                )}
                ref={(el) => {
                  setItemRef(el, index);
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
                onMouseEnter={(e) => {
                  handleMouseEnter(index);
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
              >
                {!hideCheckboxes && (
                  <div className={cn(
                    s.checkbox,
                    rightAlignCheckboxes && s.checkboxRightAlign
                  )}>
                    <div
                      className={s.checkboxIconWrapper}
                      data-checked={value.includes(option.value) ? "true" : undefined}
                    >
                      {value.includes(option.value) && (
                        icons?.check || (
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            className={s.checkboxIcon}
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
                )}
                <div className={s.itemContent}>
                  <span
                    className={cn(s.itemContentText, 'scrollable-text', s.itemText)}
                  >
                    {option.label}
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

          {/* Header - shown at bottom when above */}
          {resolvedPosition === 'top' && !hideSelectionCount && (
            <div className={s.header}>
              <span className={s.headerText}>
                {value.length} selected
              </span>
            </div>
          )}
        </DropdownPopup>
      </div>
    );
  }
);

MultiSelect.displayName = "MultiSelect";

