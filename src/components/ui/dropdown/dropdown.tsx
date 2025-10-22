import * as React from "react";
import * as Select from "@radix-ui/react-select";
import * as Checkbox from "@radix-ui/react-checkbox";
import { ChevronDownIcon, Cross2Icon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "../../../lib/utils";

import '../../../output.css';

interface DropdownProps {
  className?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  disabled?: boolean;
  variant?: 'single' | 'multiselect';
  placeholder?: string;
  maxDisplayBadges?: number;
}

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      className,
      options,
      value,
      onChange,
      disabled,
      variant = 'single',
      placeholder = 'Default',
      maxDisplayBadges = 2,
      ...props
    },
    ref
  ) => {
    const isMultiselect = variant === 'multiselect';
    const selectedValues = isMultiselect ? (Array.isArray(value) ? value : []) : [];
    const singleValue = isMultiselect ? '' : (typeof value === 'string' ? value : '');

    const handleMultiSelect = (optionValue: string) => {
      if (!onChange) return;
      
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue];
      
      onChange(newValues);
    };

    const handleRemoveBadge = (optionValue: string) => {
      if (!onChange || !isMultiselect) return;
      
      const newValues = selectedValues.filter(v => v !== optionValue);
      onChange(newValues);
    };

    const getSelectedOptions = () => {
      return options.filter(option => selectedValues.includes(option.value));
    };

    const getDisplayBadges = () => {
      const selected = getSelectedOptions();
      const visibleBadges = selected.slice(0, maxDisplayBadges);
      const remainingCount = selected.length - maxDisplayBadges;
      
      return { visibleBadges, remainingCount };
    };
    return (
      <div className="relative" ref={ref} {...props}>
        <Select.Root 
          value={isMultiselect ? undefined : singleValue} 
          onValueChange={isMultiselect ? undefined : onChange} 
          disabled={disabled}
        >
          <Select.Trigger
            className={cn(
              "flex items-center justify-between rounded-[4px] border border-neutral-6 bg-neutral-0 px-[12px] py-[8px] font-sans text-[14px] font-normal leading-[19px] text-neutral-6 transition-colors focus-visible:outline-none focus:border-digital-twin-6 focus-visible:border-digital-twin-6 hover:border-neutral-6 data-[state=open]:border-digital-twin-6",
              isMultiselect ? "min-h-[36px] w-[284px]" : "h-[36px] w-[284px]",
              disabled && "border-neutral-5 bg-neutral-1 text-neutral-5 cursor-not-allowed",
              className
            )}
          >
            {isMultiselect ? (
              <div className="flex flex-wrap gap-1 flex-1 min-w-0">
                {(() => {
                  const { visibleBadges, remainingCount } = getDisplayBadges();
                  return (
                    <>
                      {visibleBadges.map((option) => (
                        <div
                          key={option.value}
                          className="inline-flex items-center gap-1 bg-digital-twin-6 text-white px-2 py-1 rounded-full text-xs"
                        >
                          <span>{option.label}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveBadge(option.value);
                            }}
                            className="hover:bg-digital-twin-8 rounded-full p-0.5"
                          >
                            <Cross2Icon className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      {remainingCount > 0 && (
                        <div className="inline-flex items-center bg-digital-twin-6 text-white px-2 py-1 rounded-full text-xs">
                          +{remainingCount}
                        </div>
                      )}
                      {selectedValues.length === 0 && (
                        <span className="text-neutral-5">{placeholder}</span>
                      )}
                    </>
                  );
                })()}
              </div>
            ) : (
              <Select.Value placeholder={placeholder} className="text-neutral-6" />
            )}
            <Select.Icon className="text-neutral-5 transition-transform duration-200 data-[state=open]:rotate-180">
              <ChevronDownIcon className="h-5 w-5 stroke-[1.5]" />
            </Select.Icon>
          </Select.Trigger>
          
          <Select.Portal>
            <Select.Content
              className="relative z-50 w-[284px] overflow-hidden rounded-[4px] bg-neutral-0 shadow-[0_8px_25px_-5px_rgba(0,0,0,0.1),0_4px_10px_-2px_rgba(0,0,0,0.04)] border border-neutral-2"
              sideOffset={4}
              align="start"
              position="popper"
            >
              <Select.Viewport className="p-0">
                {isMultiselect && (
                  <div className="px-[4px] py-[4px] bg-neutral-0 flex">
                    <span className="px-[6px] text-[13px] text-neutral-4">
                      {selectedValues.length} selected
                    </span>
                  </div>
                )}
                {options.map((option) => (
                  isMultiselect ? (
                    <Select.Item
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                      className={cn(
                        "relative flex w-full cursor-default select-none items-center py-[8px] px-[12px] text-[14px] text-neutral-6 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-neutral-1 data-[disabled]:opacity-50 hover:bg-neutral-1 focus:bg-neutral-1",
                        selectedValues.includes(option.value) && "bg-neutral-1"
                      )}
                      onSelect={() => {
                        handleMultiSelect(option.value);
                      }}
                    >
                      <div className="mr-3 flex items-center justify-center">
                        <Checkbox.Root
                          checked={selectedValues.includes(option.value)}
                          onCheckedChange={() => handleMultiSelect(option.value)}
                          className={cn(
                            "w-4 h-4 rounded flex items-center justify-center border-2",
                            selectedValues.includes(option.value) 
                              ? "bg-digital-twin-6 border-digital-twin-6" 
                              : "bg-white border-neutral-4"
                          )}
                          style={{
                            backgroundColor: selectedValues.includes(option.value) ? undefined : 'white'
                          }}
                        >
                          <Checkbox.Indicator className="flex items-center justify-center">
                            <CheckIcon className="w-3 h-3 text-white" />
                          </Checkbox.Indicator>
                        </Checkbox.Root>
                      </div>
                      <Select.ItemText>{option.label}</Select.ItemText>
                    </Select.Item>
                  ) : (
                    <Select.Item
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                      className="relative flex w-full cursor-default select-none items-center py-[8px] px-[12px] text-[14px] text-neutral-6 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-neutral-1 data-[disabled]:opacity-50 hover:bg-neutral-1 focus:bg-neutral-1"
                    >
                      <Select.ItemText>{option.label}</Select.ItemText>
                    </Select.Item>
                  )
                ))}
                <div className="flex justify-center py-[2px]">
                  <ChevronDownIcon className="h-5 w-5 text-neutral-5 stroke-[1.5]" />
                </div>
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>
    );
  }
);

Dropdown.displayName = "Dropdown";

export { Dropdown };
export default Dropdown;