export type Difficulty = 'Medium' | 'Hard'

export type Rank = 'Diamond' | 'Gold' | 'Silver' | 'Bronze'

export interface BestiaryCreature {
  id: string
  name: string
  difficulty: Difficulty
  imageUrl: string
}

export interface HuntRecord {
  id: string
  monsterName: string
  killsPer20Min: number
  location: string
  updatedAt: string
}

export interface Projection {
  id: string
  creatureId: string
  monsterName: string
  killsPer20Min: number
  totalKills: number
  createdAt: string
}
