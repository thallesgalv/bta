import { TaskLevelIcon } from '@/components/TaskLevelIcon'
import { RANK_BADGE_CLASSNAME, RANK_DISPLAY, RANK_LABEL } from '@/lib/rankStyles'
import { cn } from '@/lib/utils'
import type { Rank } from '@/types'

interface RankBadgeProps {
  rank: Rank
  size?: 'sm' | 'lg'
  className?: string
}

export function RankBadge({ rank, size = 'sm', className }: RankBadgeProps) {
  const { prefix, level, suffix } = RANK_DISPLAY[rank]

  if (size === 'lg') {
    return (
      <div
        title={RANK_LABEL[rank]}
        className={cn(
          'flex flex-col items-center justify-center gap-1.5 rounded-md border p-2 text-center text-sm font-bold',
          RANK_BADGE_CLASSNAME[rank],
          className,
        )}
      >
        {level && <TaskLevelIcon level={level} className="size-8" />}
        <span>{[prefix, suffix].filter(Boolean).join(' ')}</span>
      </div>
    )
  }

  return (
    <span
      title={RANK_LABEL[rank]}
      className={cn(
        'inline-flex h-6 items-center justify-center gap-1 rounded-4xl border px-2 text-xs font-medium whitespace-nowrap',
        RANK_BADGE_CLASSNAME[rank],
        className,
      )}
    >
      {prefix && <span>{prefix}</span>}
      {level && <TaskLevelIcon level={level} className="size-4" />}
      <span>{suffix}</span>
    </span>
  )
}
