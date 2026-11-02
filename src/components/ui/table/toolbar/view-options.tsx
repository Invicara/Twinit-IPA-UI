import type { Table } from "@tanstack/react-table"
import { Eye, EyeOff, Settings2 } from "lucide-react"
import * as React from "react"

import { cn, mergeStyles } from "../../../../lib/utils"
import { Badge } from "../../badge"
import { Button } from "../../button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../command"
import { Popover, PopoverContent, PopoverTrigger } from "../../popover"
import styles from "../table.module.css"
import { useResolvedTable, useTableQueryControlsDisabled } from "../table-context"
import { markTablePart } from "../table-part"
import { TablePopoverClose } from "../filters/popover-close"
import { TableFilterResetButton } from "../filters/reset-button"
import { tableLabelSearchScore } from "../label-search"

export interface TableViewOptionsProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table?: Table<TData>
  disabled?: boolean
  styleOverrides?: Record<string, string>
}

export function TableViewOptions<TData>({
  table: tableProp,
  disabled = false,
  className,
  styleOverrides,
  ...props
}: TableViewOptionsProps<TData>) {
  const table = useResolvedTable(tableProp)
  const s = mergeStyles(styles, styleOverrides)
  const queryControlsDisabled = useTableQueryControlsDisabled()
  const isDisabled = disabled || queryControlsDisabled
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (queryControlsDisabled) setOpen(false)
  }, [queryControlsDisabled])
  const columnVisibility = table.getState().columnVisibility
  const columns = React.useMemo(
    () =>
      table
        .getAllColumns()
        .filter(
          (column) =>
            typeof column.accessorFn !== "undefined" && column.getCanHide()
        ),
    [table, columnVisibility]
  )
  const hiddenCount = columns.filter((column) => !column.getIsVisible()).length
  const hasHiddenColumns = hiddenCount > 0

  return (
    <div className={cn(s.toolbarActionWrap, className)} {...props}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            aria-label="Toggle columns"
            role="combobox"
            variant="secondary"
            size="sm"
            className={cn(
              s.toolbarActionButton,
              hasHiddenColumns && s.toolbarActionButtonActive
            )}
            disabled={isDisabled}
          >
            <Settings2 aria-hidden className={s.toolbarActionIcon} />
            View
            {hiddenCount > 0 ? (
              <Badge variant="secondary" className={s.sortCountBadge}>
                {hiddenCount}
              </Badge>
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          collisionPadding={8}
          stickPlacement
          className={cn(
            s.viewOptionsPopover,
            s.searchPopover,
            s.popoverWithClose,
            s.commandListHover
          )}
        >
          <TablePopoverClose styleOverrides={styleOverrides} />
          <Command filter={tableLabelSearchScore}>
            <CommandInput placeholder="Search columns..." />
            <CommandList>
              <CommandEmpty>No columns found.</CommandEmpty>
              <CommandGroup>
                {columns.map((column) => {
                  const label = column.columnDef.meta?.label ?? column.id
                  const isVisible = column.getIsVisible()
                  return (
                    <CommandItem
                      key={column.id}
                      value={label}
                      onSelect={() => column.toggleVisibility(!isVisible)}
                      className={s.viewOptionsItem}
                    >
                      <span className={s.viewOptionsItemLabel}>{label}</span>
                      {isVisible ? (
                        <Eye aria-hidden className={s.viewOptionsEye} />
                      ) : (
                        <EyeOff aria-hidden className={s.viewOptionsEyeHidden} />
                      )}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
          {hasHiddenColumns ? (
            <div className={s.filterResetFooter}>
              <TableFilterResetButton
                styleOverrides={styleOverrides}
                onClick={() => {
                  table.resetColumnVisibility()
                  setOpen(false)
                }}
              />
            </div>
          ) : null}
        </PopoverContent>
      </Popover>
    </div>
  )
}

markTablePart(TableViewOptions as never, "viewOptions")
