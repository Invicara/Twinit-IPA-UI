import { useEffect, RefObject } from 'react';

export function useClickOutside(
  ref: RefObject<HTMLDivElement | null>, 
  onClose: () => void, 
  isOpen: boolean
) {
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, ref, onClose]);
}

