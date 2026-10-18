import type { Difficulty, Rank } from '@/types'

export const RANK_LABEL: Record<Rank, string> = {
  PickNow: 'PICK NOW!!!',
  Star: 'STAR ONLY',
  TwoStars: '2 STARS ONLY',
  Skip: 'SKIP!!!',
}

export const RANK_BADGE_CLASSNAME: Record<Rank, string> = {
  PickNow: 'border-emerald-400/40 bg-emerald-400/15 text-emerald-200',
  Star: 'border-amber-400/40 bg-amber-400/15 text-amber-200',
  TwoStars: 'border-orange-500/40 bg-orange-500/15 text-orange-300',
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
