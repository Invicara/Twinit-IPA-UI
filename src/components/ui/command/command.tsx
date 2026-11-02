import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"
import * as React from "react"

import { cn, mergeStyles } from "../../../lib/utils"
import styles from "./command.module.css"

export interface CommandProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive> {
  styleOverrides?: Record<string, string>
}

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  CommandProps
>(({ className, styleOverrides, ...props }, ref) => {
  const s = mergeStyles(styles, styleOverrides)
  return (
    <CommandPrimitive
      ref={ref}
      data-testid="ipa_command"
      className={cn(s.command, className)}
      {...props}
    />
  )
})
Command.displayName = CommandPrimitive.displayName

export interface CommandInputProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input> {
  styleOverrides?: Record<string, string>
}

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  CommandInputProps
>(({ className, styleOverrides, ...props }, ref) => {
  const s = mergeStyles(styles, styleOverrides)
  return (
    <div className={s.inputWrapper} cmdk-input-wrapper="">
      <Search className={s.inputIcon} aria-hidden />
      <CommandPrimitive.Input
        ref={ref}
        data-testid="ipa_command_input"
        className={cn(s.input, className)}
        {...props}
      />
    </div>
  )
})
CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    data-testid="ipa_command_list"
    className={cn(styles.list, className)}
    {...props}
  />
))
CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    data-testid="ipa_command_empty"
    className={cn(styles.empty, className)}
    {...props}
  />
))
CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(styles.group, className)}
    {...props}
  />
))
CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn(styles.separator, className)}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

export interface CommandItemProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item> {
  styleOverrides?: Record<string, string>
}

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  CommandItemProps
>(({ className, styleOverrides, ...props }, ref) => {
  const s = mergeStyles(styles, styleOverrides)
  return (
    <CommandPrimitive.Item
      ref={ref}
      data-testid="ipa_command_item"
      className={cn(s.item, className)}
      {...props}
    />
  )
})
CommandItem.displayName = CommandPrimitive.Item.displayName

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
}
