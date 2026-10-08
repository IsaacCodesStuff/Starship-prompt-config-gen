import { LANGUAGES } from './languages';
import type { ConfigValues, ModuleDef, PromptSettings } from './schema';

  function languageModule({ id, name }: { id: string; name: string }): ModuleDef {
    return {
      id,
      name,
      description: `Shows the detected ${name} version.`,
      options: [
        { key: 'style', label: 'Style', type: 'string', default: 'bold green' },
        { key: 'disabled', label: 'Disabled', type: 'boolean', default: false },
      ],
    }
  }
// NOTE: defaults here are from memory and should be verified against
// the Starship docs. Later we'll generate this file from the docs.
export const MODULES: ModuleDef[] = [
  {
    id: 'character',
    name: 'Character',
    description: 'The symbol shown before your cursor.',
    options: [
      { key: 'success_symbol', label: 'Success symbol', type: 'string', default: '[❯](bold green)' },
      { key: 'error_symbol', label: 'Error symbol', type: 'string', default: '[❯](bold red)' },
      { key: 'disabled', label: 'Disabled', type: 'boolean', default: false },
    ],
  },
  {
    id: 'directory',
    name: 'Directory',
    description: 'The current working directory.',
    options: [
      { key: 'truncation_length', label: 'Truncation length', type: 'number', default: 3 },
      { key: 'truncate_to_repo', label: 'Truncate to repo root', type: 'boolean', default: true },
      { key: 'home_symbol', label: 'Home symbol', type: 'string', default: '~' },
      { key: 'style', label: 'Style', type: 'string', default: 'bold cyan' },
      { key: 'disabled', label: 'Disabled', type: 'boolean', default: false },
    ],
  },
  {
    id: 'git_branch',
    name: 'Git branch',
    description: 'The active branch of the repository.',
    options: [
      { key: 'symbol', label: 'Symbol', type: 'string', default: '\ue0a0 ' },
      { key: 'style', label: 'Style', type: 'string', default: 'bold purple' },
      { key: 'only_attached', label: 'Only when attached', type: 'boolean', default: false },
      { key: 'disabled', label: 'Disabled', type: 'boolean', default: false },
    ],
  },
  {
    id: 'cmd_duration',
    name: 'Command duration',
    description: 'How long the last command took.',
    options: [
      { key: 'min_time', label: 'Minimum time (ms)', type: 'number', default: 2000 },
      { key: 'show_milliseconds', label: 'Show milliseconds', type: 'boolean', default: false },
      { key: 'style', label: 'Style', type: 'string', default: 'bold yellow' },
      { key: 'disabled', label: 'Disabled', type: 'boolean', default: false },
    ],
  },
    {
    id: 'jobs',
    name: 'Jobs',
    description: 'Number of background jobs running.',
    options: [
      // Starship default symbol/threshold recalled from memory — worth checking against the docs.
      { key: 'symbol', label: 'Symbol', type: 'string', default: '✦' },
      { key: 'threshold', label: 'Show when job count is at least', type: 'number', default: 1 },
      { key: 'style', label: 'Style', type: 'string', default: 'bold blue' },
      { key: 'disabled', label: 'Disabled', type: 'boolean', default: false },
    ],
  },
    {
    id: 'username',
    name: 'Username',
    description: 'Shows the current user. Starship normally hides this unless root, SSH, or a container is detected — the preview below has a toggle to simulate that.',
    options: [
      { key: 'format', label: 'Format', type: 'string', default: '[$user]($style) ' },
      { key: 'style_user', label: 'Style (normal user)', type: 'string', default: 'bold yellow' },
      { key: 'style_root', label: 'Style (root)', type: 'string', default: 'bold red' },
      { key: 'show_always', label: 'Always show, not just when root/SSH', type: 'boolean', default: false },
      { key: 'disabled', label: 'Disabled', type: 'boolean', default: false },
    ],
  },
  {
    id: 'git_metrics',
    name: 'Git metrics',
    description: 'Lines added/removed in the working tree. Disabled by default in Starship.',
    options: [
      { key: 'added_style', label: 'Added style', type: 'string', default: 'bold green' },
      { key: 'deleted_style', label: 'Deleted style', type: 'string', default: 'bold red' },
      { key: 'ignore_submodules', label: 'Ignore submodules', type: 'boolean', default: false },
      { key: 'disabled', label: 'Disabled', type: 'boolean', default: true },
    ],
  },
  {
    id: 'git_status',
    name: 'Git status',
    description: 'Working-tree status: ahead/behind, staged, modified, and so on. Each field below is its own small format string.',
    options: [
      { key: 'style', label: 'Style', type: 'string', default: 'bold red' },
      { key: 'ahead', label: 'Ahead', type: 'string', default: '⇡${count}' },
      { key: 'behind', label: 'Behind', type: 'string', default: '⇣${count}' },
      { key: 'diverged', label: 'Diverged', type: 'string', default: '⇕⇡${ahead_count}⇣${behind_count}' },
      { key: 'conflicted', label: 'Conflicted', type: 'string', default: '=${count}' },
      { key: 'staged', label: 'Staged', type: 'string', default: '+${count}' },
      { key: 'modified', label: 'Modified', type: 'string', default: '!${count}' },
      { key: 'untracked', label: 'Untracked', type: 'string', default: '?${count}' },
      { key: 'stashed', label: 'Stashed', type: 'string', default: '$${count}' },
      { key: 'renamed', label: 'Renamed', type: 'string', default: '»${count}' },
      { key: 'deleted', label: 'Deleted', type: 'string', default: '✘${count}' },
      { key: 'disabled', label: 'Disabled', type: 'boolean', default: false },
    ],
  },
  {
    id: 'battery',
    name: 'Battery',
    description: 'Battery percentage. Per-threshold styles (critical/low/etc.) aren\u2019t editable here yet; an imported config\u2019s thresholds still round-trip into the output untouched.',
    options: [
      { key: 'full_symbol', label: 'Full symbol', type: 'string', default: '\u{1F50B}' },
      { key: 'charging_symbol', label: 'Charging symbol', type: 'string', default: '\u{1F50C}' },
      { key: 'discharging_symbol', label: 'Discharging symbol', type: 'string', default: '\u26A1' },
      { key: 'unknown_symbol', label: 'Unknown symbol', type: 'string', default: '\u2753' },
      { key: 'empty_symbol', label: 'Empty symbol', type: 'string', default: '\u2757' },
      { key: 'disabled', label: 'Disabled', type: 'boolean', default: false },
    ],
  },
  ...LANGUAGES.map(languageModule),
  {
    id: 'time',
    name: 'Time',
    description: 'The current time.',
    options: [
      { key: 'disabled', label: 'Disabled', type: 'boolean', default: true },
      { key: 'time_format', label: 'Time format', type: 'string', default: '%T' },
      { key: 'style', label: 'Style', type: 'string', default: 'bold yellow' },
    ],
  },
]

export const DEFAULT_PROMPT_SETTINGS: PromptSettings = {
  add_newline: true,
  continuation_prompt: '[∙] ',
}
export function defaultValues(): ConfigValues {
  const values: ConfigValues = {}
  for (const mod of MODULES) {
    values[mod.id] = {}
    for (const opt of mod.options) values[mod.id][opt.key] = opt.default
  }
  return values
}