import { importToml } from './importToml';
import { defaultValues } from './modules';
import type { ConfigValues, RawToml } from './schema';

export function fromHash(): { values: ConfigValues; raw: RawToml } {
  const m = location.hash.match(/^#c=(.*)$/)
  if (!m) return { values: defaultValues(), raw: {} }
  try {
    const { values, raw } = importToml(decodeURIComponent(m[1]))
    return { values, raw }
  } catch {
    return { values: defaultValues(), raw: {} }
  }
}

export function writeHash(toml: string) {
  history.replaceState(null, '', '#c=' + encodeURIComponent(toml))
}