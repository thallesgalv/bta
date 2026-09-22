export function buildSaveLabel(
  newCount: number,
  replaceCount: number,
  skippedCount: number,
  belowMinimumCount = 0,
): string {
  const parts: string[] = []
  if (newCount > 0) parts.push(`${newCount} new`)
  if (replaceCount > 0) parts.push(`${replaceCount} replacement${replaceCount > 1 ? 's' : ''}`)
  if (skippedCount > 0) parts.push(`${skippedCount} kept`)
  if (belowMinimumCount > 0) parts.push(`${belowMinimumCount} discarded`)
  return parts.length > 0 ? `Save (${parts.join(', ')})` : 'Save'
}
