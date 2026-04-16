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
}: {
  open: boolean;
  preferTop: boolean;
  portalContainer?: HTMLElement | null;
  floatingZIndex?: number;
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
          Object.assign(elements.floating.style, {
            maxHeight: availableHeight > 0 ? `${availableHeight}px` : '',
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
