import { useState } from 'react'
import { CreatureCombobox } from '@/components/NewRecordModal/CreatureCombobox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BESTIARY } from '@/data/bestiary'
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
  const isValid = Boolean(creatureId) && kills > 0 && location.trim() !== ''
  const isExisting = existingRecords.some((r) => r.id === creatureId)

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
        <Label>Monstro</Label>
        <CreatureCombobox value={creatureId} onChange={setCreatureId} />
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
          {isExisting ? 'Substituir registro existente' : 'Salvar'}
        </Button>
      </div>
    </div>
  )
}
