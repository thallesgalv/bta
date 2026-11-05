export type Difficulty = 'Medium' | 'Hard' | 'Challenging'

export type Rank =
  | 'WorthAnyway'
  | 'EmptyBelow450'
  | 'SilverAnyway'
  | 'SilverBelow450'
  | 'GoldAnyway'
  | 'GoldBelow450'
  | 'PlatinumAnyway'
  | 'PlatinumBelow450'
  | 'Skip'

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

export type TaskLevel = 'empty' | 'silver' | 'gold' | 'platinum'

export interface ComparisonEntry {
  creatureId: string
  level: TaskLevel
  totalKills: number
}

export interface WhatsAppPhone {
  ddd: string
  number: string
}
