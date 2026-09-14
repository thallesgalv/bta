export function buildSaveLabel(newCount: number, replaceCount: number): string {
  if (newCount === 0 && replaceCount === 0) return 'Salvar'
  if (replaceCount === 0) {
    return `Salvar (${newCount} novo${newCount > 1 ? 's' : ''})`
  }
  if (newCount === 0) {
    return `Substituir ${replaceCount} registro${replaceCount > 1 ? 's' : ''} existente${replaceCount > 1 ? 's' : ''}`
  }
  return `Salvar (${newCount} novo${newCount > 1 ? 's' : ''}, ${replaceCount} substitui${replaceCount > 1 ? 'ções' : 'ção'})`
}
