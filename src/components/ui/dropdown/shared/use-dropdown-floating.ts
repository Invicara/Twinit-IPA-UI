import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
} from '@floating-ui/react';
import type { Placement } from '@floating-ui/react';
import { useLayoutEffect, useMemo } from 'react';
import type { CSSProperties } from 'react';

export type DropdownResolvedPosition = 'top' | 'bottom';

export function getDropdownResolvedPosition(placement: Placement): DropdownResolvedPosition {
  return placement.startsWith('top') ? 'top' : 'bottom';
}

export function useDropdownFloating({
  open,
  preferTop,
  portalContainer,
  floatingZIndex = 1200,
  /** When set, popup max-height is min(viewport, this) so the list does not stretch to the full viewport. */
  maxPopupHeightPx,
}: {
  open: boolean;
  preferTop: boolean;
  portalContainer?: HTMLElement | null;
  floatingZIndex?: number;
  maxPopupHeightPx?: number;
}) {
  const { refs, floatingStyles, placement, update } = useFloating({
    open,
    placement: preferTop ? 'top-start' : 'bottom-start',
    strategy: 'fixed',
    middleware: [
      offset(4),
      flip(),
      shift({ padding: 8 }),
      size({
        apply({ availableHeight, rects, elements }) {
          const cap =
            maxPopupHeightPx != null &&
              maxPopupHeightPx > 0 &&
              availableHeight > 0
              ? Math.min(availableHeight, maxPopupHeightPx)
              : availableHeight;
          Object.assign(elements.floating.style, {
            maxHeight: cap > 0 ? `${cap}px` : '',
            width: `${rects.reference.width}px`,
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  useLayoutEffect(() => {
    if (open) {
      update();
    }
  }, [open, update]);

  const portalRoot = useMemo(() => {
    if (typeof document === 'undefined') return undefined;
    return portalContainer ?? document.getElementById('ipa-ui-modal-root') ?? document.body;
  }, [portalContainer]);

  const resolvedPosition = getDropdownResolvedPosition(placement);

  const mergedFloatingStyles = useMemo((): CSSProperties => {
    return {
      ...floatingStyles,
      zIndex: floatingZIndex,
    };
  }, [floatingStyles, floatingZIndex]);

  return {
    refs,
    floatingStyles: mergedFloatingStyles,
    placement,
    resolvedPosition,
    portalRoot,
  };
}
