import { BookOpen, ListChecks, Pencil, Settings, Trash2 } from 'lucide-react'
import { ResistanceList } from '@/components/ResistanceList'
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
import { bredworldTaskUrl, tibiaWikiUrl } from '@/lib/externalLinks'
import { formatDuration } from '@/lib/formatDuration'
import { getRank } from '@/lib/ranking'
import {
  DIFFICULTY_BADGE_CLASSNAME,
  RANK_BADGE_CLASSNAME,
  RANK_LABEL,
} from '@/lib/rankStyles'
import { cn } from '@/lib/utils'
import type { HuntRecord, Mode } from '@/types'

const BESTIARY_BY_ID = new Map(BESTIARY.map((c) => [c.id, c]))

interface RecordsTableProps {
  records: HuntRecord[]
  projectionKills: number
  emptyMessage: string
  mode: Mode
  onEdit: (record: HuntRecord) => void
  onDelete: (id: string) => void
}

export function RecordsTable({
  records,
  projectionKills,
  emptyMessage,
  mode,
  onEdit,
  onDelete,
}: RecordsTableProps) {
  const sorted = [...records].sort((a, b) => b.killsPer20Min - a.killsPer20Min)

  if (records.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-border">
      <Table containerClassName="scrollbar-subtle flex-1 overflow-auto">
        <TableHeader className="sticky top-0 z-10 bg-background">
          <TableRow>
            <TableHead className="text-center">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-center">Ranking</TableHead>
            <TableHead className="text-center">Kills per 20 min</TableHead>
            <TableHead className="text-center">Projection</TableHead>
            <TableHead className="text-center">Location</TableHead>
            {mode === 'Expert' && <TableHead className="text-center">Bestiary Level</TableHead>}
            <TableHead className="text-center">Weakness/Resistances</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((record) => {
            const rank = getRank(record.killsPer20Min)
            const difficulty = BESTIARY_BY_ID.get(record.id)?.difficulty
            const resistances = BESTIARY_BY_ID.get(record.id)?.resistances
            return (
              <TableRow key={record.id}>
                <TableCell className="text-center">
                  <img
                    src={BESTIARY_BY_ID.get(record.id)?.imageUrl}
                    alt={record.monsterName}
                    className="mx-auto size-8 rounded-full object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  <div className="flex items-center gap-1.5">
                    <span>{record.monsterName}</span>
                    <a
                      href={tibiaWikiUrl(record.monsterName)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open in TibiaWiki"
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      <BookOpen className="size-3.5" />
                    </a>
                    <a
                      href={bredworldTaskUrl(record.monsterName)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open in Bredworld Task Delivery"
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      <ListChecks className="size-3.5" />
                    </a>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={cn('border whitespace-nowrap', RANK_BADGE_CLASSNAME[rank])}
                  >
                    {RANK_LABEL[rank]}
                  </Badge>
                </TableCell>
                <TableCell className="text-center tabular-nums">
                  {record.killsPer20Min}{' '}
                  <span className="text-[10px] text-muted-foreground">
                    ({Number((record.killsPer20Min / 20).toFixed(1))} KPM)
                  </span>
                </TableCell>
                <TableCell className="text-center tabular-nums">
                  {projectionKills > 0
                    ? formatDuration((projectionKills / record.killsPer20Min) * 20)
                    : '—'}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary">{record.location}</Badge>
                </TableCell>
                {mode === 'Expert' && (
                  <TableCell className="text-center">
                    {difficulty && (
                      <Badge
                        variant="outline"
                        className={cn('border', DIFFICULTY_BADGE_CLASSNAME[difficulty])}
                      >
                        {difficulty}
                      </Badge>
                    )}
                  </TableCell>
                )}
                <TableCell className="text-center">
                  {resistances && <ResistanceList resistances={resistances} />}
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <Settings className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => onEdit(record)}>
                        <Pencil /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onSelect={() => onDelete(record.id)}
                      >
                        <Trash2 /> Delete
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
