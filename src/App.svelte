<script lang="ts">
  import { MODULES, defaultValues } from './lib/modules';
  import Preview from './lib/Preview.svelte';
  import { toToml } from './lib/toml';

  let failed = $state(false)
  let values = $state(defaultValues())
  let selectedId = $state(MODULES[0].id)

  let selected = $derived(MODULES.find((m) => m.id === selectedId)!)
  let toml = $derived(toToml(values))

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
    <h2>starship.toml</h2>
    <button onclick={copy}>Copy</button>
    <pre>{toml}</pre>
  </section>
</main>