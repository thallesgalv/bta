import type { Stars } from '@/types'

export const TASK_POINTS: Record<Stars, number> = { 0: 27, 1: 54, 2: 108 }

export function projectionMinutes(totalKills: number, killsPer20Min: number): number {
  return (totalKills / killsPer20Min) * 20
}

export function pointsPerMinute(stars: Stars, minutes: number): number {
  return TASK_POINTS[stars] / minutes
}

// Time the task must be completed in to match the best points-per-minute rate.
export function breakEvenMinutes(stars: Stars, bestPpm: number): number {
  return TASK_POINTS[stars] / bestPpm
}

// A "very good" hunt is 15 kills/min; Master tasks require 300–600 kills (450 midpoint).
// A no-star task (27 pts) at that pace takes 30 min → 0.9 pts/min is the acceptable baseline.
export const GOOD_KILLS_PER_MIN = 15
export const REFERENCE_TASK_KILLS = 450
export const ACCEPTABLE_PPM = (TASK_POINTS[0] * GOOD_KILLS_PER_MIN) / REFERENCE_TASK_KILLS
