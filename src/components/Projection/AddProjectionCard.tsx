import { Plus } from 'lucide-react'

interface AddProjectionCardProps {
  onClick: () => void
}

export function AddProjectionCard({ onClick }: AddProjectionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[196px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
    >
      <Plus className="size-6" />
      <span className="text-sm font-medium">Nova projeção</span>
    </button>
  )
}
