import { parse } from 'smol-toml'
import { MODULES, defaultValues } from './modules'
import type { ConfigValues } from './schema'

export interface ImportResult {
  values: ConfigValues
  ignored: string[] // things we found but don't support yet
}

// Throws if the text isn't valid TOML; callers should catch.
export function importToml(text: string): ImportResult {
  const parsed = parse(text) as Record<string, unknown>
  const values = defaultValues()
  const ignored: string[] = []

  for (const [key, val] of Object.entries(parsed)) {
    const mod = MODULES.find((m) => m.id === key)
    const isTable = typeof val === 'object' && val !== null && !Array.isArray(val)
    if (!mod || !isTable) {
      ignored.push(key)
      continue
    }
    for (const [optKey, optVal] of Object.entries(val as Record<string, unknown>)) {
      const opt = mod.options.find((o) => o.key === optKey)
      // typeof gives 'string' | 'number' | 'boolean', which matches our OptionType names
      if (opt && typeof optVal === opt.type) values[mod.id][optKey] = optVal
      else ignored.push(`${key}.${optKey}`)
    }
  }
  return { values, ignored }
}