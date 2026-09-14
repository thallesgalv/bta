import { Sparkles } from 'lucide-react'
import { useState } from 'react'
import { AddProjectionCard } from '@/components/Projection/AddProjectionCard'
import { ProjectionCard } from '@/components/Projection/ProjectionCard'
import { ProjectionModal } from '@/components/Projection/ProjectionModal'
import {
  deleteProjection,
  getProjections,
  getRecords,
  saveProjection,
} from '@/lib/storage'
import type { Projection } from '@/types'

export function ProjectionPage() {
  const [records] = useState(() => getRecords())
  const [projections, setProjections] = useState<Projection[]>(() => getProjections())
  const [modalOpen, setModalOpen] = useState(false)
  const [editProjection, setEditProjection] = useState<Projection | null>(null)

  function handleSave(projection: Projection) {
    setProjections(saveProjection(projection))
    setModalOpen(false)
  }

  function handleDelete(id: string) {
    setProjections(deleteProjection(id))
  }

  function openNewModal() {
    setEditProjection(null)
    setModalOpen(true)
  }

  function openEditModal(projection: Projection) {
    setEditProjection(projection)
    setModalOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-3">
        <Sparkles className="size-8 text-muted-foreground" />
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Projection</h1>
          <p className="text-sm text-muted-foreground">
            Estime o tempo necessário para atingir uma meta de kills
          </p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {projections.map((projection) => (
          <ProjectionCard
            key={projection.id}
            projection={projection}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        ))}
        <AddProjectionCard onClick={openNewModal} />
      </div>

      <ProjectionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        records={records}
        onSave={handleSave}
        editProjection={editProjection}
      />
    </div>
  )
}
