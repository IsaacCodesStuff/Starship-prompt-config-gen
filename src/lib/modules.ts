import { LANGUAGES } from './languages';
import type { ConfigValues, ModuleDef } from './schema';

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

export function defaultValues(): ConfigValues {
  const values: ConfigValues = {}
  for (const mod of MODULES) {
    values[mod.id] = {}
    for (const opt of mod.options) values[mod.id][opt.key] = opt.default
  }
  return values
}