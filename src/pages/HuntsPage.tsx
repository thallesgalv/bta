import { Plus, Swords } from 'lucide-react'
import { useState } from 'react'
import { ExportDialog } from '@/components/ExportDialog'
import { ImportDialog } from '@/components/ImportDialog'
import { NewRecordModal } from '@/components/NewRecordModal/NewRecordModal'
import { RecordsTable } from '@/components/RecordsTable'
import { Button } from '@/components/ui/button'
import { deleteRecord, getRecords, setRecords, upsertRecords } from '@/lib/storage'
import type { HuntRecord } from '@/types'

export function HuntsPage() {
  const [records, setRecordsState] = useState<HuntRecord[]>(() => getRecords())
  const [modalOpen, setModalOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<HuntRecord | null>(null)

  function handleSave(newRecords: HuntRecord[]) {
    setRecordsState(upsertRecords(newRecords))
  }

  function handleDelete(id: string) {
    setRecordsState(deleteRecord(id))
  }

  function handleImport(imported: HuntRecord[]) {
    setRecords(imported)
    setRecordsState(imported)
  }

  function openNewModal() {
    setEditRecord(null)
    setModalOpen(true)
  }

  function openEditModal(record: HuntRecord) {
    setEditRecord(record)
    setModalOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Swords className="size-8 text-muted-foreground" />
          <div>
            <h1 className="text-2xl font-semibold text-foreground">BTA</h1>
            <p className="text-sm text-muted-foreground">Bounty Task Analyzer</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={openNewModal}>
            <Plus /> New Record
          </Button>
          <ImportDialog onImport={handleImport} />
          <ExportDialog records={records} />
        </div>
      </header>

      <RecordsTable records={records} onEdit={openEditModal} onDelete={handleDelete} />

      <NewRecordModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        existingRecords={records}
        onSave={handleSave}
        editRecord={editRecord}
      />
    </div>
  )
}
