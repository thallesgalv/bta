import { Star } from 'lucide-react'
import type { Stars } from '@/types'

export function StarRating({ stars }: { stars: Stars }) {
  if (stars === 0) return <span className="text-xs text-muted-foreground">No star</span>
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: stars }, (_, i) => (
        <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
      ))}
    </span>
  )
}
