export function buildSaveLabel(newCount: number, replaceCount: number, skippedCount: number): string {
  const parts: string[] = []
  if (newCount > 0) parts.push(`${newCount} novo${newCount > 1 ? 's' : ''}`)
  if (replaceCount > 0) parts.push(`${replaceCount} substitui${replaceCount > 1 ? 'ções' : 'ção'}`)
  if (skippedCount > 0) parts.push(`${skippedCount} mantido${skippedCount > 1 ? 's' : ''}`)
  return parts.length > 0 ? `Salvar (${parts.join(', ')})` : 'Salvar'
}
