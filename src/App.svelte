<script lang="ts">
  import { importToml } from './lib/importToml';
  import { MODULES } from './lib/modules';
  import { PRESETS } from './lib/presets';
  import Preview from './lib/Preview.svelte';
  import { fromHash, writeHash } from './lib/share';
  import { toToml } from './lib/toml';

  const initial = fromHash()
  let values = $state(initial.values)
  let raw = $state(initial.raw)
  let failed = $state(false)
  let selectedId = $state(MODULES[0].id)

  let selected = $derived(MODULES.find((m) => m.id === selectedId)!)
  let toml = $derived(toToml(values, raw))
  let importText = $state('')
  let importMessage = $state('')

  function runImport(text: string) {
    try {
      const result = importToml(text)
      values = result.values
      raw = result.raw
      const n = result.ignored.length
      importMessage = n
        ? `Imported. ${n} entries don't have editable controls yet but will still round-trip into the output: ${result.ignored.slice(0, 8).join(', ')}${n > 8 ? ', …' : ''}`
        : 'Imported.'
    } catch (e) {
      importMessage = `Could not parse that TOML: ${e instanceof Error ? e.message : e}`
    }
  }

  function applyPreset(e: Event) {
    const name = (e.currentTarget as HTMLSelectElement).value
    const preset = PRESETS.find((p) => p.name === name)
    if (preset) runImport(preset.toml)
  }

  async function copyLink() {
    await navigator.clipboard.writeText(location.href)
  }

  // Keep the URL in sync with the current config
  $effect(() => writeHash(toml))

  async function copy() {
    await navigator.clipboard.writeText(toml)
  }
</script>

<main>
  <h1>Starship Config Generator</h1>

  <section>
    <h2>Preview</h2>
    <Preview {values} {failed} />
    <label class="inline">
      <input type="checkbox" bind:checked={failed} />
      Pretend the last command failed
    </label>
  </section>

  <nav>
    {#each MODULES as mod}
      <button class:active={mod.id === selectedId} onclick={() => (selectedId = mod.id)}>
        {mod.name}
      </button>
    {/each}
  </nav>

  <section>
    <h2>{selected.name}</h2>
    <p>{selected.description}</p>

    {#each selected.options as opt}
      <label>
        {opt.label}
        {#if opt.type === 'boolean'}
          <input type="checkbox" bind:checked={values[selected.id][opt.key]} />
        {:else if opt.type === 'number'}
          <input type="number" bind:value={values[selected.id][opt.key]} />
        {:else}
          <input bind:value={values[selected.id][opt.key]} />
        {/if}
      </label>
    {/each}
  </section>

  <section>
    <h2>Presets & import</h2>
    <label>
      Preset
      <select onchange={applyPreset}>
        <option value="" selected disabled>Choose…</option>
        {#each PRESETS as p}
          <option value={p.name}>{p.name}</option>
        {/each}
      </select>
    </label>
    <label>
      Import an existing starship.toml
      <textarea rows="6" bind:value={importText}></textarea>
    </label>
    <button onclick={() => runImport(importText)}>Import</button>
    <button onclick={copyLink}>Copy share link</button>
    {#if importMessage}<p>{importMessage}</p>{/if}
  </section>

  <section>
    <h2>starship.toml</h2>
    <button onclick={copy}>Copy</button>
    <pre>{toml}</pre>
  </section>
</main>