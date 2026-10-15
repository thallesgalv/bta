import { Plus } from 'lucide-react'

interface EmptyCompareSlotProps {
  onClick: () => void
}

export function EmptyCompareSlot({ onClick }: EmptyCompareSlotProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Add creature to compare"
      className="flex min-h-[320px] items-center justify-center rounded-lg border-2 border-dotted border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
    >
      <Plus className="size-8" />
    </button>
  )
}
