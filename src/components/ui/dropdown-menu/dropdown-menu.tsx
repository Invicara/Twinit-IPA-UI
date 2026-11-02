import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check } from "lucide-react"

import { cn, mergeStyles } from "../../../lib/utils"
import styles from "./dropdown-menu.module.css"

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuGroup = DropdownMenuPrimitive.Group
const DropdownMenuPortal = DropdownMenuPrimitive.Portal

export interface DropdownMenuContentProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> {
  styleOverrides?: Record<string, string>
  container?: HTMLElement | null
}

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  DropdownMenuContentProps
>(({ className, styleOverrides, container, sideOffset = 4, ...props }, ref) => {
  const s = mergeStyles(styles, styleOverrides)
  const portalContainer =
    container ??
    (typeof document !== "undefined"
      ? document.getElementById("ipa-ui-modal-root") ?? undefined
      : undefined)

  return (
    <DropdownMenuPrimitive.Portal container={portalContainer}>
      <DropdownMenuPrimitive.Content
        ref={ref}
        data-testid="ipa_dropdown_menu_content"
        sideOffset={sideOffset}
        className={cn(s.content, className)}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
})
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

export interface DropdownMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
  styleOverrides?: Record<string, string>
}

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>(({ className, styleOverrides, ...props }, ref) => {
  const s = mergeStyles(styles, styleOverrides)
  return (
    <DropdownMenuPrimitive.Item
      ref={ref}
      data-testid="ipa_dropdown_menu_item"
      className={cn(s.item, className)}
      {...props}
    />
  )
})
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

export interface DropdownMenuCheckboxItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem> {
  styleOverrides?: Record<string, string>
}

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  DropdownMenuCheckboxItemProps
>(({ className, styleOverrides, children, checked, ...props }, ref) => {
  const s = mergeStyles(styles, styleOverrides)
  return (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      data-testid="ipa_dropdown_menu_checkbox_item"
      className={cn(s.checkboxItem, className)}
      checked={checked}
      {...props}
    >
      {children}
      <DropdownMenuPrimitive.ItemIndicator className={s.itemIndicator}>
        <Check aria-hidden />
      </DropdownMenuPrimitive.ItemIndicator>
    </DropdownMenuPrimitive.CheckboxItem>
  )
})
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName

export interface DropdownMenuSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator> {
  styleOverrides?: Record<string, string>
}

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  DropdownMenuSeparatorProps
>(({ className, styleOverrides, ...props }, ref) => {
  const s = mergeStyles(styles, styleOverrides)
  return (
    <DropdownMenuPrimitive.Separator
      ref={ref}
      data-testid="ipa_dropdown_menu_separator"
      className={cn(s.separator, className)}
      {...props}
    />
  )
})
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuPortal,
}
