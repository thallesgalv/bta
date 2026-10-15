import { RotateCcw, Scale } from 'lucide-react'
import { useState } from 'react'
import { CompareCard } from '@/components/Compare/CompareCard'
import { CompareModal } from '@/components/Compare/CompareModal'
import { EmptyCompareSlot } from '@/components/Compare/EmptyCompareSlot'
import { Button } from '@/components/ui/button'
import { BESTIARY } from '@/data/bestiary'
import { pointsPerMinute, projectionMinutes } from '@/lib/comparison'
import {
  COMPARISON_SLOTS,
  getComparison,
  getRecords,
  setComparison,
  type ComparisonSlots,
} from '@/lib/storage'
import type { ComparisonEntry } from '@/types'

const BESTIARY_BY_ID = new Map(BESTIARY.map((c) => [c.id, c]))

export function ComparePage() {
  const [records] = useState(() => getRecords())
  const [slots, setSlots] = useState<ComparisonSlots>(() => getComparison())
  const [activeSlot, setActiveSlot] = useState<number | null>(null)

  const recordsById = new Map(records.map((r) => [r.id, r]))
  const metrics = slots.map((entry) => {
    const record = entry ? recordsById.get(entry.creatureId) : undefined
    if (!entry || !record) return { minutes: null, ppm: null }
    const minutes = projectionMinutes(entry.totalKills, record.killsPer20Min)
    return { minutes, ppm: pointsPerMinute(entry.stars, minutes) }
  })
  const ppms = metrics.flatMap((m) => (m.ppm !== null ? [m.ppm] : []))
  const bestPpm = ppms.length > 0 ? Math.max(...ppms) : null

  function updateSlot(index: number, entry: ComparisonEntry | null) {
    const updated = slots.map((s, i) => (i === index ? entry : s))
    setComparison(updated)
    setSlots(updated)
  }

  function handleResetAll() {
    const empty: ComparisonSlots = Array(COMPARISON_SLOTS).fill(null)
    setComparison(empty)
    setSlots(empty)
  }

  function handleSave(entry: ComparisonEntry) {
    if (activeSlot === null) return
    updateSlot(activeSlot, entry)
    setActiveSlot(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-3">
        <Scale className="size-8 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Compare</h1>
          <p className="text-sm text-muted-foreground">
            Compare up to 3 tasks by points per minute
          </p>
        </div>
        <Button
          variant="outline"
          className="ml-auto"
          disabled={slots.every((s) => s === null)}
          onClick={handleResetAll}
        >
          <RotateCcw /> Reset all
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {slots.map((entry, index) => {
          const creature = entry ? BESTIARY_BY_ID.get(entry.creatureId) : undefined
          if (!entry || !creature) {
            return <EmptyCompareSlot key={index} onClick={() => setActiveSlot(index)} />
          }
          return (
            <CompareCard
              key={index}
              entry={entry}
              creature={creature}
              minutes={metrics[index].minutes}
              ppm={metrics[index].ppm}
              bestPpm={bestPpm}
              onEdit={() => setActiveSlot(index)}
              onRemove={() => updateSlot(index, null)}
            />
          )
        })}
      </div>

      <CompareModal
        key={activeSlot ?? 'closed'}
        open={activeSlot !== null}
        onOpenChange={(open) => !open && setActiveSlot(null)}
        onSave={handleSave}
        editEntry={activeSlot !== null ? slots[activeSlot] : null}
      />
    </div>
  )
}
