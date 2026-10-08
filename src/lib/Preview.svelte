<script lang="ts">
  import type { PromptLayout } from './formatParser';
  import { DEFAULT_LAYOUT } from './formatParser';
  import { renderPrompt } from './render';
  import type { ConfigValues } from './schema';
  import { styleToCss } from './style';

  let {
    values,
    failed,
    isRoot,
    layout = DEFAULT_LAYOUT,
  }: { values: ConfigValues; failed: boolean; isRoot: boolean; layout?: PromptLayout } = $props()

  let prompt = $derived(renderPrompt(values, { lastCommandFailed: failed, isRoot }, layout))
</script>

<pre class="terminal">{#each prompt.left as line, i}{#each line as seg}<span style={styleToCss(seg.style)}>{seg.text}</span>{/each}{#if prompt.right[i]?.length}{' '.repeat(4)}{#each prompt.right[i] as seg}<span style={styleToCss(seg.style)}>{seg.text}</span>{/each}{/if}{#if i < prompt.left.length - 1}{'\n'}{/if}{/each}</pre>

<style>
  .terminal {
    --term-bg: #1b1e23;
    --term-fg: #d0d7de;
    background: var(--term-bg);
    color: var(--term-fg);
    padding: 1rem;
    border-radius: 6px;
    font-family: 'PreviewNerdFont', ui-monospace, monospace;
    overflow-x: auto;
    white-space: pre;
  }

  @font-face {
    font-family: 'PreviewNerdFont';
    src: url('https://cdn.jsdelivr.net/gh/ryanoasis/nerd-fonts@master/patched-fonts/JetBrainsMono/Ligatures/Regular/JetBrainsMonoNerdFontPropo-Regular.ttf');
    font-display: swap;
  }
</style>