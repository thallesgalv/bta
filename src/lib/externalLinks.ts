export function tibiaWikiUrl(monsterName: string): string {
  const slug = monsterName.trim().replace(/\s+/g, '_')
  return `https://www.tibiawiki.com.br/wiki/${encodeURIComponent(slug)}`
}

export function bredworldTaskUrl(monsterName: string): string {
  const slug = monsterName.trim().replace(/\s+/g, '-')
  return `https://bredworld.com.br/tools/task-delivery?monster=${encodeURIComponent(slug)}`
}
