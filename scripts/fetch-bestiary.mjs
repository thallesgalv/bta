#!/usr/bin/env node
// One-off script: fetches the Bestiary Medium/Hard/Challenging creature lists
// and their image URLs from the TibiaWiki (Fandom) MediaWiki API, then writes
// a static src/data/bestiary.ts file. Not run at app runtime.

import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const API = 'https://tibia.fandom.com/api.php'
const HEADERS = { 'User-Agent': 'Mozilla/5.0 (bta-bestiary-fetch-script)' }

function normalizeId(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

async function fetchCategoryMembers(category) {
  const url = `${API}?action=query&list=categorymembers&cmtitle=${encodeURIComponent(
    `Category:${category}`,
  )}&cmlimit=500&format=json`
  const res = await fetch(url, { headers: HEADERS })
  if (!res.ok) throw new Error(`Failed to fetch category ${category}: ${res.status}`)
  const data = await res.json()
  if (data.continue) {
    console.warn(`Warning: category ${category} has more results than fetched (pagination not implemented)`)
  }
  return data.query.categorymembers.map((m) => m.title)
}

async function fetchImageUrls(names) {
  const urls = new Map()
  const batchSize = 40
  for (let i = 0; i < names.length; i += batchSize) {
    const batch = names.slice(i, i + batchSize)
    const titles = batch.map((n) => `File:${n}.gif`).join('|')
    const url = `${API}?action=query&titles=${encodeURIComponent(
      titles,
    )}&prop=imageinfo&iiprop=url&format=json`
    const res = await fetch(url, { headers: HEADERS })
    if (!res.ok) throw new Error(`Failed to fetch imageinfo batch: ${res.status}`)
    const data = await res.json()
    const pages = Object.values(data.query.pages)
    for (const page of pages) {
      const title = page.title.replace(/^File:/, '').replace(/\.gif$/, '')
      const info = page.imageinfo?.[0]
      if (info?.url) {
        urls.set(title, info.url)
      }
    }
    console.log(`  fetched images ${Math.min(i + batchSize, names.length)}/${names.length}`)
  }
  return urls
}

const DMG_MOD_FIELDS = [
  ['physical', 'physicalDmgMod'],
  ['earth', 'earthDmgMod'],
  ['fire', 'fireDmgMod'],
  ['death', 'deathDmgMod'],
  ['energy', 'energyDmgMod'],
  ['holy', 'holyDmgMod'],
  ['ice', 'iceDmgMod'],
]

function parseResistances(wikitext) {
  const resistances = {}
  for (const [key, field] of DMG_MOD_FIELDS) {
    const match = wikitext.match(new RegExp(`${field}\\s*=\\s*(\\d+)%`, 'i'))
    resistances[key] = match ? Number(match[1]) : 100
  }
  return resistances
}

async function fetchResistances(names) {
  const resistances = new Map()
  const batchSize = 40
  for (let i = 0; i < names.length; i += batchSize) {
    const batch = names.slice(i, i + batchSize)
    const titles = batch.join('|')
    const url = `${API}?action=query&titles=${encodeURIComponent(
      titles,
    )}&prop=revisions&rvprop=content&rvslots=main&format=json`
    const res = await fetch(url, { headers: HEADERS })
    if (!res.ok) throw new Error(`Failed to fetch revisions batch: ${res.status}`)
    const data = await res.json()
    const pages = Object.values(data.query.pages)
    for (const page of pages) {
      const wikitext = page.revisions?.[0]?.slots?.main?.['*']
      if (wikitext) {
        resistances.set(page.title, parseResistances(wikitext))
      }
    }
    console.log(`  fetched resistances ${Math.min(i + batchSize, names.length)}/${names.length}`)
  }
  return resistances
}

async function main() {
  console.log('Fetching Medium creatures...')
  const medium = await fetchCategoryMembers('Bestiary_Medium_Creatures')
  console.log(`  found ${medium.length} Medium creatures`)

  console.log('Fetching Hard creatures...')
  const hard = await fetchCategoryMembers('Bestiary_Hard_Creatures')
  console.log(`  found ${hard.length} Hard creatures`)

  console.log('Fetching Challenging creatures...')
  const challenging = await fetchCategoryMembers('Bestiary_Challenging_Creatures')
  console.log(`  found ${challenging.length} Challenging creatures`)

  const all = [
    ...medium.map((name) => ({ name, difficulty: 'Medium' })),
    ...hard.map((name) => ({ name, difficulty: 'Hard' })),
    ...challenging.map((name) => ({ name, difficulty: 'Challenging' })),
  ]

  console.log(`Fetching image URLs for ${all.length} creatures...`)
  const imageUrls = await fetchImageUrls(all.map((c) => c.name))

  const missing = all.filter((c) => !imageUrls.has(c.name))
  if (missing.length > 0) {
    console.warn(`Warning: no image found for ${missing.length} creatures:`)
    for (const m of missing) console.warn(`  - ${m.name}`)
  }

  console.log(`Fetching resistances for ${all.length} creatures...`)
  const resistances = await fetchResistances(all.map((c) => c.name))

  const missingResistances = all.filter((c) => !resistances.has(c.name))
  if (missingResistances.length > 0) {
    console.warn(`Warning: no resistances found for ${missingResistances.length} creatures:`)
    for (const m of missingResistances) console.warn(`  - ${m.name}`)
  }

  const DEFAULT_RESISTANCES = Object.fromEntries(DMG_MOD_FIELDS.map(([key]) => [key, 100]))

  const creatures = all
    .map((c) => ({
      id: normalizeId(c.name),
      name: c.name,
      difficulty: c.difficulty,
      imageUrl: imageUrls.get(c.name) ?? '',
      resistances: resistances.get(c.name) ?? DEFAULT_RESISTANCES,
    }))
    .filter((c) => c.imageUrl)
    .sort((a, b) => a.name.localeCompare(b.name))

  const dupes = new Map()
  for (const c of creatures) {
    dupes.set(c.id, (dupes.get(c.id) ?? 0) + 1)
  }
  const dupeIds = [...dupes.entries()].filter(([, count]) => count > 1)
  if (dupeIds.length > 0) {
    console.warn('Warning: duplicate normalized ids found:', dupeIds)
  }

  const fileContent = `// Auto-generated by scripts/fetch-bestiary.mjs — do not edit by hand.
// Source: TibiaWiki (Fandom) Bestiary Medium/Hard/Challenging categories.
import type { BestiaryCreature } from '@/types'

export const BESTIARY: BestiaryCreature[] = ${JSON.stringify(creatures, null, 2)}
`

  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const outPath = path.resolve(__dirname, '../src/data/bestiary.ts')
  await writeFile(outPath, fileContent, 'utf-8')
  console.log(`\nWrote ${creatures.length} creatures to ${outPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
