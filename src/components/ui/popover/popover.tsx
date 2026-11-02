import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn, mergeStyles } from "../../../lib/utils"
import styles from "./popover.module.css"

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverAnchor = PopoverPrimitive.Anchor
const PopoverClose = PopoverPrimitive.Close

const POPOVER_SIDES = ["top", "right", "bottom", "left"] as const

type PopoverSide = (typeof POPOVER_SIDES)[number]

function isPopoverSide(value: string | null | undefined): value is PopoverSide {
  return POPOVER_SIDES.some((side) => side === value)
}

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value)
    return
  }
  if (ref) ref.current = value
}

export interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  styleOverrides?: Record<string, string>
  container?: HTMLElement | null
  /**
   * After the menu picks a side, keep that side while it stays open.
   * Search results changing height will not flip it to the other side.
   */
  stickPlacement?: boolean
}

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(
  (
    {
      className,
      styleOverrides,
      container,
      align = "center",
      sideOffset = 4,
      side,
      avoidCollisions,
      onPlaced,
      stickPlacement = false,
      ...props
    },
    ref
  ) => {
    const s = mergeStyles(styles, styleOverrides)
    const contentRef = React.useRef<HTMLDivElement | null>(null)
    const lockedSideRef = React.useRef<PopoverSide | undefined>(undefined)
    const [lockedSide, setLockedSide] = React.useState<PopoverSide>()
    const portalContainer =
      container ??
      (typeof document !== "undefined"
        ? document.getElementById("ipa-ui-modal-root") ?? undefined
        : undefined)
    const placementLocked = stickPlacement && lockedSide !== undefined

    const composedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        contentRef.current = node
        assignRef(ref, node)
        if (node || !stickPlacement) return
        // Popper refreshes its ref on every render by calling it with null and
        // then the node again. Wait a task so that refresh does not drop the
        // side chosen when the menu opened. A real close leaves the node unset.
        queueMicrotask(() => {
          if (contentRef.current) return
          lockedSideRef.current = undefined
          setLockedSide(undefined)
        })
      },
      [ref, stickPlacement]
    )

    const handlePlaced = React.useCallback(() => {
      onPlaced?.()
      if (!stickPlacement) return
      if (!lockedSideRef.current) {
        const placed = contentRef.current?.getAttribute("data-side")
        if (isPopoverSide(placed)) lockedSideRef.current = placed
      }
      const next = lockedSideRef.current
      if (!next) return
      setLockedSide((current) => (current === next ? current : next))
    }, [onPlaced, stickPlacement])

    return (
      <PopoverPrimitive.Portal container={portalContainer}>
        <PopoverPrimitive.Content
          data-testid="ipa_popover_content"
          align={align}
          sideOffset={sideOffset}
          className={cn(s.popoverContent, className)}
          {...props}
          ref={composedRef}
          side={placementLocked ? lockedSide : side}
          avoidCollisions={placementLocked ? false : avoidCollisions}
          onPlaced={handlePlaced}
        />
      </PopoverPrimitive.Portal>
    )
  }
)
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor, PopoverClose }
