import type { ColumnSort, Table } from "@tanstack/react-table"
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  ArrowDownUp,
  Check,
  ChevronsUpDown,
  GripVertical,
  Trash2,
} from "lucide-react"
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
import { SingleSelect } from "../../dropdown"
import { Popover, PopoverContent, PopoverTrigger } from "../../popover"
import { tableSortOrders } from "../query/config"
import { useResolvedTable, useTableQueryControlsDisabled } from "../table-context"
import { markTablePart } from "../table-part"
import styles from "../table.module.css"
import { TablePopoverClose } from "../filters/popover-close"
import { TableFilterResetButton } from "../filters/reset-button"
import { tableLabelSearchScore } from "../label-search"

const REMOVE_SORT_SHORTCUTS = ["backspace", "delete"]

function getSortableColumnOptions<TData>(table: Table<TData>) {
  const labels = new Map<string, string>()
  const options: Array<{ id: string; label: string }> = []

  for (const column of table.getAllColumns()) {
    if (!column.getCanSort()) continue
    const label = column.columnDef.meta?.label ?? column.id
    labels.set(column.id, label)
    options.push({ id: column.id, label })
  }

  return { labels, options }
}

function getAvailableColumnsForSort(
  sorting: ColumnSort[],
  sortId: string,
  options: Array<{ id: string; label: string }>
) {
  const usedIds = new Set(
    sorting.filter((item) => item.id !== sortId).map((item) => item.id)
  )
  return options.filter((option) => !usedIds.has(option.id))
}

export interface TableSortListProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table?: Table<TData>
  disabled?: boolean
  styleOverrides?: Record<string, string>
}

