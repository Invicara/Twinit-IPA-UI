import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "lucide-react"

import { cn, mergeStyles } from "../../../lib/utils"
import styles from "./accordion.module.css"

const AccordionStylesContext = React.createContext<Record<string, string> | null>(null)

export type AccordionProps = React.ComponentProps<
  typeof AccordionPrimitive.Root
> & {
  /** Style overrides: object mapping slot names to class names. Plain object or CSS module. */
  styleOverrides?: Record<string, string>
}

export interface AccordionItemProps
  extends React.ComponentProps<typeof AccordionPrimitive.Item> {}

export interface AccordionTriggerProps
  extends React.ComponentProps<typeof AccordionPrimitive.Trigger> {}

export interface AccordionContentProps
  extends React.ComponentProps<typeof AccordionPrimitive.Content> {}

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  AccordionItemProps
>(({ className, ...props }, ref) => {
  const s = React.useContext(AccordionStylesContext) ?? styles
  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn(s.item, className)}
      {...props}
    />
  )
})
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, ...props }, ref) => {
  const s = React.useContext(AccordionStylesContext) ?? styles
  return (
    <AccordionPrimitive.Header className={s.header}>
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(s.trigger, className)}
        {...props}
      >
        {children}
        <ChevronDownIcon className={s.icon} />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
})
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  AccordionContentProps
>(({ className, children, ...props }, ref) => {
  const s = React.useContext(AccordionStylesContext) ?? styles
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={s.content}
      {...props}
    >
      <div className={cn(s.contentInner, className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
})
AccordionContent.displayName = "AccordionContent"

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  AccordionProps
>(({ className, styleOverrides, ...props }, ref) => {
  const s = mergeStyles(styles, styleOverrides)
  return (
    <AccordionStylesContext.Provider value={s}>
      <AccordionPrimitive.Root
        ref={ref}
        data-testid="ipa_accordion"
        className={cn(s.accordion, className)}
        {...props}
      />
    </AccordionStylesContext.Provider>
  )
})
Accordion.displayName = "Accordion"

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
}
