import type { HuntRecord, Mode, Projection, WhatsAppPhone } from '@/types'

const STORAGE_KEY = 'bta:hunt-records'
const PROJECTIONS_KEY = 'bta:projections'
const WHATSAPP_PHONE_KEY = 'bta:whatsapp-phone'
const MODE_KEY = 'bta:mode'

export function getRecords(): HuntRecord[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function setRecords(records: HuntRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

export const MIN_KILLS_PER_20_MIN = 25

export function meetsMinimumKills(kills: number): boolean {
  return kills >= MIN_KILLS_PER_20_MIN
}

export function shouldReplace(newKills: number, existing?: HuntRecord): boolean {
  return !existing || newKills >= existing.killsPer20Min
}

export function upsertRecords(newRecords: HuntRecord[]): HuntRecord[] {
  const existing = getRecords()
  const byId = new Map(existing.map((r) => [r.id, r]))
  for (const record of newRecords) {
    if (!meetsMinimumKills(record.killsPer20Min)) continue
    if (shouldReplace(record.killsPer20Min, byId.get(record.id))) {
      byId.set(record.id, record)
    }
  }
  const merged = Array.from(byId.values())
  setRecords(merged)
  return merged
}

export function deleteRecord(id: string): HuntRecord[] {
  const remaining = getRecords().filter((r) => r.id !== id)
  setRecords(remaining)
  return remaining
}

export function getProjections(): Projection[] {
  const raw = localStorage.getItem(PROJECTIONS_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function setProjections(projections: Projection[]): void {
  localStorage.setItem(PROJECTIONS_KEY, JSON.stringify(projections))
}

export function saveProjection(projection: Projection): Projection[] {
  const existing = getProjections()
  const index = existing.findIndex((p) => p.id === projection.id)
  const updated = [...existing]
  if (index >= 0) {
    updated[index] = projection
  } else {
    updated.push(projection)
  }
  setProjections(updated)
  return updated
}

export function deleteProjection(id: string): Projection[] {
  const remaining = getProjections().filter((p) => p.id !== id)
  setProjections(remaining)
  return remaining
}

export function getWhatsAppPhone(): WhatsAppPhone | null {
  const raw = localStorage.getItem(WHATSAPP_PHONE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed.ddd === 'string' && typeof parsed.number === 'string'
      ? parsed
      : null
  } catch {
    return null
  }
}

export function setWhatsAppPhone(phone: WhatsAppPhone): void {
  localStorage.setItem(WHATSAPP_PHONE_KEY, JSON.stringify(phone))
}

export function getMode(): Mode {
  const raw = localStorage.getItem(MODE_KEY)
  return raw === 'Expert' || raw === 'Master' ? raw : 'Master'
}

export function setMode(mode: Mode): void {
  localStorage.setItem(MODE_KEY, mode)
}
