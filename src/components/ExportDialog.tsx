import { Download } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import type { HuntRecord } from '@/types'

interface ExportDialogProps {
  records: HuntRecord[]
}

export function ExportDialog({ records }: ExportDialogProps) {
  const [copied, setCopied] = useState(false)
  const disabled = records.length === 0
  const json = JSON.stringify(records, null, 2)

  async function handleCopy() {
    await navigator.clipboard.writeText(json)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  function handleDownload() {
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    const timestamp = `${pad(now.getHours())}:${pad(now.getMinutes())}-${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}`
    const a = document.createElement('a')
    a.href = url
    a.download = `bta-records-(${timestamp}).json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          <Download /> Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Export records</DialogTitle>
        </DialogHeader>
        <Textarea readOnly value={json} className="h-64 font-mono text-xs" />
        <DialogFooter>
          <Button variant="outline" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button onClick={handleDownload}>Download .json</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
