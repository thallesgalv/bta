import type { Rank } from '@/types'

export const RANK_BADGE_CLASSNAME: Record<Rank, string> = {
  Diamond: 'border-cyan-400/40 bg-cyan-400/15 text-cyan-200',
  Gold: 'border-amber-400/40 bg-amber-400/15 text-amber-200',
  Silver: 'border-slate-400/40 bg-slate-400/15 text-slate-200',
  Bronze: 'border-orange-500/40 bg-orange-500/15 text-orange-300',
}
