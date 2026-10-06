import { importToml } from './importToml'
import { defaultValues } from './modules'
import type { ConfigValues } from './schema'

// The URL hash looks like  #c=<url-encoded TOML>
export function valuesFromHash(): ConfigValues {
  const m = location.hash.match(/^#c=(.*)$/)
  if (!m) return defaultValues()
  try {
    return importToml(decodeURIComponent(m[1])).values
  } catch {
    return defaultValues() // a broken link shouldn't break the site
  }
}

export function writeHash(toml: string) {
  history.replaceState(null, '', '#c=' + encodeURIComponent(toml))
}