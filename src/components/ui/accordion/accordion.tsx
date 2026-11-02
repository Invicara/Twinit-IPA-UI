import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import type {
  AccordionMultipleProps,
  AccordionSingleProps,
} from "@radix-ui/react-accordion"
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

/** Radix: `collapsible` applies only when `type="single"`; it is stripped for `type="multiple"`. */
const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  AccordionProps
>(({ className, styleOverrides, type, ...props }, ref) => {
  const s = mergeStyles(styles, styleOverrides)
  const { collapsible, ...rest } = props as typeof props & {
    collapsible?: boolean
  }
  return (
    <AccordionStylesContext.Provider value={s}>
      {type === "multiple" ? (
        <AccordionPrimitive.Root
          ref={ref}
          data-testid="ipa_accordion"
          className={cn(s.accordion, className)}
          type="multiple"
          {...(rest as Omit<AccordionMultipleProps, "type" | "className">)}
        />
      ) : (
        <AccordionPrimitive.Root
          ref={ref}
          data-testid="ipa_accordion"
          className={cn(s.accordion, className)}
          type="single"
          collapsible={collapsible}
          {...(rest as Omit<AccordionSingleProps, "type" | "className" | "collapsible">)}
        />
      )}
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
