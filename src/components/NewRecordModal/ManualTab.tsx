import { useState } from 'react'
import { CreatureCombobox } from '@/components/CreatureCombobox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BESTIARY } from '@/data/bestiary'
import { MIN_KILLS_PER_20_MIN, meetsMinimumKills, shouldReplace } from '@/lib/storage'
import type { HuntRecord } from '@/types'

interface ManualTabProps {
  existingRecords: HuntRecord[]
  initial?: HuntRecord | null
  onSave: (record: HuntRecord) => void
  onCancel: () => void
}

export function ManualTab({ existingRecords, initial, onSave, onCancel }: ManualTabProps) {
  const [creatureId, setCreatureId] = useState<string | null>(initial?.id ?? null)
  const [killsPer20Min, setKillsPer20Min] = useState(
    initial ? String(initial.killsPer20Min) : '',
  )
  const [location, setLocation] = useState(initial?.location ?? '')

  const kills = Number(killsPer20Min)
  const existingRecord = existingRecords.find((r) => r.id === creatureId)
  const belowMinimum = killsPer20Min !== '' && !meetsMinimumKills(kills)
  const willReplace = shouldReplace(kills, existingRecord)
  const isValid =
    Boolean(creatureId) &&
    kills > 0 &&
    meetsMinimumKills(kills) &&
    location.trim() !== '' &&
    willReplace

  function handleSave() {
    if (!isValid || !creatureId) return
    const creature = BESTIARY.find((c) => c.id === creatureId)
    if (!creature) return
    onSave({
      id: creature.id,
      monsterName: creature.name,
      killsPer20Min: kills,
      location: location.trim(),
      updatedAt: new Date().toISOString(),
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Creature</Label>
        <CreatureCombobox creatures={BESTIARY} value={creatureId} onChange={setCreatureId} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="manual-kills">Kills per 20min</Label>
        <Input
          id="manual-kills"
          type="number"
          min={1}
          step="1"
          value={killsPer20Min}
          onChange={(e) => setKillsPer20Min(e.target.value)}
          placeholder="e.g. 300"
        />
        {belowMinimum && (
          <p className="text-xs text-destructive">
            Minimum of {MIN_KILLS_PER_20_MIN} kills/20min — records below that are
            discarded.
          </p>
        )}
        {!belowMinimum && existingRecord && !willReplace && (
          <p className="text-xs text-destructive">
            Current record: {existingRecord.killsPer20Min} kills/20min — enter a higher value
            to replace it.
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="manual-location">Location</Label>
        <Input
          id="manual-location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Oramond, Minotaur Camp, Demon Cave..."
        />
      </div>
      <div className="mt-2 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button disabled={!isValid} onClick={handleSave}>
          {existingRecord ? 'Replace existing record' : 'Save'}
        </Button>
      </div>
    </div>
  )
}
