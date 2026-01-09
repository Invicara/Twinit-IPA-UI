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
  disableCloseOnOutsideClick?: boolean;
  disableCloseOnTriggerClick?: boolean;
  rightAlignCheckboxes?: boolean;
  wrapBadges?: boolean;
  popAbove?: boolean;

  // Icons
  icons?: {
    trigger?: React.ReactNode;
    badgeClose?: React.ReactNode;
    check?: React.ReactNode;
  };
  
  // Styling
  classNames?: {
    container?: string;
    trigger?: string;
    popup?: string;
    scrollContent?: string;
    item?: string;
    itemFocused?: string;
    itemDisabled?: string;
    itemText?: string;
    ellipsis?: string;
    footer?: string;
    triggerContent?: string;
    triggerIcon?: string;
    badge?: string;
    badgeText?: string;
    badgeRemove?: string;
    badgeRemoveIcon?: string;
    remainingBadge?: string;
    placeholder?: string;
    header?: string;
    checkbox?: string;
    checkboxChecked?: string;
    checkIcon?: string;
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
      disableCloseOnOutsideClick,
      disableCloseOnTriggerClick,
      rightAlignCheckboxes,
      wrapBadges,
      popAbove,
      disableSelectionLooping = false,
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
        // Don't reset focus - keep the current item highlighted for continued keyboard navigation
      },
      onClose: () => setIsOpen(false),
      disableSelectionLooping,
      isMultiSelect: true
    });

    useClickOutside(dropdownRef, () => {
      if (!disableCloseOnOutsideClick) {
        setIsOpen(false);
        resetFocus();
      }
    }, isOpen && !disableCloseOnOutsideClick);

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
      if (disableKeyboardNavigation) return;
      
      if (e.key === 'Enter') {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          handleKeyDown(e);
        }
      } else if (e.key === ' ') {
        // Spacebar: open dropdown if closed, or select item if open
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          // Highlight first item when opening with spacebar - use requestAnimationFrame to ensure state updates
          requestAnimationFrame(() => {
            handleKeyDown({ ...e, key: 'Tab' } as React.KeyboardEvent);
          });
        } else {
          handleKeyDown(e);
        }
      } else if (e.key === 'Tab' && options.length > 0) {
        // If dropdown is already open and an item is highlighted, close dropdown and move to next element
        if (isOpen && focusedIndex >= 0) {
          setIsOpen(false);
          resetFocus();
          // Don't prevent default - allow Tab to move focus to next element
          return;
        }
        // Otherwise, open dropdown and highlight first item
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        // The hook will handle setting focusedIndex to 0
        handleKeyDown(e);
      } else if (isOpen) {
        handleKeyDown(e);
      }
    };

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
        <DropdownTrigger
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
          className={cn("ipa-ui-dropdown-multi__trigger", className, classNames?.trigger)}
          customIcon={icons?.trigger}
          iconClassName={classNames?.triggerIcon}
          enableIconAnimation={!disableIconAnimation}
        >
          <div className={cn(
            "ipa-ui-dropdown-multi__trigger-content",
            wrapBadges ? "ipa-ui-dropdown-multi__trigger-content--wrap" : "ipa-ui-dropdown-multi__trigger-content--no-wrap",
            classNames?.triggerContent
          )}>
            {visibleBadges.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "ipa-ui-dropdown-multi__badge",
                  classNames?.badge
                )}
              >
                <span className={cn("ipa-ui-dropdown-multi__badge-text", classNames?.badgeText)}>{truncateText(option.label)}</span>
                {!hideBadgeRemove && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveBadge(option.value);
                    }}
                    className={cn(
                      "ipa-ui-dropdown-multi__badge-remove",
                      classNames?.badgeRemove
                    )}
                  >
                    {icons?.badgeClose || <XIcon className={cn("text-brand-8", classNames?.badgeRemoveIcon)} />}
                  </span>
                )}
              </div>
            ))}
            {!hideRemainingBadge && remainingCount > 0 && (
              <div className={cn(
                "ipa-ui-dropdown-multi__remaining-badge",
                classNames?.remainingBadge
              )}>
                +{remainingCount}
              </div>
            )}
            {value.length === 0 && (
              <span className={cn("ipa-ui-dropdown-multi__placeholder", classNames?.placeholder)}>{placeholder}</span>
            )}
          </div>
        </DropdownTrigger>
        
        <DropdownPopup isOpen={isOpen} onClose={() => setIsOpen(false)} className={classNames?.popup} footer={!hideFooter} popAbove={popAbove}>
          {/* Header - shown at top when popBelow (default), at bottom when popAbove */}
          {!popAbove && !hideSelectionCount && (
            <div className={cn("ipa-ui-dropdown-multi__header", classNames?.header)}>
              <span className="ipa-ui-dropdown-multi__header-text">
                {value.length} selected
              </span>
            </div>
          )}
          
          {/* Scrollable Content */}
          <DropdownScrollableContent className={classNames?.scrollContent} scrollable={!disableScrolling}>
            {options.map((option, index) => (
              <button
                key={option.value}
                type="button"
                disabled={option.disabled}
                onClick={() => handleMultiSelect(option.value)}
                className={cn(
                  DROPDOWN_STYLES.itemBase,
                  !hideRowHighlight && focusedIndex === index && "ipa-ui-dropdown-multi__item--focused",
                  !hideRowHighlight && !isKeyboardMode && "ipa-ui-dropdown-multi__item--hover group",
                  classNames?.item,
                  !hideRowHighlight && focusedIndex === index && classNames?.itemFocused,
                  option.disabled && classNames?.itemDisabled,
                  rightAlignCheckboxes && 'ipa-ui-dropdown-multi__item--right-align'
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
                    "ipa-ui-dropdown-multi__checkbox",
                    rightAlignCheckboxes && 'ipa-ui-dropdown-multi__checkbox--right-align'
                  )}>
                    <div
                      className={cn(
                        "ipa-ui-dropdown-multi__checkbox-icon-wrapper",
                        value.includes(option.value) 
                          ? "ipa-ui-dropdown-multi__checkbox-icon-wrapper--checked" 
                          : "ipa-ui-dropdown-multi__checkbox-icon-wrapper--unchecked",
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
                            className={cn("ipa-ui-dropdown-multi__checkbox-icon", classNames?.checkIcon)}
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
                <div className="ipa-ui-dropdown-multi__item-content">
                  <span 
                    className={cn("ipa-ui-dropdown-multi__item-content-text scrollable-text", classNames?.itemText)}
                  >
                    {option.label}
                  </span>
                  {!hideLongTextEllipsis && (
                    <span className={cn(
                      "ipa-ui-dropdown-multi__item-content-ellipsis-indicator ellipsis-indicator",
                      !hideRowHighlight && focusedIndex === index ? "ipa-ui-dropdown-multi__item-content-ellipsis-indicator--focused" : "ipa-ui-dropdown-multi__item-content-ellipsis-indicator--unfocused",
                      !hideRowHighlight && !isKeyboardMode && "ipa-ui-dropdown-multi__item-content-ellipsis-indicator--hover",
                      classNames?.ellipsis
                    )}>
                      ..
                    </span>
                  )}
                </div>
              </button>
            ))}
          </DropdownScrollableContent>
          
          {/* Header - shown at bottom when popAbove */}
          {popAbove && !hideSelectionCount && (
            <div className={cn("ipa-ui-dropdown-multi__header", classNames?.header)}>
              <span className="ipa-ui-dropdown-multi__header-text">
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

