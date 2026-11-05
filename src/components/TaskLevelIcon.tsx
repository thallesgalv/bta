import goldIcon from '@/assets/task-levels/gold.png'
import platinumIcon from '@/assets/task-levels/platinum.png'
import silverIcon from '@/assets/task-levels/silver.png'
import { TASK_LEVEL_LABEL } from '@/lib/comparison'
import { cn } from '@/lib/utils'
import type { TaskLevel } from '@/types'

const TASK_LEVEL_ICON: Record<TaskLevel, string | null> = {
  empty: null,
  silver: silverIcon,
  gold: goldIcon,
  platinum: platinumIcon,
}

interface TaskLevelIconProps {
  level: TaskLevel
  className?: string
  // Render a dashed circle (same size as the icon) for levels without an image.
  showEmptyPlaceholder?: boolean
}

export function TaskLevelIcon({ level, className, showEmptyPlaceholder }: TaskLevelIconProps) {
  const icon = TASK_LEVEL_ICON[level]
  if (!icon && showEmptyPlaceholder) {
    return (
      <span
        title={TASK_LEVEL_LABEL[level]}
        className={cn(
          'flex size-5 items-center justify-center rounded-full border border-dashed border-muted-foreground/50 text-muted-foreground',
          className,
        )}
      >
        —
      </span>
    )
  }
  if (!icon) return <span className="text-xs text-muted-foreground">{TASK_LEVEL_LABEL[level]}</span>
  return (
    <img
      src={icon}
      alt={TASK_LEVEL_LABEL[level]}
      title={TASK_LEVEL_LABEL[level]}
      className={cn('size-5 object-contain', className)}
    />
  )
}
