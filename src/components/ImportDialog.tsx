import { Upload } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import type { HuntRecord } from '@/types'

interface ImportDialogProps {
  onImport: (records: HuntRecord[]) => void
}

function isValidRecord(item: unknown): item is HuntRecord {
  if (typeof item !== 'object' || item === null) return false
  const r = item as Record<string, unknown>
  return (
    typeof r.id === 'string' &&
    typeof r.monsterName === 'string' &&
    typeof r.killsPer20Min === 'number' &&
    typeof r.location === 'string'
  )
}

export function ImportDialog({ onImport }: ImportDialogProps) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      setText('')
      setError(null)
    }
  }

  function handleImport() {
    let parsed: unknown
    try {
      parsed = JSON.parse(text)
    } catch {
      setError('JSON inválido. Verifique o formato e tente novamente.')
      return
    }
    if (!Array.isArray(parsed) || !parsed.every(isValidRecord)) {
      setError('Formato inválido. Esperado um array de registros (id, monsterName, killsPer20Min, location).')
      return
    }
    const records: HuntRecord[] = parsed.map((r) => ({
      ...r,
      updatedAt: r.updatedAt ?? new Date().toISOString(),
    }))
    onImport(records)
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload /> Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Importar registros</DialogTitle>
          <DialogDescription>
            Isso substitui todos os registros atuais pelos colados abaixo.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Cole aqui o array JSON exportado..."
          className="h-64 font-mono text-xs"
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={!text.trim()} onClick={handleImport}>
            Importar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
