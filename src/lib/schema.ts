export type OptionType = 'string' | 'boolean' | 'number'

export interface OptionDef {
  key: string
  label: string
  type: OptionType
  default: string | boolean | number
}

export interface ModuleDef {
  id: string
  name: string
  description: string
  options: OptionDef[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ConfigValues = Record<string, Record<string, any>>

// Whatever importToml couldn't map to a known module/option, kept verbatim.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RawToml = Record<string, any>