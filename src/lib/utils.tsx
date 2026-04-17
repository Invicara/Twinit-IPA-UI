import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Merges default styles with optional overrides. For each key, the result is
 * cn(default[key], overrides?.[key]). Use the returned object as your single
 * styles source (e.g. `const s = mergeStyles(defaultStyles, styleOverrides)`).
 * Reusable across components that accept styleOverrides.
 */
export function mergeStyles(
  styles: Record<string, string>,
  styleOverrides?: Record<string, string> | null
): Record<string, string> {
  const keys = new Set([
    ...Object.keys(styles),
    ...Object.keys(styleOverrides ?? {}),
  ])
  return Object.fromEntries(
    Array.from(keys).map((k) => [k, cn(styles[k], styleOverrides?.[k])])
  ) as Record<string, string>
}

export function capitalizeFirstLetter(val?: string|null) {
  if(!val) return "";

  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}