import { MAX_TASK_KILLS, REFERENCE_TASK_KILLS, minKillsPer20Min } from '@/lib/comparison'
import type { Rank } from '@/types'

const RANK_THRESHOLDS: { min: number; rank: Rank }[] = [
  { min: minKillsPer20Min('empty', MAX_TASK_KILLS), rank: 'WorthAnyway' },
  { min: minKillsPer20Min('empty', REFERENCE_TASK_KILLS), rank: 'EmptyBelow450' },
  { min: minKillsPer20Min('silver', MAX_TASK_KILLS), rank: 'SilverAnyway' },
  { min: minKillsPer20Min('silver', REFERENCE_TASK_KILLS), rank: 'SilverBelow450' },
  { min: minKillsPer20Min('gold', MAX_TASK_KILLS), rank: 'GoldAnyway' },
  { min: minKillsPer20Min('gold', REFERENCE_TASK_KILLS), rank: 'GoldBelow450' },
  { min: minKillsPer20Min('platinum', MAX_TASK_KILLS), rank: 'PlatinumAnyway' },
  { min: minKillsPer20Min('platinum', REFERENCE_TASK_KILLS), rank: 'PlatinumBelow450' },
  { min: 0, rank: 'Skip' },
]

export const RANK_ORDER: Rank[] = RANK_THRESHOLDS.map((t) => t.rank)

// Small epsilon guards against floating-point error at exact thresholds (e.g. 0.9 * 20 * 450 / 27).
export function getRank(killsPer20Min: number): Rank {
  return RANK_THRESHOLDS.find((t) => killsPer20Min >= t.min - 1e-9)!.rank
}
