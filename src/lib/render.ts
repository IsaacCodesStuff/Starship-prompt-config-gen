import { LANGUAGES } from './languages'
import type { ConfigValues } from './schema'

export interface Segment {
  text: string
  style: string
}
export interface PreviewContext {
  lastCommandFailed: boolean
  isRoot: boolean
}
type Renderer = (o: Record<string, any>, ctx: PreviewContext) => Segment[] // eslint-disable-line @typescript-eslint/no-explicit-any

// Fake environment the preview pretends to be in.
const SAMPLE = {
  homeRelativePath: ['dev', 'starship-generator', 'src', 'lib'],
  repoRootIndex: 1,
  branch: 'main',
  durationMs: 5234,
  jobCount: 2,
  user: 'isaac',
  gitAdded: 42,
  gitDeleted: 7,
  gitAhead: 2,
  gitBehind: 0,
  gitStaged: 1,
  gitModified: 3,
  gitUntracked: 1,
  gitConflicted: 0,
  gitStashed: 0,
  gitRenamed: 0,
  gitDeleted2: 0, // deleted *files*, distinct from gitDeleted (lines removed)
  batteryPct: 64,
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

// Fills "${count}" / "${ahead_count}" etc. inside a git_status sub-format,
// then runs the result through parseMarkup so any [text](style) still colors.
function fillCount(template: string, vars: Record<string, number>): Segment[] {
  const filled = template.replace(/\$\{?(\w+)\}?/g, (_, key) => String(vars[key] ?? ''))
  return parseMarkup(filled)
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
  jobs: (o) => {
    if (o.disabled || SAMPLE.jobCount < o.threshold) return []
    return [
      { text: `${o.symbol}${SAMPLE.jobCount}`, style: o.style },
      { text: ' ', style: '' },
    ]
  },

    username: (o, ctx) => {
    if (o.disabled) return []
    if (!o.show_always && !ctx.isRoot) return []
    const style = ctx.isRoot ? o.style_root : o.style_user
    const text = (o.format as string).replace('$user', SAMPLE.user)
    return [...parseMarkup(`[${text}](${style})`)]
  },

  git_metrics: (o) => {
    if (o.disabled) return []
    return [
      ...fillCount(`[▴${SAMPLE.gitAdded}](${o.added_style})`, {}),
      ...fillCount(`[▿${SAMPLE.gitDeleted}](${o.deleted_style})`, {}),
      { text: ' ', style: '' },
    ]
  },

  git_status: (o) => {
    if (o.disabled) return []
    const counts = {
      count: SAMPLE.gitModified,
      ahead_count: SAMPLE.gitAhead,
      behind_count: SAMPLE.gitBehind,
    }
    const parts: Segment[] = []
    const add = (tpl: string, count: number, countKey = 'count') => {
      if (count > 0) parts.push(...fillCount(tpl, { ...counts, [countKey]: count }))
    }
    if (SAMPLE.gitAhead > 0 && SAMPLE.gitBehind > 0) add(o.diverged, 1)
    else if (SAMPLE.gitAhead > 0) add(o.ahead, SAMPLE.gitAhead)
    else if (SAMPLE.gitBehind > 0) add(o.behind, SAMPLE.gitBehind)
    add(o.staged, SAMPLE.gitStaged)
    add(o.modified, SAMPLE.gitModified)
    add(o.untracked, SAMPLE.gitUntracked)
    add(o.conflicted, SAMPLE.gitConflicted)
    add(o.stashed, SAMPLE.gitStashed)
    add(o.renamed, SAMPLE.gitRenamed)
    if (!parts.length) return []
    return [{ text: '(', style: o.style }, ...parts, { text: ') ', style: o.style }]
  },

  battery: (o) => {
    if (o.disabled) return []
    const symbol =
      SAMPLE.batteryPct > 90 ? o.full_symbol : SAMPLE.batteryPct < 10 ? o.empty_symbol : o.discharging_symbol
    // Threshold-based color styling isn't modeled yet; this always uses a neutral style.
    return [{ text: `${SAMPLE.batteryPct}% ${symbol}`, style: '' }, { text: ' ', style: '' }]
  },

  ...Object.fromEntries(LANGUAGES.map((l) => [l.id, languageRenderer(l.prefix, l.sampleVersion)])),

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

function languageRenderer(prefix: string, sampleVersion: string): Renderer {
  return (o) =>
    o.disabled
      ? []
      : [
          { text: `${prefix} `, style: '' },
          { text: sampleVersion, style: o.style },
          { text: ' ', style: '' },
        ]
}

// Which modules appear, in order. 'newline' starts a new prompt line.
const PROMPT_ORDER = [
  'username',
  'jobs',
  'directory',
  'git_branch',
  'git_status',
  'git_metrics',
  'cmd_duration',
  ...LANGUAGES.map((l) => l.id),
  'battery',
  'newline',
  'time',
  'character',
]

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