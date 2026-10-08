export interface PromptLayout {
  left: string[][] // each inner array is one line, left-aligned (format)
  right: string[][] // same shape, for right_format
}

const MODULE_REF = /\$([a-z_]+)\b/g

// Turns a Starship format string into lines of module ids.
// Trailing backslash-newline is a continuation (same line); a bare
// newline, or a literal \n in the string, starts a new line.
function parseFormatString(input: string): string[][] {
  const normalized = input.replace(/\\\r?\n\s*/g, '\u0000') // continuation marker
  const lines = normalized.split(/\\n|\n/)
  return lines.map((line) =>
    [...line.replace(/\u0000/g, '').matchAll(MODULE_REF)].map((m) => m[1]),
  )
}

export function parseLayout(format?: string, rightFormat?: string): PromptLayout {
  return {
    left: format ? parseFormatString(format) : [],
    right: rightFormat ? parseFormatString(rightFormat) : [],
  }
}

export const DEFAULT_LAYOUT: PromptLayout = {
  left: [['username', 'jobs', 'directory', 'git_branch', 'git_status', 'git_metrics', 'cmd_duration']],
  right: [['java', 'python', 'nodejs', 'c', 'cpp', 'kotlin', 'dart', 'rust', 'package', 'battery', 'time']],
}