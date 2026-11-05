import type { Difficulty, Rank, TaskLevel } from '@/types'

export const RANK_LABEL: Record<Rank, string> = {
  WorthAnyway: 'WORTH ANYWAY',
  EmptyBelow450: 'EMPTY BELOW 450',
  SilverAnyway: 'SILVER ANYWAY',
  SilverBelow450: 'ONLY SILVER BELOW 450',
  GoldAnyway: 'GOLD ANYWAY',
  GoldBelow450: 'ONLY GOLD BELOW 450',
  PlatinumAnyway: 'PLATINUM ANYWAY',
  PlatinumBelow450: 'ONLY PLATINUM BELOW 450',
  Skip: 'SKIP!!!',
}

// How a rank is rendered: the level name is replaced by its image when one exists.
export const RANK_DISPLAY: Record<Rank, { prefix?: string; level?: TaskLevel; suffix: string }> = {
  WorthAnyway: { suffix: 'WORTH ANYWAY' },
  EmptyBelow450: { suffix: 'EMPTY BELOW 450' },
  SilverAnyway: { level: 'silver', suffix: 'ANYWAY' },
  SilverBelow450: { prefix: 'ONLY', level: 'silver', suffix: 'BELOW 450' },
  GoldAnyway: { level: 'gold', suffix: 'ANYWAY' },
  GoldBelow450: { prefix: 'ONLY', level: 'gold', suffix: 'BELOW 450' },
  PlatinumAnyway: { level: 'platinum', suffix: 'ANYWAY' },
  PlatinumBelow450: { prefix: 'ONLY', level: 'platinum', suffix: 'BELOW 450' },
  Skip: { suffix: 'SKIP!!!' },
}

export const RANK_BADGE_CLASSNAME: Record<Rank, string> = {
  WorthAnyway: 'border-emerald-400/60 bg-emerald-400/25 text-emerald-200',
  EmptyBelow450: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  SilverAnyway: 'border-slate-300/60 bg-slate-300/20 text-slate-100',
  SilverBelow450: 'border-slate-300/30 bg-slate-300/10 text-slate-300',
  GoldAnyway: 'border-amber-400/60 bg-amber-400/25 text-amber-200',
  GoldBelow450: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
  PlatinumAnyway: 'border-cyan-400/60 bg-cyan-400/25 text-cyan-200',
  PlatinumBelow450: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300',
  Skip: 'border-red-500/40 bg-red-500/15 text-red-300',
}

export const DIFFICULTY_BADGE_CLASSNAME: Record<Difficulty, string> = {
  Medium: 'border-sky-400/40 bg-sky-400/15 text-sky-200',
  Hard: 'border-rose-500/40 bg-rose-500/15 text-rose-300',
  Challenging: 'border-violet-500/40 bg-violet-500/15 text-violet-300',
}

export function resistanceTextClassName(pct: number): string {
  if (pct > 100) return 'text-emerald-400'
  if (pct < 100) return 'text-rose-600'
  return 'text-gray-300'
}
