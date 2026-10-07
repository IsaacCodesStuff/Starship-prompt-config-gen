import { MODULES } from './modules'
import type { ConfigValues, RawToml } from './schema'

const fmt = (v: unknown): string => {
  if (typeof v === 'string') return JSON.stringify(v)
  if (Array.isArray(v)) return `[${v.map(fmt).join(', ')}]`
  return String(v)
}

function tableBlock(id: string, entries: [string, unknown][]): string {
  return `[${id}]\n${entries.map(([k, v]) => `${k} = ${fmt(v)}`).join('\n')}`
}

export function toToml(values: ConfigValues, raw: RawToml = {}): string {
  const blocks: string[] = []
  const handled = new Set<string>()

  for (const mod of MODULES) {
    handled.add(mod.id)
    const known = mod.options
      .filter((o) => values[mod.id][o.key] !== o.default)
      .map((o): [string, unknown] => [o.key, values[mod.id][o.key]])
    const extra = raw[mod.id] ? Object.entries(raw[mod.id] as Record<string, unknown>) : []
    const entries = [...known, ...extra]
    if (entries.length) blocks.push(tableBlock(mod.id, entries))
  }

  // Anything in raw that isn't a known module at all (e.g. [battery], or a
  // top-level key like `add_newline`) gets re-emitted as-is.
  for (const [key, val] of Object.entries(raw)) {
    if (handled.has(key)) continue
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      blocks.push(tableBlock(key, Object.entries(val as Record<string, unknown>)))
    } else {
      blocks.push(`${key} = ${fmt(val)}`)
    }
  }

  return blocks.length ? blocks.join('\n\n') + '\n' : '# Everything is at Starship defaults\n'
}