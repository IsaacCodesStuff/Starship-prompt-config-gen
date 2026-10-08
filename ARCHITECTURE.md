# Starship Config Generator

Stack: Vite + Svelte 5 (runes) + TypeScript. Client-only, no backend.

## Rules
- Modules are DATA (src/lib/modules.ts). Adding a module never means writing a new component.
- The UI and TOML output are both generated from that data plus one state object.
- TOML output only includes options that differ from Starship's defaults.
- State lives in App.svelte for now; extract to a store only when needed.
- Keep components small and single-purpose. Run `npm run check` before committing.
- Preview renderers live in src/lib/render.ts, one small function per module id. A module with no renderer simply doesn't appear in the preview.
- Presets, import and share links all go through importToml(). The importer never silently drops unknown keys; it reports them.
- importToml keeps the raw parsed TOML (`raw`) alongside the typed `values`. toToml() merges known-module output with untouched raw tables/keys, so nothing imported is ever lost, even if we don't have an editor for it yet.
- Modules that are just "name + version + style" (languages, package) are generated from a single LANGUAGES list (src/lib/languages.ts) shared by modules.ts and render.ts, instead of being hand-written one by one.
- git_status and battery model only the scalar options (symbols, sub-formats, styles) as editable controls. battery's [[battery.display]] threshold array stays in raw passthrough for now — arrays of tables aren't supported by the option editor yet.
- format/right_format are parsed into a PromptLayout (src/lib/formatParser.ts): an ordered list of lines, each a list of module ids. render.ts uses this instead of a hardcoded PROMPT_ORDER when a layout was imported; it falls back to a sensible default layout otherwise. Anything in a format string we don't model (literal text, $fill, conditional groups) is dropped from the parsed layout but the original format string itself still round-trips untouched via raw passthrough.
- add_newline / continuation_prompt are global prompt settings (src/lib/schema.ts: PromptSettings), not module options. They get their own "Prompt settings" UI section and their own top-level lines in toToml's output.