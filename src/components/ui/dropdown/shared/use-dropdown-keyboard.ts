import { useState, useEffect, useRef, useCallback } from 'react';

interface UseDropdownKeyboardOptions {
  isOpen: boolean;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  onSelect: (value: string) => void;
  onClose: () => void;
  disableSelectionLooping?: boolean;
  isMultiSelect?: boolean;
}

export function useDropdownKeyboard({
  isOpen,
  options,
  onSelect,
  onClose,
  disableSelectionLooping = false,
  isMultiSelect = false
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
    if (options.length === 0) return;

    // Set keyboard navigation mode (will be cleared on actual mouse movement)
    setIsKeyboardMode(true);

    if (e.key === 'Tab') {
      // If dropdown is already open and an item is highlighted, close dropdown and move to next element
      if (isOpen && focusedIndex >= 0) {
        onClose();
        setFocusedIndex(-1);
        // Don't prevent default - allow Tab to move focus to next element
        return;
      }
      // Otherwise, highlight first item
      e.preventDefault();
      if (!isOpen) {
        // This case is handled by the component, but we ensure first item is highlighted
        setFocusedIndex(0);
      } else {
        setFocusedIndex(0);
      }
      return;
    }

    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (disableSelectionLooping) {
          setFocusedIndex((prev) => {
            if (prev < 0) return 0; // Initialize if no item is focused
            return prev < options.length - 1 ? prev + 1 : prev;
          });
        } else {
          setFocusedIndex((prev) => {
            if (prev < 0) return 0; // Initialize if no item is focused
            return prev < options.length - 1 ? prev + 1 : 0;
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
            if (prev < 0) return options.length - 1; // Initialize to last item if no item is focused
            return prev > 0 ? prev - 1 : options.length - 1;
          });
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < options.length) {
          const option = options[focusedIndex];
          if (!option.disabled) {
            onSelect(option.value);
            // Enter always closes the dropdown, but for multiselect, keep focus on the item for continued navigation
            onClose();
            // For multiselect, keep focus index so user can continue navigating when dropdown reopens
            // For single-select, reset focus
            if (!isMultiSelect) {
              setFocusedIndex(-1);
            }
          }
        }
        break;
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < options.length) {
          const option = options[focusedIndex];
          if (!option.disabled) {
            onSelect(option.value);
            // Spacebar selects but doesn't close dropdown - keep focus
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
  }, [isOpen, options, focusedIndex, onSelect, onClose, disableSelectionLooping, isMultiSelect]);

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

