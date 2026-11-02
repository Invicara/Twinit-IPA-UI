const UNEDITABLE_NOTE = " [UNEDITABLE]"

/** Docs metadata for props without a usable Control (functions, ReactNode, etc.). */
export function uneditableArgType(
  typeSummary: string,
  description?: string,
  defaultValueSummary = "undefined"
) {
  return {
    control: false as const,
    ...(description && { description: `${description}${UNEDITABLE_NOTE}` }),
    table: {
      type: { summary: typeSummary },
      defaultValue: { summary: defaultValueSummary },
    },
  }
}
