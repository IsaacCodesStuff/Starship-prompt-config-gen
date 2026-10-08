import { DEFAULT_LAYOUT, type PromptLayout } from './formatParser'
import { importToml } from './importToml'
import { DEFAULT_PROMPT_SETTINGS, defaultValues } from './modules'
import type { ConfigValues, PromptSettings, RawToml } from './schema'

export interface HashState {
  values: ConfigValues
  raw: RawToml
  layout: PromptLayout
  promptSettings: PromptSettings
}

const EMPTY_STATE: HashState = {
  values: defaultValues(),
  raw: {},
  layout: DEFAULT_LAYOUT,
  promptSettings: DEFAULT_PROMPT_SETTINGS,
}

export function fromHash(): HashState {
  const m = location.hash.match(/^#c=(.*)$/)
  if (!m) return EMPTY_STATE
  try {
    const { values, raw, layout, promptSettings } = importToml(decodeURIComponent(m[1]))
    return { values, raw, layout, promptSettings }
  } catch {
    return EMPTY_STATE
  }
}

export function writeHash(toml: string) {
  history.replaceState(null, '', '#c=' + encodeURIComponent(toml))
}