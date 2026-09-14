import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { BESTIARY } from '@/data/bestiary'
import { computeRanks } from '@/lib/ranking'
import { RANK_BADGE_CLASSNAME } from '@/lib/rankStyles'
import { cn } from '@/lib/utils'
import type { HuntRecord } from '@/types'

const BESTIARY_BY_ID = new Map(BESTIARY.map((c) => [c.id, c]))

interface RecordsTableProps {
  records: HuntRecord[]
  onEdit: (record: HuntRecord) => void
  onDelete: (id: string) => void
}

export function RecordsTable({ records, onEdit, onDelete }: RecordsTableProps) {
  const ranks = computeRanks(records)
  const sorted = [...records].sort((a, b) => b.killsPer20Min - a.killsPer20Min)

  if (records.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
        Nenhum registro cadastrado ainda.
      </div>
    )
  }

  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Ranking</TableHead>
            <TableHead>Kills per 20 min</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((record) => {
            const rank = ranks.get(record.id)!
            return (
              <TableRow key={record.id}>
                <TableCell>
                  <img
                    src={BESTIARY_BY_ID.get(record.id)?.imageUrl}
                    alt={record.monsterName}
                    className="size-8 rounded-full object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  {record.monsterName}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn('border', RANK_BADGE_CLASSNAME[rank])}>
                    {rank}
                  </Badge>
                </TableCell>
                <TableCell>{record.killsPer20Min}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{record.location}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => onEdit(record)}>
                        <Pencil /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onSelect={() => onDelete(record.id)}
                      >
                        <Trash2 /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
