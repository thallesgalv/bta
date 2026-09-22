import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { parseHuntAnalyser } from '@/lib/parseHuntAnalyser'
import { buildSaveLabel } from '@/lib/saveLabel'
import { MIN_KILLS_PER_20_MIN, meetsMinimumKills, shouldReplace } from '@/lib/storage'
import type { HuntRecord } from '@/types'

interface HuntAnalyserTabProps {
  existingRecords: HuntRecord[]
  onSave: (records: HuntRecord[]) => void
  onCancel: () => void
}

export function HuntAnalyserTab({ existingRecords, onSave, onCancel }: HuntAnalyserTabProps) {
  const [text, setText] = useState('')
  const [considerProportion, setConsiderProportion] = useState(true)
  const [location, setLocation] = useState('')

  const parsed = useMemo(
    () => parseHuntAnalyser(text, considerProportion),
    [text, considerProportion],
  )

  const preview = parsed.matched.map((m) => {
    const existingRecord = existingRecords.find((r) => r.id === m.creature.id)
    return {
      ...m,
      existingRecord,
      belowMinimum: !meetsMinimumKills(m.killsPer20Min),
      willReplace: shouldReplace(m.killsPer20Min, existingRecord),
    }
  })
  const eligible = preview.filter((p) => !p.belowMinimum)
  const newCount = eligible.filter((p) => !p.existingRecord).length
  const replaceCount = eligible.filter((p) => p.existingRecord && p.willReplace).length
  const skippedCount = eligible.filter((p) => p.existingRecord && !p.willReplace).length
  const belowMinCount = preview.filter((p) => p.belowMinimum).length

  const isValid = eligible.length > 0 && location.trim() !== ''

  function handleSave() {
    if (!isValid) return
    const trimmedLocation = location.trim()
    const records: HuntRecord[] = eligible.map((m) => ({
      id: m.creature.id,
      monsterName: m.creature.name,
      killsPer20Min: m.killsPer20Min,
      location: trimmedLocation,
      updatedAt: new Date().toISOString(),
    }))
    onSave(records)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="hunt-log">Hunt Log</Label>
        <Textarea
          id="hunt-log"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your Hunt Analyser session data here..."
          className="h-40 font-mono text-xs"
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox
          checked={considerProportion}
          onCheckedChange={(checked) => setConsiderProportion(checked === true)}
        />
        Consider 20-min proportionality
      </label>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="hunt-location">Location</Label>
        <Input
          id="hunt-location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Oramond, Minotaur Camp, Demon Cave..."
        />
      </div>

      {preview.length > 0 && (
        <div className="flex flex-col gap-1 rounded-md border border-border p-2.5 text-sm">
          {preview.map((p) => (
            <div key={p.creature.id} className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <img
                  src={p.creature.imageUrl}
                  alt=""
                  className="size-5 rounded-full object-cover"
                />
                {p.creature.name}
              </span>
              <span className={p.belowMinimum ? 'text-destructive' : 'text-muted-foreground'}>
                {p.killsPer20Min} kills/20min —{' '}
                {p.belowMinimum
                  ? `below minimum (${MIN_KILLS_PER_20_MIN}), discarded`
                  : !p.existingRecord
                    ? 'new'
                    : p.willReplace
                      ? 'will replace existing'
                      : `kept (current: ${p.existingRecord.killsPer20Min}/20min)`}
              </span>
            </div>
          ))}
        </div>
      )}

      {belowMinCount > 0 && (
        <p className="text-xs text-destructive">
          {belowMinCount} creature{belowMinCount > 1 ? 's' : ''} below the minimum of{' '}
          {MIN_KILLS_PER_20_MIN} kills/20min — discarded.
        </p>
      )}

      {parsed.ignored.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {parsed.ignored.length} creature{parsed.ignored.length > 1 ? 's' : ''} ignored
          (outside the Medium/Hard/Challenging bestiary): {parsed.ignored.join(', ')}
        </p>
      )}

      <div className="mt-2 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button disabled={!isValid} onClick={handleSave}>
          {buildSaveLabel(newCount, replaceCount, skippedCount, belowMinCount)}
        </Button>
      </div>
    </div>
  )
}
