import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { BESTIARY } from '@/data/bestiary'
import { formatDuration } from '@/lib/formatDuration'
import type { Projection } from '@/types'

const BESTIARY_BY_ID = new Map(BESTIARY.map((c) => [c.id, c]))

interface ProjectionCardProps {
  projection: Projection
  onEdit: (projection: Projection) => void
  onDelete: (id: string) => void
}

export function ProjectionCard({ projection, onEdit, onDelete }: ProjectionCardProps) {
  const creature = BESTIARY_BY_ID.get(projection.creatureId)
  const minutes = (projection.totalKills / projection.killsPer20Min) * 20

  return (
    <div className="relative flex min-h-[196px] flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card p-4">
      <div className="absolute right-2 top-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => onEdit(projection)}>
              <Pencil /> Editar
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onSelect={() => onDelete(projection.id)}>
              <Trash2 /> Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <img
        src={creature?.imageUrl}
        alt={projection.monsterName}
        className="size-14 rounded-full object-cover"
      />
      <div className="text-center">
        <div className="font-medium text-foreground">{projection.monsterName}</div>
        <div className="text-sm text-muted-foreground">{projection.totalKills} kills</div>
      </div>
      <div className="text-xl font-semibold text-primary">{formatDuration(minutes)}</div>
    </div>
  )
}
