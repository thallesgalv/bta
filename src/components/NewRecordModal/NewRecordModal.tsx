import { HuntAnalyserTab } from '@/components/NewRecordModal/HuntAnalyserTab'
import { ManualTab } from '@/components/NewRecordModal/ManualTab'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { HuntRecord } from '@/types'

interface NewRecordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  existingRecords: HuntRecord[]
  onSave: (records: HuntRecord[]) => void
  editRecord?: HuntRecord | null
}

export function NewRecordModal({
  open,
  onOpenChange,
  existingRecords,
  onSave,
  editRecord,
}: NewRecordModalProps) {
  function handleSave(records: HuntRecord[]) {
    onSave(records)
    onOpenChange(false)
  }

  function handleCancel() {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editRecord ? 'Edit record' : 'New record'}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="hunt-analyser">
          <TabsList className="w-full">
            <TabsTrigger value="hunt-analyser">Hunt Analyser</TabsTrigger>
            <TabsTrigger value="manual">Manual</TabsTrigger>
          </TabsList>
          <TabsContent value="hunt-analyser" className="pt-3">
            <HuntAnalyserTab
              existingRecords={existingRecords}
              onlyCreatureId={editRecord?.id}
              initialLocation={editRecord?.location}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </TabsContent>
          <TabsContent value="manual" className="pt-3">
            <ManualTab
              existingRecords={existingRecords}
              initial={editRecord}
              onSave={(record) => handleSave([record])}
              onCancel={handleCancel}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