export function TableSortList<TData>({
  table: tableProp,
  disabled = false,
  className,
  styleOverrides,
  ...props
}: TableSortListProps<TData>) {
  const table = useResolvedTable(tableProp)
  const s = mergeStyles(styles, styleOverrides)
  const queryControlsDisabled = useTableQueryControlsDisabled()
  const isDisabled = disabled || queryControlsDisabled
  const labelId = React.useId()
  const descriptionId = React.useId()
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (queryControlsDisabled) setOpen(false)
  }, [queryControlsDisabled])

  const sorting = table.getState().sorting
  const visibleSorting = queryControlsDisabled ? [] : sorting
  const { labels, options } = React.useMemo(
    () => getSortableColumnOptions(table),
    [table, sorting]
  )

  const availableToAdd = React.useMemo(
    () =>
      options.filter(
        (option) => !sorting.some((sortItem) => sortItem.id === option.id)
      ),
    [options, sorting]
  )

  const sortableIds = React.useMemo(
    () => sorting.map((sort) => sort.id),
    [sorting]
  )

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const onSortAdd = React.useCallback(() => {
    const firstColumn = availableToAdd[0]
    if (!firstColumn) return

    table.setSorting((prevSorting) => [
      ...prevSorting,
      { id: firstColumn.id, desc: false },
    ])
  }, [availableToAdd, table])

  const onSortUpdate = React.useCallback(
    (sortId: string, updates: Partial<ColumnSort>) => {
      table.setSorting((prevSorting) =>
        prevSorting.map((sort) =>
          sort.id === sortId ? { ...sort, ...updates } : sort
        )
      )
    },
    [table]
  )

  const onSortRemove = React.useCallback(
    (sortId: string) => {
      table.setSorting((prevSorting) =>
        prevSorting.filter((item) => item.id !== sortId)
      )
    },
    [table]
  )

  const onSortingReset = React.useCallback(() => {
    table.setSorting(table.initialState.sorting ?? [])
    setOpen(false)
  }, [table])

  const onDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      table.setSorting((prevSorting) => {
        const oldIndex = prevSorting.findIndex((item) => item.id === active.id)
        const newIndex = prevSorting.findIndex((item) => item.id === over.id)
        if (oldIndex < 0 || newIndex < 0) return prevSorting
        return arrayMove(prevSorting, oldIndex, newIndex)
      })
    },
    [table]
  )

  const onTriggerKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (
        REMOVE_SORT_SHORTCUTS.includes(event.key.toLowerCase()) &&
        sorting.length > 0
      ) {
        event.preventDefault()
        onSortingReset()
      }
    },
    [onSortingReset, sorting.length]
  )

  const onOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen)

      if (nextOpen && sorting.length === 0) {
        const firstColumn = options[0]
        if (firstColumn) {
          table.setSorting([{ id: firstColumn.id, desc: false }])
        }
      }
    },
    [options, sorting.length, table]
  )

  return (
    <div className={cn(s.toolbarActionWrap, className)} {...props}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        autoScroll={false}
        onDragEnd={onDragEnd}
      >
        <Popover open={open} onOpenChange={onOpenChange}>
          <PopoverTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              className={cn(
                s.toolbarActionButton,
                visibleSorting.length > 0 && s.toolbarActionButtonActive
              )}
              onKeyDown={onTriggerKeyDown}
              disabled={isDisabled}
              aria-label="Sort"
            >
              <ArrowDownUp aria-hidden className={s.toolbarActionIcon} />
              Sort
              {visibleSorting.length > 0 ? (
                <Badge variant="secondary" className={s.sortCountBadge}>
                  {visibleSorting.length}
                </Badge>
              ) : null}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            aria-labelledby={labelId}
            aria-describedby={descriptionId}
            className={s.sortListPopover}
          >
            <TablePopoverClose styleOverrides={styleOverrides} />
            <div className={s.sortListHeader}>
              <h4 id={labelId} className={s.sortListTitle}>
                {visibleSorting.length > 0 ? "Sort by" : "No sorting applied"}
              </h4>
              <p
                id={descriptionId}
                className={cn(
                  s.sortListDescription,
                  visibleSorting.length > 0 && s.sortListDescriptionSrOnly
                )}
              >
                {visibleSorting.length > 0
                  ? "Modify sorting to organize your rows."
                  : "Add sorting to organize your rows."}
              </p>
            </div>

            {visibleSorting.length > 0 ? (
              <SortableContext
                items={sortableIds}
                strategy={verticalListSortingStrategy}
              >
                <div className={s.sortListItems} role="list">
                  {visibleSorting.map((sort) => (
                    <TableSortListItem
                      key={sort.id}
                      sort={sort}
                      columnLabel={labels.get(sort.id) ?? sort.id}
                      fieldOptions={getAvailableColumnsForSort(
                        sorting,
                        sort.id,
                        options
                      )}
                      onSortUpdate={onSortUpdate}
                      onSortRemove={onSortRemove}
                      styleOverrides={styleOverrides}
                    />
                  ))}
                </div>
              </SortableContext>
            ) : null}

            <div className={s.sortListActions}>
              <Button
                variant="default"
                size="sm"
                className={s.sortAddButton}
                onClick={onSortAdd}
                disabled={availableToAdd.length === 0}
              >
                Add sort
              </Button>
              {visibleSorting.length > 0 ? (
                <TableFilterResetButton
                  className={s.sortResetButton}
                  styleOverrides={styleOverrides}
                  onClick={onSortingReset}
                />
              ) : null}
            </div>
          </PopoverContent>
        </Popover>
      </DndContext>
    </div>
  )
}

interface TableSortListItemProps {
  sort: ColumnSort
  columnLabel: string
  fieldOptions: Array<{ id: string; label: string }>
  onSortUpdate: (sortId: string, updates: Partial<ColumnSort>) => void
  onSortRemove: (sortId: string) => void
  styleOverrides?: Record<string, string>
}

