import type { TableFeatureSlice, WithResizingOptions } from "./types"

/** Column resizing defaults, enable flag, and Grid resize-handle chrome. */
export function withResizing<TData>(
  options: WithResizingOptions = {}
): TableFeatureSlice<TData> {
  const { columnResizeMode = "onChange" } = options

  return {
    options: {
      enableColumnResizing: true,
      columnResizeMode,
      defaultColumn: {
        minSize: 80,
        maxSize: 800,
        size: 180,
        enableResizing: true,
      },
    },
    meta: {
      columnResize: true,
    },
  }
}
