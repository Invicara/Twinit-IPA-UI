export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps {
  className?: string;
  options: DropdownOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  disabled?: boolean;
  variant?: 'single' | 'multiselect' | 'filter';
  placeholder?: string;
  maxDisplayBadges?: number;
}
