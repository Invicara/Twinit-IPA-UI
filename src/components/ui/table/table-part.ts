import type * as React from "react"

export type TablePartSlot =
  | "search"
  | "filters"
  | "sortList"
  | "viewOptions"
  | "filterMenu"

export type TablePartComponent<P = unknown> = React.FC<P> & {
  tablePart?: TablePartSlot
}

export function markTablePart<P>(
  component: React.FC<P>,
  slot: TablePartSlot
): TablePartComponent<P> {
  const marked = component as TablePartComponent<P>
  marked.tablePart = slot
  return marked
}

export function getTablePartSlot(
  element: React.ReactElement
): TablePartSlot | undefined {
  const type = element.type
  if (typeof type === "function" || (typeof type === "object" && type)) {
    return (type as TablePartComponent).tablePart
  }
  return undefined
}