function TableSortListItem({
  sort,
  columnLabel,
  fieldOptions,
  onSortUpdate,
  onSortRemove,
  styleOverrides,
}: TableSortListItemProps) {
  const s = mergeStyles(styles, styleOverrides)
  const fieldTriggerRef = React.useRef<HTMLButtonElement>(null)
  const [fieldOpen, setFieldOpen] = React.useState(false)
  const [fieldSide, setFieldSide] = React.useState<"top" | "bottom">("bottom")
  const selectableFieldOptions = React.useMemo(() => {
    const current = fieldOptions.find((option) => option.id === sort.id)
    if (current) return fieldOptions
    return [{ id: sort.id, label: columnLabel }, ...fieldOptions]
  }, [columnLabel, fieldOptions, sort.id])

  const onFieldOpenChange = React.useCallback(
    (next: boolean) => {
      if (next && fieldTriggerRef.current) {
        const rect = fieldTriggerRef.current.getBoundingClientRect()
        const spaceAbove = rect.top
        const spaceBelow = window.innerHeight - rect.bottom
        const estimatedHeight = Math.min(
          48 + selectableFieldOptions.length * 36,
          336
        )
        setFieldSide(
          spaceBelow >= estimatedHeight || spaceBelow >= spaceAbove
            ? "bottom"
            : "top"
        )
      }
      setFieldOpen(next)
    },
    [selectableFieldOptions.length]
  )
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sort.id })

  const onItemKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      if (fieldOpen) return

      if (REMOVE_SORT_SHORTCUTS.includes(event.key.toLowerCase())) {
        event.preventDefault()
        onSortRemove(sort.id)
      }
    },
    [fieldOpen, onSortRemove, sort.id]
  )

  return (
    <div
      ref={setNodeRef}
      className={cn(s.sortListItem, isDragging && s.sortListItemDragging)}
      role="listitem"
      tabIndex={-1}
      style={{
        transform: CSS.Translate.toString(transform),
        transition: isDragging ? undefined : transition,
        zIndex: isDragging ? 2 : undefined,
      }}
      onKeyDown={onItemKeyDown}
    >
      <Popover open={fieldOpen} onOpenChange={onFieldOpenChange}>
        <PopoverTrigger asChild>
          <Button
            ref={fieldTriggerRef}
            variant="secondary"
            size="sm"
            className={s.sortFieldTrigger}
            aria-label={`Sort field ${columnLabel}`}
            data-state={fieldOpen ? "open" : "closed"}
          >
            <span className={s.sortFieldTriggerLabel}>{columnLabel}</span>
            <ChevronsUpDown aria-hidden className={s.sortFieldTriggerIcon} />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side={fieldSide}
          avoidCollisions={false}
          collisionPadding={8}
          className={cn(s.sortFieldPopover, s.searchPopover, s.commandListHover)}
        >
          <Command filter={tableLabelSearchScore}>
            <CommandInput placeholder="Search fields..." />
            <CommandList>
              <CommandEmpty>No fields found.</CommandEmpty>
              <CommandGroup>
                {selectableFieldOptions.map((option) => (
                  <CommandItem
                    key={option.id}
                    value={option.label}
                    className={s.sortFieldItem}
                    onSelect={() => {
                      onSortUpdate(sort.id, { id: option.id })
                      setFieldOpen(false)
                    }}
                  >
                    {option.label}
                    {option.id === sort.id ? (
                      <Check aria-hidden className={s.menuItemCheck} />
                    ) : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className={s.sortDirectionSelect}>
        <SingleSelect
          options={tableSortOrders.map((order) => ({
            value: order.value,
            label: order.label,
          }))}
          value={sort.desc ? "desc" : "asc"}
          onChange={(value) =>
            onSortUpdate(sort.id, { desc: value === "desc" })
          }
          hideFooter
          disableIconAnimation
          styleOverrides={{
            itemBase: s.sortDirectionItemBase,
            itemHover: s.sortDirectionItemHover,
            itemFocused: s.sortDirectionItemFocused,
          }}
        />
      </div>

      <Button
        variant="secondary"
        size="sm"
        className={cn(s.sortIconButton, s.sortRemoveButton)}
        aria-label={`Remove ${columnLabel} sort`}
        onClick={() => onSortRemove(sort.id)}
      >
        <Trash2 aria-hidden />
      </Button>

      <Button
        variant="secondary"
        size="sm"
        className={cn(s.sortIconButton, s.sortDragHandle)}
        aria-label={`Reorder ${columnLabel} sort`}
        {...attributes}
        {...listeners}
      >
        <GripVertical aria-hidden />
      </Button>
    </div>
  )
}

markTablePart(TableSortList as never, "sortList")

