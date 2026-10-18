import { LayoutList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { BESTIARY } from '@/data/bestiary'
import { getRank } from '@/lib/ranking'
import { RANK_BADGE_CLASSNAME, RANK_LABEL } from '@/lib/rankStyles'
import { cn } from '@/lib/utils'
import type { HuntRecord, Rank } from '@/types'

const BESTIARY_BY_ID = new Map(BESTIARY.map((c) => [c.id, c]))

const TIER_ORDER: Rank[] = ['PickNow', 'Star', 'TwoStars', 'Skip']

interface TierlistDialogProps {
  records: HuntRecord[]
}

export function TierlistDialog({ records }: TierlistDialogProps) {
  const sorted = [...records].sort((a, b) => b.killsPer20Min - a.killsPer20Min)
  const tiers = TIER_ORDER.map((rank) => ({
    rank,
    records: sorted.filter((r) => getRank(r.killsPer20Min) === rank),
  }))

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <LayoutList /> See Tierlist
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[85vh] flex-col sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Tierlist based in your recordings</DialogTitle>
        </DialogHeader>
        {records.length === 0 ? (
          <div className="flex h-40 items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
            No records yet.
          </div>
        ) : (
          <div className="scrollbar-subtle -mr-2 flex min-h-0 flex-col gap-2 overflow-y-auto pr-2">
            {tiers.map(({ rank, records: tierRecords }) => (
              <div key={rank} className="flex min-h-28 shrink-0 gap-2">
                <div
                  className={cn(
                    'flex w-36 shrink-0 items-center justify-center rounded-md border p-2 text-center text-sm font-bold',
                    RANK_BADGE_CLASSNAME[rank],
                  )}
                >
                  {RANK_LABEL[rank]}
                </div>
                <div className="flex flex-1 flex-wrap items-start gap-3 rounded-md border border-border bg-muted/30 p-2">
                  {tierRecords.length === 0 ? (
                    <span className="self-center text-sm text-muted-foreground">—</span>
                  ) : (
                    tierRecords.map((record) => (
                      <div
                        key={record.id}
                        title={record.monsterName}
                        className="flex w-24 flex-col items-center gap-1 text-center"
                      >
                        <img
                          src={BESTIARY_BY_ID.get(record.id)?.imageUrl}
                          alt={record.monsterName}
                          className="size-12 object-contain"
                        />
                        <span className="w-full truncate text-[11px] font-medium text-foreground">
                          {record.monsterName}
                        </span>
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {record.killsPer20Min}/20m
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
