import type { HuntRecord, Projection } from '@/types'

const STORAGE_KEY = 'bta:hunt-records'
const PROJECTIONS_KEY = 'bta:projections'

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
