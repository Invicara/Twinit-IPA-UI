import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";

/** Arrow keys scroll whatever is under the pointer unless the event is cancelled. */
export function useSuppressDropdownKeyDefaults(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const block = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
      }
    };
    window.addEventListener("keydown", block, true);
    return () => window.removeEventListener("keydown", block, true);
  }, [active]);
}

interface UseDropdownKeyboardOptions {
  isOpen: boolean;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  onSelect: (value: string) => void;
  onClose: () => void;
  disableSelectionLooping?: boolean;
  /** When true, ArrowUp/ArrowDown do not move the active option (opening from closed is handled in the trigger). */
  disableArrowNavigation?: boolean;
}

/**
 * Listbox keyboard when the menu is open (Arrow, Enter, Space, Escape).
 * Tab and open-from-closed are handled in SingleSelect / MultiSelect triggers.
 */
export function useDropdownKeyboard({
  isOpen,
  options,
  onSelect,
  onClose,
  disableSelectionLooping = false,
  disableArrowNavigation = false,
}: UseDropdownKeyboardOptions) {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isKeyboardMode, setIsKeyboardMode] = useState(false);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  const focusedIndexRef = useRef(focusedIndex);
  focusedIndexRef.current = focusedIndex;

  useEffect(() => {
    if (isOpen) {
      itemRefs.current = new Array(options.length);
    }
  }, [options.length, isOpen]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const moved =
        Math.abs(e.clientX - lastMousePosition.current.x) > 2 ||
        Math.abs(e.clientY - lastMousePosition.current.y) > 2;

      if (moved) {
        setIsKeyboardMode(false);
        lastMousePosition.current = { x: e.clientX, y: e.clientY };
      }
    };

    if (isOpen) {
      document.addEventListener("mousemove", handleMouseMove);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [isOpen]);

  useLayoutEffect(() => {
    if (
      !isKeyboardMode ||
      !isOpen ||
      focusedIndex < 0 ||
      focusedIndex >= itemRefs.current.length
    ) {
      return;
    }
    const focusedItem = itemRefs.current[focusedIndex];
    if (focusedItem) {
      focusedItem.scrollIntoView({ block: "center", inline: "nearest" });
    }
  }, [focusedIndex, isOpen, isKeyboardMode]);

  const focusOptionAt = useCallback((index: number) => {
    setIsKeyboardMode(true);
    if (options.length === 0) return;
    const clamped = Math.max(0, Math.min(options.length - 1, index));
    setFocusedIndex(clamped);
  }, [options.length]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (options.length === 0) return;

      if (!disableArrowNavigation) {
        setIsKeyboardMode(true);
      }

      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          if (disableArrowNavigation) {
            e.preventDefault();
            return;
          }
          e.preventDefault();
          if (disableSelectionLooping) {
            setFocusedIndex((prev) => {
              if (prev < 0) return 0;
              return prev < options.length - 1 ? prev + 1 : prev;
            });
          } else {
            setFocusedIndex((prev) => {
              if (prev < 0) return 0;
              return prev < options.length - 1 ? prev + 1 : 0;
            });
          }
          break;
        case "ArrowUp":
          if (disableArrowNavigation) {
            e.preventDefault();
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
              if (prev < 0) return options.length - 1;
              return prev > 0 ? prev - 1 : options.length - 1;
            });
          }
          break;
        case "Enter":
          e.preventDefault();
          if (disableArrowNavigation) return;
          {
            const fi = focusedIndexRef.current;
            const idx =
              fi >= 0 && fi < options.length ? fi : 0;
            const option = options[idx];
            if (option && !option.disabled) {
              onSelect(option.value);
              onClose();
              setFocusedIndex(-1);
            }
          }
          break;
        case " ": {
          e.preventDefault();
          if (disableArrowNavigation) return;
          const fi = focusedIndexRef.current;
          const idx = fi >= 0 && fi < options.length ? fi : 0;
          const option = options[idx];
          if (option && !option.disabled) {
            onSelect(option.value);
            // MultiSelect: Space toggles selection but keeps the list open (Enter closes).
          }
          break;
        }
        case "Escape":
          e.preventDefault();
          onClose();
          setFocusedIndex(-1);
          break;
        default:
          break;
      }
    },
    [
      isOpen,
      options,
      onSelect,
      onClose,
      disableSelectionLooping,
      disableArrowNavigation,
    ]
  );

  const handleMouseEnter = useCallback((index: number) => {
    setIsKeyboardMode(false);
    setFocusedIndex(index);
  }, []);

  const setItemRef = useCallback((el: HTMLButtonElement | null, index: number) => {
    itemRefs.current[index] = el;
  }, []);

  useSuppressDropdownKeyDefaults(isOpen && disableArrowNavigation);

  return {
    focusedIndex,
    isKeyboardMode,
    handleKeyDown,
    handleMouseEnter,
    setItemRef,
    resetFocus: () => setFocusedIndex(-1),
    focusOptionAt,
  };
}
