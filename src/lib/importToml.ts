import { parse } from 'smol-toml'
import { DEFAULT_LAYOUT, parseLayout, type PromptLayout } from './formatParser'
import { DEFAULT_PROMPT_SETTINGS, MODULES, defaultValues } from './modules'
import type { ConfigValues, PromptSettings, RawToml } from './schema'

const STRUCTURAL_KEYS = new Set(['format', 'right_format', 'add_newline', 'continuation_prompt'])

export interface ImportResult {
  values: ConfigValues
  raw: RawToml
  layout: PromptLayout
  promptSettings: PromptSettings
  ignored: string[]
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
      if (!mod && !STRUCTURAL_KEYS.has(key)) ignored.push(key)
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
    const layout =
    typeof parsed.format === 'string' || typeof parsed.right_format === 'string'
      ? parseLayout(parsed.format as string | undefined, parsed.right_format as string | undefined)
      : DEFAULT_LAYOUT

    const promptSettings: PromptSettings = {
    add_newline: typeof parsed.add_newline === 'boolean' ? parsed.add_newline : DEFAULT_PROMPT_SETTINGS.add_newline,
    continuation_prompt:
      typeof parsed.continuation_prompt === 'string' ? parsed.continuation_prompt : DEFAULT_PROMPT_SETTINGS.continuation_prompt,
  }
  delete raw.add_newline
  delete raw.continuation_prompt

  return { values, raw, layout, promptSettings, ignored }
}