export type OptionType = 'string' | 'boolean' | 'number'

export interface OptionDef {
  key: string
  label: string
  type: OptionType
  default: string | boolean | number
}

export interface ModuleDef {
  id: string // the TOML table name, e.g. "git_branch"
  name: string
  description: string
  options: OptionDef[]
}

// Deliberately loose: option values mix strings, booleans and numbers.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ConfigValues = Record<string, Record<string, any>>