<script lang="ts">
  import { renderPrompt } from './render';
  import type { ConfigValues } from './schema';
  import { styleToCss } from './style';

  let { values, failed }: { values: ConfigValues; failed: boolean } = $props()

  let lines = $derived(renderPrompt(values, { lastCommandFailed: failed }))
</script>

<pre class="terminal">{#each lines as line, i}{#each line as seg}<span style={styleToCss(seg.style)}>{seg.text}</span>{/each}{#if i < lines.length - 1}{'\n'}{/if}{/each}</pre>

<style>
  @font-face {
    font-family: 'PreviewNerdFont';
    src: url('https://cdn.jsdelivr.net/gh/ryanoasis/nerd-fonts@master/patched-fonts/JetBrainsMono/Ligatures/Regular/JetBrainsMonoNerdFontPropo-Regular.ttf');
    font-display: swap;
  }
  .terminal {
  font-family: 'PreviewNerdFont', ui-monospace, monospace;
    --term-bg: #1b1e23;
    --term-fg: #d0d7de;
    background: var(--term-bg);
    color: var(--term-fg);
    padding: 1rem;
    border-radius: 6px;
    font-family: ui-monospace, 'JetBrains Mono', monospace;
    overflow-x: auto;
    white-space: pre;
  }
</style>