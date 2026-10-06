export interface Preset {
  name: string
  toml: string
}

export const PRESETS: Preset[] = [
  { name: 'Starship defaults', toml: '' },
  {
    name: 'Minimal',
    toml: `[character]
success_symbol = "[>](bold green)"
error_symbol = "[>](bold red)"

[directory]
truncation_length = 1
style = "bold blue"

[cmd_duration]
disabled = true
`,
  },
  {
    name: 'Geometric',
    toml: `[character]
success_symbol = "[◎](bold italic bright-yellow)"
error_symbol = "[○](italic purple)"

[directory]
home_symbol = "⌂"
truncation_length = 2
style = "italic blue"

[git_branch]
symbol = "△ "
style = "italic bright-blue"

[cmd_duration]
min_time = 0
style = "italic white"

[time]
disabled = false
time_format = "%R"
style = "italic dimmed white"
`,
  },
]