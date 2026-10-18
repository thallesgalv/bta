import { Plus, Search, Swords } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ExportDialog } from '@/components/ExportDialog'
import { ImportDialog } from '@/components/ImportDialog'
import { NewRecordModal } from '@/components/NewRecordModal/NewRecordModal'
import { RecordsTable } from '@/components/RecordsTable'
import { SendToWhatsAppButton } from '@/components/SendToWhatsAppButton'
import { TierlistDialog } from '@/components/TierlistDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BESTIARY } from '@/data/bestiary'
import { deleteRecord, getMode, getRecords, meetsMinimumKills, setMode, setRecords, upsertRecords } from '@/lib/storage'
import type { HuntRecord, Mode } from '@/types'

const BESTIARY_BY_ID = new Map(BESTIARY.map((c) => [c.id, c]))

export function HuntsPage() {
  const [records, setRecordsState] = useState<HuntRecord[]>(() => getRecords())
  const [modalOpen, setModalOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<HuntRecord | null>(null)
  const [search, setSearch] = useState('')
  const [projectionKills, setProjectionKills] = useState('450')
  const [mode, setModeState] = useState<Mode>(() => getMode())

  const modeRecords = useMemo(() => {
    const allowedDifficulties = mode === 'Master' ? ['Hard', 'Challenging'] : ['Hard', 'Medium']
    return records.filter((r) => {
      const difficulty = BESTIARY_BY_ID.get(r.id)?.difficulty
      return Boolean(difficulty && allowedDifficulties.includes(difficulty))
    })
  }, [records, mode])

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return modeRecords
    return modeRecords.filter((r) => r.monsterName.toLowerCase().includes(query))
  }, [modeRecords, search])

  function handleModeChange(next: Mode) {
    setModeState(next)
    setMode(next)
  }

  function handleSave(newRecords: HuntRecord[]) {
    setRecordsState(upsertRecords(newRecords))
  }

  function handleDelete(id: string) {
    setRecordsState(deleteRecord(id))
  }

  function handleImport(imported: HuntRecord[]) {
    const valid = imported.filter((r) => meetsMinimumKills(r.killsPer20Min))
    setRecords(valid)
    setRecordsState(valid)
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
    <div className="flex h-full flex-col gap-6">
      <header className="flex shrink-0 items-center justify-between gap-4">
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
          <SendToWhatsAppButton records={records} />
          <Tabs value={mode} onValueChange={(v) => handleModeChange(v as Mode)}>
            <TabsList>
              <TabsTrigger value="Expert">Expert</TabsTrigger>
              <TabsTrigger value="Master">Master</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </header>

      <div className="flex shrink-0 items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Find creature..."
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Kills</span>
          <Input
            type="text"
            inputMode="numeric"
            value={projectionKills}
            onChange={(e) => setProjectionKills(e.target.value.replace(/\D/g, ''))}
            className="w-24"
          />
        </div>
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {records.length} registered creature{records.length !== 1 ? 's' : ''}
        </span>
        <div className="ml-auto">
          <TierlistDialog records={modeRecords} />
        </div>
      </div>

      <RecordsTable
        records={filteredRecords}
        projectionKills={Number(projectionKills) || 0}
        emptyMessage={
          records.length === 0 ? 'No records yet.' : 'No creature found.'
        }
        mode={mode}
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
