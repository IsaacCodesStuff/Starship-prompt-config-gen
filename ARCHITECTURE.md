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