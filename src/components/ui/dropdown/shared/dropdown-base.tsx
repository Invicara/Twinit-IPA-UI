import * as React from 'react';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { FloatingPortal } from '@floating-ui/react';
import { cn } from '../../../../lib/utils';
import type { CSSProperties, ReactNode } from 'react';

/** Approximate one option row height (itemBase vertical padding + line box). */
export const DROPDOWN_OPTION_ROW_HEIGHT_PX = 35;

/** Default max option rows before the list scrolls (SingleSelect / MultiSelect). */
export const DROPDOWN_DEFAULT_MAX_VISIBLE_OPTIONS = 8;

/** Footer strip under the list (padding + chevron). Used to cap portaled popup height. */
export const DROPDOWN_FOOTER_HEIGHT_PX = 28;

/**
 * Max height for the whole portaled popup (list + optional footer) when the list uses
 * a row cap. Keeps Floating UI `size()` from using full viewport height, which was
 * stretching the flex layout after the portal change.
 */
export function getPopupMaxHeightPx(
  scrollContentMaxHeight: string | undefined,
  showFooter: boolean
): number | undefined {
  if (!scrollContentMaxHeight) return undefined;
  const n = Number.parseFloat(scrollContentMaxHeight);
  if (!Number.isFinite(n) || n <= 0) return undefined;
  return Math.round(n + (showFooter ? DROPDOWN_FOOTER_HEIGHT_PX : 0));
}

/**
 * Max height for the scroll region from a cap on visible option rows; `false` = viewport only.
 * Accepts numeric strings (e.g. Storybook select controls) and coerces them to numbers.
 */
export function getDropdownScrollContentMaxHeight(
  maxVisibleOptions: number | false | string | undefined,
  disableScrolling: boolean
): string | undefined {
  if (disableScrolling) return undefined;
  if (maxVisibleOptions === false) return undefined;
  if (typeof maxVisibleOptions === 'string' && maxVisibleOptions.trim().toLowerCase() === 'false') {
    return undefined;
  }

  let n: number;
  if (maxVisibleOptions === undefined || maxVisibleOptions === null) {
    n = DROPDOWN_DEFAULT_MAX_VISIBLE_OPTIONS;
  } else if (typeof maxVisibleOptions === 'number') {
    n = maxVisibleOptions;
  } else if (typeof maxVisibleOptions === 'string') {
    const parsed = Number(maxVisibleOptions.trim());
    n = Number.isFinite(parsed) ? parsed : DROPDOWN_DEFAULT_MAX_VISIBLE_OPTIONS;
  } else {
    n = DROPDOWN_DEFAULT_MAX_VISIBLE_OPTIONS;
  }

  if (!Number.isFinite(n) || n <= 0) return undefined;
  return `${Math.floor(n) * DROPDOWN_OPTION_ROW_HEIGHT_PX}px`;
}

export function DropdownTrigger({
  onClick,
  onFocus,
  disabled,
  children,
  isOpen = false,
  className,
  customTrigger,
  onKeyDown,
  customIcon,
  iconClassName,
  enableIconAnimation = true,
  referenceRef,
  styles: s
}: {
  onClick: () => void;
  onFocus?: React.FocusEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  children: ReactNode;
  isOpen?: boolean;
  className?: string;
  customTrigger?: ReactNode;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  customIcon?: ReactNode;
  iconClassName?: string;
  enableIconAnimation?: boolean;
  /** Floating UI reference (trigger) */
  referenceRef?: React.Ref<HTMLButtonElement | null>;
  styles: Record<string, string>;
}) {
  if (customTrigger) {
    return <>{customTrigger}</>;
  }

  return (
    <button
      type="button"
      ref={referenceRef}
      onClick={onClick}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      disabled={disabled}
      data-disabled={disabled ? "true" : undefined}
      data-state={isOpen ? "open" : "closed"}
      className={cn(s.triggerBase, className)}
    >
      {children}
      {customIcon ? (
        <div className={cn(
          enableIconAnimation && s.triggerIconTransition,
          s.triggerIcon,
          iconClassName
        )}>
          {customIcon}
        </div>
      ) : (
        <ChevronDownIcon className={cn(
          s.triggerIcon,
          enableIconAnimation && s.triggerIconTransition,
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
  footer = true,
  resolvedPosition,
  setFloating,
  floatingStyles,
  portalRoot,
  styles: s
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  footer?: boolean;
  /** Vertical side after flip (top | bottom) */
  resolvedPosition: 'top' | 'bottom';
  setFloating: (node: HTMLElement | null) => void;
  floatingStyles: CSSProperties;
  portalRoot?: HTMLElement | ShadowRoot | null;
  styles: Record<string, string>;
}) {
  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  const footerElement = footer && (
    <div className={s.footer} onClick={onClose}>
      <ChevronDownIcon className={s.triggerIcon} />
    </div>
  );

  const isTop = resolvedPosition === 'top';

  const popup = (
    <div
      role="listbox"
      data-ipa-ui-dropdown-floating="true"
      data-position={isTop ? 'top' : 'bottom'}
      ref={setFloating}
      style={floatingStyles}
      className={cn(s.popup, className)}
    >
      {isTop && footerElement}
      {children}
      {!isTop && footerElement}
    </div>
  );

  return (
    <FloatingPortal root={portalRoot ?? undefined}>
      {popup}
    </FloatingPortal>
  );
}

export function DropdownScrollableContent({
  children,
  className,
  scrollable = true,
  contentMaxHeight,
  blockArrowKeys = false,
  styles: s
}: {
  children: ReactNode;
  className?: string;
  scrollable?: boolean;
  /** Caps list height before scrolling (e.g. from maxVisibleOptions). */
  contentMaxHeight?: string;
  /** Ignore ArrowUp/ArrowDown so this scroller does not move. */
  blockArrowKeys?: boolean;
  styles: Record<string, string>;
}) {
  const scrollerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const scroller = scrollerRef.current;
    if (!blockArrowKeys || !scroller) return;
    const block = (event: KeyboardEvent) => {
      if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
      event.preventDefault();
      event.stopPropagation();
    };
    scroller.addEventListener("keydown", block, true);
    return () => scroller.removeEventListener("keydown", block, true);
  }, [blockArrowKeys]);

  return (
    <div
      ref={scrollerRef}
      className={cn(s.scrollContent, scrollable && 'custom-scrollbar', className)}
      data-scrollable={scrollable ? "true" : undefined}
      data-block-arrow-keys={blockArrowKeys ? "true" : undefined}
      tabIndex={blockArrowKeys ? -1 : undefined}
      style={contentMaxHeight ? { maxHeight: contentMaxHeight } : undefined}
    >
      {children}
    </div>
  );
}
