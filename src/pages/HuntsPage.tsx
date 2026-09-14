import { Plus, Search, Swords } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ExportDialog } from '@/components/ExportDialog'
import { ImportDialog } from '@/components/ImportDialog'
import { NewRecordModal } from '@/components/NewRecordModal/NewRecordModal'
import { RecordsTable } from '@/components/RecordsTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { computeRanks } from '@/lib/ranking'
import { deleteRecord, getRecords, setRecords, upsertRecords } from '@/lib/storage'
import type { HuntRecord } from '@/types'

export function HuntsPage() {
  const [records, setRecordsState] = useState<HuntRecord[]>(() => getRecords())
  const [modalOpen, setModalOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<HuntRecord | null>(null)
  const [search, setSearch] = useState('')

  const ranks = useMemo(() => computeRanks(records), [records])
  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return records
    return records.filter((r) => r.monsterName.toLowerCase().includes(query))
  }, [records, search])

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

      <div className="flex items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar monstro..."
            className="pl-8"
          />
        </div>
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {records.length} monstro{records.length !== 1 ? 's' : ''} registrado
          {records.length !== 1 ? 's' : ''}
        </span>
      </div>

      <RecordsTable
        records={filteredRecords}
        ranks={ranks}
        emptyMessage={
          records.length === 0
            ? 'Nenhum registro cadastrado ainda.'
            : 'Nenhum monstro encontrado.'
        }
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

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
