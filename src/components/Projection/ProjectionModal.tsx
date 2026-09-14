import { useState } from 'react'
import { CreatureCombobox } from '@/components/CreatureCombobox'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BESTIARY } from '@/data/bestiary'
import { formatDuration } from '@/lib/formatDuration'
import type { HuntRecord, Projection } from '@/types'

interface ProjectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  records: HuntRecord[]
  onSave: (projection: Projection) => void
  editProjection?: Projection | null
}

export function ProjectionModal({
  open,
  onOpenChange,
  records,
  onSave,
  editProjection,
}: ProjectionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editProjection ? 'Editar projeção' : 'Nova projeção'}</DialogTitle>
        </DialogHeader>
        <ProjectionForm
          records={records}
          onSave={onSave}
          onCancel={() => onOpenChange(false)}
          editProjection={editProjection}
        />
      </DialogContent>
    </Dialog>
  )
}

interface ProjectionFormProps {
  records: HuntRecord[]
  onSave: (projection: Projection) => void
  onCancel: () => void
  editProjection?: Projection | null
}

function ProjectionForm({ records, onSave, onCancel, editProjection }: ProjectionFormProps) {
  const [creatureId, setCreatureId] = useState<string | null>(
    editProjection?.creatureId ?? null,
  )
  const [totalKills, setTotalKills] = useState(
    editProjection ? String(editProjection.totalKills) : '',
  )

  const registeredCreatures = BESTIARY.filter((c) => records.some((r) => r.id === c.id))
  const record = records.find((r) => r.id === creatureId)
  const kills = Number(totalKills)
  const isValid = Boolean(record) && kills > 0

  const previewMinutes = record && kills > 0 ? (kills / record.killsPer20Min) * 20 : null

  function handleSave() {
    if (!record || !isValid) return
    onSave({
      id: editProjection?.id ?? crypto.randomUUID(),
      creatureId: record.id,
      monsterName: record.monsterName,
      killsPer20Min: record.killsPer20Min,
      totalKills: kills,
      createdAt: editProjection?.createdAt ?? new Date().toISOString(),
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Creature</Label>
        <CreatureCombobox
          creatures={registeredCreatures}
          value={creatureId}
          onChange={setCreatureId}
          emptyMessage="Nenhuma criatura registrada em Hunts ainda."
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="projection-total-kills">Total kills</Label>
        <Input
          id="projection-total-kills"
          type="number"
          min={1}
          step="1"
          value={totalKills}
          onChange={(e) => setTotalKills(e.target.value)}
          placeholder="e.g. 1000"
        />
      </div>
      {previewMinutes !== null && (
        <p className="text-sm text-muted-foreground">
          Projeção: <span className="text-foreground">{formatDuration(previewMinutes)}</span>
        </p>
      )}
      <div className="mt-2 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button disabled={!isValid} onClick={handleSave}>
          {editProjection ? 'Salvar' : 'Inserir'}
        </Button>
      </div>
    </div>
  )
}
