import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { BestiaryCreature } from '@/types'

interface CreatureComboboxProps {
  creatures: BestiaryCreature[]
  value: string | null
  onChange: (id: string) => void
  placeholder?: string
  emptyMessage?: string
}

export function CreatureCombobox({
  creatures,
  value,
  onChange,
  placeholder = 'Selecione uma criatura...',
  emptyMessage = 'Nenhuma criatura encontrada.',
}: CreatureComboboxProps) {
  const [open, setOpen] = useState(false)
  const selected = creatures.find((c) => c.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {selected ? (
            <span className="flex items-center gap-2">
              <img src={selected.imageUrl} alt="" className="size-5 rounded-full object-cover" />
              {selected.name}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Buscar criatura..." />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {creatures.map((creature) => (
                <CommandItem
                  key={creature.id}
                  value={creature.name}
                  onSelect={() => {
                    onChange(creature.id)
                    setOpen(false)
                  }}
                >
                  <img
                    src={creature.imageUrl}
                    alt=""
                    className="size-5 rounded-full object-cover"
                  />
                  {creature.name}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {creature.difficulty}
                  </span>
                  <Check
                    className={cn(
                      'ml-1',
                      value === creature.id ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
