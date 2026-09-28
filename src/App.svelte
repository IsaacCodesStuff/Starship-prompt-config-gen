<script lang="ts">
  // $state makes a value "reactive": when it changes, anything using it updates
  let successSymbol = $state('❯')
  let successStyle = $state('bold green')
  let errorSymbol = $state('✗')
  let errorStyle = $state('bold red')

  // $derived is recalculated automatically whenever the state it reads changes
  let toml = $derived(
`[character]
success_symbol = "[${successSymbol}](${successStyle})"
error_symbol = "[${errorSymbol}](${errorStyle})"`
  )
</script>

<main>
  <h1>Starship Config Generator</h1>

  <section>
    <h2>Character module</h2>

    <label>
      Success symbol
      <input bind:value={successSymbol} />
    </label>
    <label>
      Success style
      <input bind:value={successStyle} />
    </label>
    <label>
      Error symbol
      <input bind:value={errorSymbol} />
    </label>
    <label>
      Error style
      <input bind:value={errorStyle} />
    </label>
  </section>

  <section>
    <h2>starship.toml</h2>
    <pre>{toml}</pre>
  </section>
</main>