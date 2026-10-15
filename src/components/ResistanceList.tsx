import { DAMAGE_TYPE_ICON_URL, DAMAGE_TYPE_LABEL } from '@/lib/damageTypes'
import { resistanceTextClassName } from '@/lib/rankStyles'
import { cn } from '@/lib/utils'
import type { DamageType } from '@/types'

interface ResistanceListProps {
  resistances: Record<DamageType, number>
}

export function ResistanceList({ resistances }: ResistanceListProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1">
      {(Object.entries(resistances) as [DamageType, number][])
        .sort((a, b) => b[1] - a[1])
        .map(([type, pct]) => (
          <span
            key={type}
            title={DAMAGE_TYPE_LABEL[type]}
            className="flex items-center gap-0.5 rounded bg-muted px-1 py-0.5 text-xs"
          >
            <img src={DAMAGE_TYPE_ICON_URL[type]} alt={DAMAGE_TYPE_LABEL[type]} className="size-3.5" />
            <span className={cn('tabular-nums', resistanceTextClassName(pct))}>{pct}%</span>
          </span>
        ))}
    </div>
  )
}
