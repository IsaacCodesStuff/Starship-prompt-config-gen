import { MODULES } from './modules'
import type { ConfigValues } from './schema'

// JSON string escaping is compatible with TOML basic strings for our needs.
const fmt = (v: unknown) => (typeof v === 'string' ? JSON.stringify(v) : String(v))

export function toToml(values: ConfigValues): string {
  const blocks: string[] = []
  for (const mod of MODULES) {
    const lines = mod.options
      .filter((o) => values[mod.id][o.key] !== o.default)
      .map((o) => `${o.key} = ${fmt(values[mod.id][o.key])}`)
    if (lines.length) blocks.push(`[${mod.id}]\n${lines.join('\n')}`)
  }
  return blocks.length ? blocks.join('\n\n') + '\n' : '# Everything is at Starship defaults\n'
}