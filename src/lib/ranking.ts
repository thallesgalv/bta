import type { HuntRecord, Rank } from '@/types'

const RANK_ORDER: Rank[] = ['Diamond', 'Gold', 'Silver', 'Bronze']

export function computeRanks(records: HuntRecord[]): Map<string, Rank> {
  const sorted = [...records].sort((a, b) => b.killsPer20Min - a.killsPer20Min)
  const n = sorted.length
  const ranks = new Map<string, Rank>()
  sorted.forEach((record, i) => {
    const bucket = Math.min(3, Math.floor((i / n) * 4))
    ranks.set(record.id, RANK_ORDER[bucket])
  })
  return ranks
}
