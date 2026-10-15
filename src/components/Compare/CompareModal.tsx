import { useState } from 'react'
import { StarRating } from '@/components/Compare/StarRating'
import { CreatureCombobox } from '@/components/CreatureCombobox'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { BESTIARY } from '@/data/bestiary'
import { TASK_POINTS } from '@/lib/comparison'
import type { ComparisonEntry, Stars } from '@/types'

const STAR_OPTIONS: Stars[] = [0, 1, 2]

interface CompareModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (entry: ComparisonEntry) => void
  editEntry?: ComparisonEntry | null
}

export function CompareModal({ open, onOpenChange, onSave, editEntry }: CompareModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editEntry ? 'Edit comparison' : 'Add to comparison'}</DialogTitle>
        </DialogHeader>
        <CompareForm onSave={onSave} onCancel={() => onOpenChange(false)} editEntry={editEntry} />
      </DialogContent>
    </Dialog>
  )
}

interface CompareFormProps {
  onSave: (entry: ComparisonEntry) => void
  onCancel: () => void
  editEntry?: ComparisonEntry | null
}

function CompareForm({ onSave, onCancel, editEntry }: CompareFormProps) {
  const [stars, setStars] = useState<Stars>(editEntry?.stars ?? 0)
  const [creatureId, setCreatureId] = useState<string | null>(editEntry?.creatureId ?? null)
  const [totalKills, setTotalKills] = useState(editEntry ? String(editEntry.totalKills) : '')

  const kills = Number(totalKills)
  const isValid = Boolean(creatureId) && kills > 0

  function handleSave() {
    if (!creatureId || !isValid) return
    onSave({ creatureId, stars, totalKills: kills })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Stars</Label>
        <RadioGroup
          value={String(stars)}
          onValueChange={(value) => setStars(Number(value) as Stars)}
          className="flex gap-4"
        >
          {STAR_OPTIONS.map((option) => (
            <Label
              key={option}
              htmlFor={`compare-stars-${option}`}
              className="flex cursor-pointer items-center gap-2 font-normal"
            >
              <RadioGroupItem
                id={`compare-stars-${option}`}
                value={String(option)}
                className="data-[state=checked]:border-primary data-[state=checked]:bg-primary"
              />
              <span className="flex flex-col">
                <span>{option}</span>
                <span className="text-xs text-muted-foreground">{TASK_POINTS[option]} pts</span>
              </span>
              {option > 0 && <StarRating stars={option} />}
            </Label>
          ))}
        </RadioGroup>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label>Name</Label>
        <CreatureCombobox creatures={BESTIARY} value={creatureId} onChange={setCreatureId} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="compare-total-kills">Kills</Label>
        <Input
          id="compare-total-kills"
          type="text"
          inputMode="numeric"
          value={totalKills}
          onChange={(e) => setTotalKills(e.target.value.replace(/\D/g, ''))}
          placeholder="e.g. 1000"
        />
      </div>
      <div className="mt-2 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button disabled={!isValid} onClick={handleSave}>
          {editEntry ? 'Save' : 'Add'}
        </Button>
      </div>
    </div>
  )
}
