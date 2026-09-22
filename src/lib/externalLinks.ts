import type { WhatsAppPhone } from '@/types'

export function buildWhatsAppUrl(phone: WhatsAppPhone, message: string): string {
  const fullNumber = `55${phone.ddd}${phone.number}`
  return `https://api.whatsapp.com/send/?phone=${fullNumber}&text=${encodeURIComponent(message)}`
}

export function tibiaWikiUrl(monsterName: string): string {
  const slug = monsterName.trim().replace(/\s+/g, '_')
  return `https://www.tibiawiki.com.br/wiki/${encodeURIComponent(slug)}`
}

export function bredworldTaskUrl(monsterName: string): string {
  const slug = monsterName.trim().replace(/\s+/g, '-')
  return `https://bredworld.com.br/tools/task-delivery?monster=${encodeURIComponent(slug)}`
}
