import { MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
} from '@/components/ui/popover'
import { buildWhatsAppUrl } from '@/lib/externalLinks'
import { getWhatsAppPhone, setWhatsAppPhone } from '@/lib/storage'
import type { HuntRecord, WhatsAppPhone } from '@/types'

interface SendToWhatsAppButtonProps {
  records: HuntRecord[]
}

export function SendToWhatsAppButton({ records }: SendToWhatsAppButtonProps) {
  const [open, setOpen] = useState(false)
  const [ddd, setDdd] = useState('')
  const [number, setNumber] = useState('')

  const isValid = /^\d{2}$/.test(ddd) && /^\d{8,9}$/.test(number)

  function openWhatsApp(phone: WhatsAppPhone) {
    const message = JSON.stringify(records, null, 2)
    window.open(buildWhatsAppUrl(phone, message), '_blank', 'noopener,noreferrer')
  }

  function handleClick() {
    const saved = getWhatsAppPhone()
    if (saved) {
      openWhatsApp(saved)
      return
    }
    setOpen(true)
  }

  function handleConfirm() {
    if (!isValid) return
    const phone: WhatsAppPhone = { ddd, number }
    setWhatsAppPhone(phone)
    setOpen(false)
    openWhatsApp(phone)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <Button variant="outline" disabled={records.length === 0} onClick={handleClick}>
          <MessageCircle /> Send to WhatsApp
        </Button>
      </PopoverAnchor>
      <PopoverContent className="w-64">
        <PopoverHeader>
          <PopoverTitle>WhatsApp number</PopoverTitle>
          <PopoverDescription>Enter the number that will receive the records.</PopoverDescription>
        </PopoverHeader>
        <div className="flex gap-2">
          <div className="flex w-16 flex-col gap-1.5">
            <Label htmlFor="whatsapp-ddd">Area code</Label>
            <Input
              id="whatsapp-ddd"
              type="tel"
              inputMode="numeric"
              maxLength={2}
              value={ddd}
              onChange={(e) => setDdd(e.target.value.replace(/\D/g, ''))}
              placeholder="11"
            />
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <Label htmlFor="whatsapp-number">Phone number</Label>
            <Input
              id="whatsapp-number"
              type="tel"
              inputMode="numeric"
              maxLength={9}
              value={number}
              onChange={(e) => setNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="987654321"
            />
          </div>
        </div>
        <div className="mt-1 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button disabled={!isValid} onClick={handleConfirm}>
            Save and send
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
