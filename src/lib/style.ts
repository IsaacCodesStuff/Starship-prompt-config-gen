const BASE = ['#3b3b3b', '#e5534b', '#57ab5a', '#c69026', '#539bf5', '#b083f0', '#39c5cf', '#cdd9e5']
const BRIGHT = ['#636e7b', '#ff938a', '#6bc46d', '#daaa3f', '#6cb6ff', '#dcbdfb', '#56d4dd', '#ffffff']
const NAMES = ['black', 'red', 'green', 'yellow', 'blue', 'purple', 'cyan', 'white']

function ansi256(n: number): string {
  if (n < 8) return BASE[n]
  if (n < 16) return BRIGHT[n - 8]
  if (n < 232) {
    const i = n - 16
    const c = (v: number) => (v === 0 ? 0 : 55 + v * 40)
    return `rgb(${c(Math.floor(i / 36))},${c(Math.floor(i / 6) % 6)},${c(i % 6)})`
  }
  const g = 8 + (n - 232) * 10
  return `rgb(${g},${g},${g})`
}

function toColor(token: string): string | undefined {
  if (/^#[0-9a-f]{6}$/i.test(token)) return token
  if (/^\d+$/.test(token)) return +token <= 255 ? ansi256(+token) : undefined
  const bright = token.startsWith('bright-')
  const i = NAMES.indexOf(bright ? token.slice(7) : token)
  return i < 0 ? undefined : (bright ? BRIGHT : BASE)[i]
}

/** Converts a Starship style string like "bold italic bg:blue #ff8800" to CSS. */
export function styleToCss(style: string): string {
  let fg: string | undefined
  let bg: string | undefined
  let dimmed = false
  let inverted = false
  const css: string[] = []
  const decorations: string[] = []

  for (const raw of style.trim().split(/\s+/).filter(Boolean)) {
    const t = raw.toLowerCase()
    if (t === 'bold') css.push('font-weight:700')
    else if (t === 'italic') css.push('font-style:italic')
    else if (t === 'underline') decorations.push('underline')
    else if (t === 'strikethrough') decorations.push('line-through')
    else if (t === 'dimmed') dimmed = true
    else if (t === 'inverted') inverted = true
    else if (t.startsWith('bg:')) bg = toColor(t.slice(3))
    else if (t.startsWith('fg:')) fg = toColor(t.slice(3))
    else fg = toColor(t) ?? fg
  }

  if (inverted) [fg, bg] = [bg ?? 'var(--term-bg)', fg ?? 'var(--term-fg)']
  if (fg) css.push(`color:${fg}`)
  if (bg) css.push(`background:${bg}`)
  if (dimmed) css.push('opacity:0.6')
  if (decorations.length) css.push(`text-decoration:${decorations.join(' ')}`)
  return css.join(';')
}