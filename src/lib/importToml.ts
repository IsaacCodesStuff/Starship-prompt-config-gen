import { parse } from 'smol-toml'
import { MODULES, defaultValues } from './modules'
import type { ConfigValues, RawToml } from './schema'

export interface ImportResult {
  values: ConfigValues
  raw: RawToml
  ignored: string[] // human-readable list, for the status message only
}

export function importToml(text: string): ImportResult {
  const parsed = parse(text) as RawToml
  const values = defaultValues()
  const raw: RawToml = structuredClone(parsed)
  const ignored: string[] = []

  for (const [key, val] of Object.entries(parsed)) {
    const mod = MODULES.find((m) => m.id === key)
    const isTable = typeof val === 'object' && val !== null && !Array.isArray(val)
    if (!mod || !isTable) {
      if (!mod) ignored.push(key)
      continue
    }

    const rawTable = { ...(val as Record<string, unknown>) }
    for (const opt of mod.options) {
      const optVal = rawTable[opt.key]
      if (optVal !== undefined && typeof optVal === opt.type) {
        values[mod.id][opt.key] = optVal
        delete rawTable[opt.key] // claimed by a known option; don't duplicate it in raw
      } else if (optVal !== undefined) {
        ignored.push(`${key}.${opt.key}`)
      }
    }
    // Leftover keys on a known module (e.g. an option we haven't modeled) stay in raw[key]
    if (Object.keys(rawTable).length) raw[key] = rawTable
    else delete raw[key]
  }
  return { values, raw, ignored }
}