import type { HuntRecord } from '@/types'

const STORAGE_KEY = 'bta:hunt-records'

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

export function upsertRecords(newRecords: HuntRecord[]): HuntRecord[] {
  const existing = getRecords()
  const byId = new Map(existing.map((r) => [r.id, r]))
  for (const record of newRecords) {
    byId.set(record.id, record)
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
