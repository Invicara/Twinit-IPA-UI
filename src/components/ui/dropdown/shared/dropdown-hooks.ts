import { useEffect, RefObject } from 'react';

export function useClickOutside(
  ref: RefObject<HTMLDivElement | null>,
  onClose: () => void,
  isOpen: boolean,
  floatingRef?: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    if (!isOpen) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const inPrimary = ref.current?.contains(target);
      const inFloating = floatingRef?.current?.contains(target);
      if (!inPrimary && !inFloating) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, ref, floatingRef, onClose]);
}

