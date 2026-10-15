import { BookOpen, ListChecks, MoreHorizontal, Pencil, Trash2, Triangle, Trophy } from 'lucide-react'
import { StarRating } from '@/components/Compare/StarRating'
import { ResistanceList } from '@/components/ResistanceList'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ACCEPTABLE_PPM, breakEvenMinutes } from '@/lib/comparison'
import { bredworldTaskUrl, tibiaWikiUrl } from '@/lib/externalLinks'
import { formatDuration } from '@/lib/formatDuration'
import { cn } from '@/lib/utils'
import type { BestiaryCreature, ComparisonEntry } from '@/types'

interface CompareCardProps {
  entry: ComparisonEntry
  creature: BestiaryCreature
  minutes: number | null
  ppm: number | null
  bestPpm: number | null
  onEdit: () => void
  onRemove: () => void
}

export function CompareCard({
  entry,
  creature,
  minutes,
  ppm,
  bestPpm,
  onEdit,
  onRemove,
}: CompareCardProps) {
  const isBest = ppm !== null && bestPpm !== null && ppm === bestPpm
  const isGood = ppm !== null && ppm >= ACCEPTABLE_PPM

  return (
    <div
      className={cn(
        'relative flex min-h-[320px] flex-col items-center gap-3 rounded-lg border bg-card p-4',
        isBest ? 'border-primary ring-1 ring-primary' : 'border-border',
      )}
    >
      <div className="absolute right-2 top-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={onEdit}>
              <Pencil /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onSelect={onRemove}>
              <Trash2 /> Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {isBest && (
        <Badge className="absolute left-2 top-2 gap-1">
          <Trophy className="size-3" /> Best option
        </Badge>
      )}

      <div className="mt-6 flex h-5 items-center">
        <StarRating stars={entry.stars} />
      </div>
      <img src={creature.imageUrl} alt={creature.name} className="size-16 object-contain" />
      <div className="text-center">
        <div className="flex items-center justify-center gap-1.5 font-medium text-foreground">
          <span>{creature.name}</span>
          <a
            href={tibiaWikiUrl(creature.name)}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in TibiaWiki"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            <BookOpen className="size-3.5" />
          </a>
          <a
            href={bredworldTaskUrl(creature.name)}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in Bredworld"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            <ListChecks className="size-3.5" />
          </a>
        </div>
        <div className="text-sm text-muted-foreground">{entry.totalKills} kills</div>
      </div>

      {minutes !== null && ppm !== null ? (
        <div className="grid w-full grid-cols-2 gap-2 text-center">
          <div>
            <div className="text-xs text-muted-foreground">Projection</div>
            <div className="text-lg font-semibold tabular-nums text-foreground">
              {formatDuration(minutes)}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Points/min</div>
            <div
              className={cn(
                'flex items-center justify-center gap-1 text-lg font-semibold tabular-nums',
                isBest ? 'text-primary' : 'text-foreground',
              )}
            >
              {ppm.toFixed(2)}
              {isBest && (
                <Triangle
                  className={cn(
                    'size-3 fill-current',
                    isGood ? 'text-emerald-400' : 'rotate-180 text-rose-400',
                  )}
                />
              )}
            </div>
          </div>
          {isBest && (
            <p
              className={cn(
                'col-span-2 text-sm font-medium',
                isGood ? 'text-emerald-400' : 'text-rose-400',
              )}
            >
              {isGood
                ? 'Good points per minute. Safe pick'
                : 'Bad points per minute. Consider re-roll'}
              <span className="block text-xs font-normal text-muted-foreground">
                (acceptable {ACCEPTABLE_PPM.toFixed(1)} points per minute)
              </span>
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm font-medium text-amber-400">Creature without records</p>
      )}

      {minutes === null && bestPpm !== null && (
        <p className="text-center text-sm text-muted-foreground">
          To be worth it, finish the task in at most{' '}
          <span className="font-semibold tabular-nums text-foreground">
            {formatDuration(breakEvenMinutes(entry.stars, bestPpm))}
          </span>
        </p>
      )}

      <div className="mt-auto">
        <ResistanceList resistances={creature.resistances} />
      </div>
    </div>
  )
}
