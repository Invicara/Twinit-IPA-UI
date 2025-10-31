import { useState, useEffect, useRef, useCallback } from 'react';

interface UseDropdownKeyboardOptions {
  isOpen: boolean;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  onSelect: (value: string) => void;
  onClose: () => void;
}

export function useDropdownKeyboard({
  isOpen,
  options,
  onSelect,
  onClose
}: UseDropdownKeyboardOptions) {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isKeyboardMode, setIsKeyboardMode] = useState(false);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lastMousePosition = useRef({ x: 0, y: 0 });

  // Reset refs array when options change
  useEffect(() => {
    if (isOpen) {
      itemRefs.current = new Array(options.length);
    }
  }, [options.length, isOpen]);

  // Track actual mouse movement (not just scroll-induced position changes)
  useEffect(() => {
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

    if (isOpen) {
      document.addEventListener('mousemove', handleMouseMove);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [isOpen]);

  // Scroll focused item into view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && focusedIndex < itemRefs.current.length) {
      const focusedItem = itemRefs.current[focusedIndex];
      if (focusedItem) {
        focusedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [focusedIndex, isOpen]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen || options.length === 0) return;

    // Set keyboard navigation mode (will be cleared on actual mouse movement)
    setIsKeyboardMode(true);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => 
          prev < options.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => {
          if (prev <= 0) return options.length - 1;
          return prev - 1;
        });
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < options.length) {
          const option = options[focusedIndex];
          if (!option.disabled) {
            onSelect(option.value);
            setFocusedIndex(-1);
          }
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        setFocusedIndex(-1);
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedIndex(options.length - 1);
        break;
    }
  }, [isOpen, options, focusedIndex, onSelect, onClose]);

  const handleMouseEnter = useCallback((index: number) => {
    // Ignore mouse events during keyboard navigation
    if (isKeyboardMode) return;
    setFocusedIndex(index);
  }, [isKeyboardMode]);

  const setItemRef = useCallback((el: HTMLButtonElement | null, index: number) => {
    itemRefs.current[index] = el;
  }, []);

  return {
    focusedIndex,
    isKeyboardMode,
    handleKeyDown,
    handleMouseEnter,
    setItemRef,
    resetFocus: () => setFocusedIndex(-1)
  };
}

