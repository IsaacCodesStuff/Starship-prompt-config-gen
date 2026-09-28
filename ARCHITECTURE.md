# Starship Config Generator

Stack: Vite + Svelte 5 (runes) + TypeScript. Client-only, no backend.

## Rules
- Modules are DATA (src/lib/modules.ts). Adding a module never means writing a new component.
- The UI and TOML output are both generated from that data plus one state object.
- TOML output only includes options that differ from Starship's defaults.
- State lives in App.svelte for now; extract to a store only when needed.
- Keep components small and single-purpose. Run `npm run check` before committing.
- Preview renderers live in src/lib/render.ts, one small function per module id. A module with no renderer simply doesn't appear in the preview.