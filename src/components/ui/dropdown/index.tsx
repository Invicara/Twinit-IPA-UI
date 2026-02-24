import React from 'react';
import { SingleSelect } from './single-select';
import { MultiSelect } from './multi-select';

// Export individual components
export { SingleSelect, MultiSelect };

// Export types
export type { SingleSelectProps } from './single-select';
export type { MultiSelectProps } from './multi-select';

// Re-export old types for backward compatibility
export type { DropdownProps, DropdownOption } from './dropdown.types';

// Backward-compatible wrapper
interface UnifiedDropdownProps {
  className?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  disabled?: boolean;
  variant?: 'single' | 'multiselect' | 'filter';
  placeholder?: string;
  maxDisplayBadges?: number;
}

export const Dropdown = React.forwardRef<HTMLDivElement, UnifiedDropdownProps>(
  ({ variant = 'single', ...props }, ref) => {
    switch (variant) {
      case 'multiselect':
        return <MultiSelect {...props as any} ref={ref} />;
      case 'filter':
        return <SingleSelect filter {...props as any} ref={ref} />;
      default:
        return <SingleSelect {...props as any} ref={ref} />;
    }
  }
);

Dropdown.displayName = "Dropdown";

export default Dropdown;
