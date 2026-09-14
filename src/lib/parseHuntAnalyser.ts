import { BESTIARY } from '@/data/bestiary'
import type { BestiaryCreature } from '@/types'

const BESTIARY_BY_NAME = new Map<string, BestiaryCreature>(
  BESTIARY.map((c) => [c.name.toLowerCase(), c]),
)

export interface ParsedKill {
  creature: BestiaryCreature
  rawKills: number
  killsPer20Min: number
}

export interface ParseHuntAnalyserResult {
  sessionMinutes: number | null
  matched: ParsedKill[]
  ignored: string[]
}

function parseSessionMinutes(text: string): number | null {
  const match = text.match(/Session length:\s*(\d+):(\d+)h/i)
  if (!match) return null
  const hours = Number(match[1])
  const minutes = Number(match[2])
  return hours * 60 + minutes
}

function parseKilledMonsterLines(text: string): { name: string; kills: number }[] {
  const lines = text.split('\n')
  const startIndex = lines.findIndex((line) => /Killed Monsters:/i.test(line))
  if (startIndex === -1) return []

  const entries: { name: string; kills: number }[] = []
  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i]
    const match = line.match(/^\s*([\d.]+)x\s+(.+?)\s*$/)
    if (!match) break
    const kills = Number(match[1].replace(/\./g, ''))
    entries.push({ name: match[2], kills })
  }
  return entries
}

export function parseHuntAnalyser(
  text: string,
  considerProportion: boolean,
): ParseHuntAnalyserResult {
  const sessionMinutes = parseSessionMinutes(text)
  const entries = parseKilledMonsterLines(text)

  const matched: ParsedKill[] = []
  const ignored: string[] = []

  for (const entry of entries) {
    const creature = BESTIARY_BY_NAME.get(entry.name.toLowerCase())
    if (!creature) {
      ignored.push(entry.name)
      continue
    }
    const shouldScale = considerProportion && sessionMinutes && sessionMinutes > 0
    const killsPer20Min = shouldScale
      ? Math.round(((entry.kills * 20) / sessionMinutes!) * 10) / 10
      : entry.kills
    matched.push({ creature, rawKills: entry.kills, killsPer20Min })
  }

  return { sessionMinutes, matched, ignored }
}
