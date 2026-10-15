import type { Rank } from '@/types'

const RANK_THRESHOLDS: { min: number; rank: Rank }[] = [
  { min: 300, rank: 'PickNow' },
  { min: 150, rank: 'Star' },
  { min: 75, rank: 'TwoStars' },
  { min: 0, rank: 'Skip' },
]

export function getRank(killsPer20Min: number): Rank {
  return RANK_THRESHOLDS.find((t) => killsPer20Min >= t.min)!.rank
}
