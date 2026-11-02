/**
 * Score for command-menu search. Each whitespace-separated query part must
 * occur, in order, somewhere in the label. Case is ignored and word order
 * does not matter, so `ame`, `am`, and `nam` all match `Name`.
 *
 * Characters such as `&` and `@` are part of the text. They are not stripped,
 * so `@` matches `user@host` and does not match `Email`. A stretched query
 * such as `eemmaail` does not match `email`, because the letters are not a
 * contiguous piece of the label.
 *
 * Returns `1` for a match and `0` otherwise, which is the score `cmdk` expects.
 */
export function tableLabelSearchScore(label: string, search: string): number {
  const query = search.trim().toLowerCase()
  if (query.length === 0) return 1
  const labelText = label.toLowerCase()
  const matches = query.split(/\s+/).every((part) => labelText.includes(part))
  return matches ? 1 : 0
}
