const TABLE = {
  type: { summary: "Record<string, string>" },
  defaultValue: { summary: "{}" },
}

/**
 * Storybook Controls config for `styleOverrides` props (object editor + docs table).
 */
export function styleOverridesArgType() {
  return {
    control: { type: "object" as const },
    description: "Extra classes for custom styling, merged with defaults.",
    table: TABLE,
  }
}
