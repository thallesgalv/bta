import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { parseHuntAnalyser } from '@/lib/parseHuntAnalyser'
import { buildSaveLabel } from '@/lib/saveLabel'
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

  const preview = parsed.matched.map((m) => ({
    ...m,
    isExisting: existingRecords.some((r) => r.id === m.creature.id),
  }))
  const newCount = preview.filter((p) => !p.isExisting).length
  const replaceCount = preview.filter((p) => p.isExisting).length

  const isValid = parsed.matched.length > 0 && location.trim() !== ''

  function handleSave() {
    if (!isValid) return
    const trimmedLocation = location.trim()
    const records: HuntRecord[] = parsed.matched.map((m) => ({
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
              <span className="text-muted-foreground">
                {p.killsPer20Min} kills/20min — {p.isExisting ? 'substituirá existente' : 'novo'}
              </span>
            </div>
          ))}
        </div>
      )}

      {parsed.ignored.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {parsed.ignored.length} criatura{parsed.ignored.length > 1 ? 's' : ''} ignorada
          {parsed.ignored.length > 1 ? 's' : ''} (fora do bestiary Medium/Hard):{' '}
          {parsed.ignored.join(', ')}
        </p>
      )}

      <div className="mt-2 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button disabled={!isValid} onClick={handleSave}>
          {buildSaveLabel(newCount, replaceCount)}
        </Button>
      </div>
    </div>
  )
}
