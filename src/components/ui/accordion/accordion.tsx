import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "../../../lib/utils"
import styles from "./accordion.module.css"

export type AccordionProps = React.ComponentProps<
  typeof AccordionPrimitive.Root
> & {
  classNames?: {
    accordion?: string
  }
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
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(styles.item, className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className={styles.header}>
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(styles.trigger, className)}
      {...props}
    >
      {children}
      <ChevronDownIcon className={styles.icon} />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  AccordionContentProps
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={styles.content}
    {...props}
  >
    <div className={cn(styles.contentInner, className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = "AccordionContent"

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  AccordionProps
>(({ className, classNames, ...props }, ref) => (
  <AccordionPrimitive.Root
    ref={ref}
    data-testid="ipa_accordion"
    className={cn(styles.accordion, className, classNames?.accordion)}
    {...props}
  />
))
Accordion.displayName = "Accordion"

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
}
