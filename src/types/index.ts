export type Difficulty = 'Medium' | 'Hard' | 'Challenging'

export type Rank = 'PickNow' | 'Star' | 'TwoStars' | 'Skip'

export type Mode = 'Expert' | 'Master'

export type DamageType = 'physical' | 'earth' | 'fire' | 'death' | 'energy' | 'holy' | 'ice'

export interface BestiaryCreature {
  id: string
  name: string
  difficulty: Difficulty
  imageUrl: string
  resistances: Record<DamageType, number>
}

export interface HuntRecord {
  id: string
  monsterName: string
  killsPer20Min: number
  location: string
  updatedAt: string
}

export type Stars = 0 | 1 | 2

export interface ComparisonEntry {
  creatureId: string
  stars: Stars
  totalKills: number
}

export interface WhatsAppPhone {
  ddd: string
  number: string
}
