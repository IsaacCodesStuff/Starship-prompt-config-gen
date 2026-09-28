import type { ConfigValues } from './schema'

export interface Segment {
  text: string
  style: string
}
export interface PreviewContext {
  lastCommandFailed: boolean
}
type Renderer = (o: Record<string, any>, ctx: PreviewContext) => Segment[] // eslint-disable-line @typescript-eslint/no-explicit-any

// Fake environment the preview pretends to be in.
const SAMPLE = {
  homeRelativePath: ['dev', 'starship-generator', 'src', 'lib'],
  repoRootIndex: 1, // 'starship-generator'
  branch: 'main',
  nodeVersion: 'v20.11.0',
  durationMs: 5234,
}

// Parses Starship markup like "[text](bold green) plain" into segments.
function parseMarkup(input: string): Segment[] {
  const out: Segment[] = []
  const re = /\[([^\]]*)\]\(([^)]*)\)/g
  let last = 0
  for (const m of input.matchAll(re)) {
    if (m.index > last) out.push({ text: input.slice(last, m.index), style: '' })
    out.push({ text: m[1], style: m[2] })
    last = m.index + m[0].length
  }
  if (last < input.length) out.push({ text: input.slice(last), style: '' })
  return out
}

// A tiny strftime: just enough for common time formats.
function formatTime(fmt: string, d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  const h12 = d.getHours() % 12 || 12
  return fmt
    .replace(/%T/g, `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`)
    .replace(/%R/g, `${p(d.getHours())}:${p(d.getMinutes())}`)
    .replace(/%H/g, p(d.getHours()))
    .replace(/%I/g, p(h12))
    .replace(/%M/g, p(d.getMinutes()))
    .replace(/%S/g, p(d.getSeconds()))
    .replace(/%p/g, d.getHours() < 12 ? 'AM' : 'PM')
}

const RENDERERS: Record<string, Renderer> = {
  directory: (o) => {
    if (o.disabled) return []
    let parts = [...SAMPLE.homeRelativePath]
    let root = o.home_symbol as string
    if (o.truncate_to_repo) {
      parts = parts.slice(SAMPLE.repoRootIndex)
      root = ''
    }
    if (o.truncation_length > 0 && parts.length > o.truncation_length) {
      parts = parts.slice(-o.truncation_length)
      root = ''
    }
    const path = [root, ...parts].filter(Boolean).join('/')
    return [{ text: path, style: o.style }, { text: ' ', style: '' }]
  },

    nodejs: (o) =>
    o.disabled
        ? []
        : [
            { text: 'via ', style: '' },
            { text: `${o.symbol}${SAMPLE.nodeVersion}`, style: o.style },
            { text: ' ', style: '' },
        ],
      
  git_branch: (o) =>
    o.disabled
      ? []
      : [
          { text: 'on ', style: '' },
          { text: `${o.symbol}${SAMPLE.branch}`, style: o.style },
          { text: ' ', style: '' },
        ],

  cmd_duration: (o) => {
    if (o.disabled || SAMPLE.durationMs < o.min_time) return []
    const s = Math.floor(SAMPLE.durationMs / 1000)
    const text = o.show_milliseconds ? `${s}s${SAMPLE.durationMs % 1000}ms` : `${s}s`
    return [
      { text: 'took ', style: '' },
      { text, style: o.style },
      { text: ' ', style: '' },
    ]
  },

  time: (o) =>
    o.disabled
      ? []
      : [
          { text: 'at ', style: '' },
          { text: formatTime(o.time_format, new Date()), style: o.style },
          { text: ' ', style: '' },
        ],

  character: (o, ctx) =>
    o.disabled
      ? []
      : [...parseMarkup(ctx.lastCommandFailed ? o.error_symbol : o.success_symbol), { text: ' ', style: '' }],
}

// Which modules appear, in order. 'newline' starts a new prompt line.
const PROMPT_ORDER = ['directory', 'git_branch', 'nodejs', 'cmd_duration', 'newline', 'time', 'character']

export function renderPrompt(values: ConfigValues, ctx: PreviewContext): Segment[][] {
  const lines: Segment[][] = [[]]
  for (const id of PROMPT_ORDER) {
    if (id === 'newline') {
      lines.push([])
      continue
    }
    const render = RENDERERS[id]
    if (render && values[id]) lines[lines.length - 1].push(...render(values[id], ctx))
  }
  return lines
}