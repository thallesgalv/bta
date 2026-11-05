import type { TaskLevel } from '@/types'

export const TASK_LEVELS: TaskLevel[] = ['empty', 'silver', 'gold', 'platinum']

export const TASK_LEVEL_LABEL: Record<TaskLevel, string> = {
  empty: 'Empty',
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
}

// Each level doubles the previous one: platinum gives 8× the empty task points.
export const TASK_POINTS: Record<TaskLevel, number> = {
  empty: 27,
  silver: 54,
  gold: 108,
  platinum: 216,
}

export function projectionMinutes(totalKills: number, killsPer20Min: number): number {
  return (totalKills / killsPer20Min) * 20
}

export function pointsPerMinute(level: TaskLevel, minutes: number): number {
  return TASK_POINTS[level] / minutes
}

// Time the task must be completed in to match the best points-per-minute rate.
export function breakEvenMinutes(level: TaskLevel, bestPpm: number): number {
  return TASK_POINTS[level] / bestPpm
}

// A "very good" hunt is 15 kills/min; Master tasks require 300–600 kills (450 midpoint).
// An empty task (27 pts) at that pace takes 30 min → 0.9 pts/min is the acceptable baseline.
export const GOOD_KILLS_PER_MIN = 15
export const REFERENCE_TASK_KILLS = 450
export const MAX_TASK_KILLS = 600
export const ACCEPTABLE_PPM = (TASK_POINTS.empty * GOOD_KILLS_PER_MIN) / REFERENCE_TASK_KILLS

// Minimum kills per 20 min needed for a task of this level/size to reach ACCEPTABLE_PPM.
export function minKillsPer20Min(level: TaskLevel, taskKills: number): number {
  return (ACCEPTABLE_PPM * 20 * taskKills) / TASK_POINTS[level]
}
