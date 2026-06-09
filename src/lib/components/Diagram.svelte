<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  // Svelte 5 props
  let { code }: { code: string } = $props();

  let containerElement = $state<HTMLDivElement | null>(null);
  let svgContent = $state('');

  onMount(async () => {
    if (!browser || !containerElement) return;

    try {
      const mermaid = (await import('mermaid')).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: 'neutral',
        securityLevel: 'loose',
        fontFamily: 'Inter, sans-serif'
      });

      const uniqueId = `mermaid-diag-${Math.random().toString(36).substring(2, 9)}`;
      const { svg } = await mermaid.render(uniqueId, code.trim());
      svgContent = svg;
    } catch (err) {
      console.error('Mermaid render error inside Diagram:', err);
    }
  });
</script>

<div 
  bind:this={containerElement} 
  class="my-8 flex justify-center bg-[--color-surface] border border-[--color-border] rounded-xl p-6 overflow-x-auto shadow-2xs select-none w-full"
>
  {#if svgContent}
    <div class="w-full flex justify-center">
      {@html svgContent}
    </div>
  {:else}
    <div class="flex flex-col items-center justify-center py-6 gap-2">
      <div class="w-4 h-4 border-2 border-[--color-accent] border-t-transparent rounded-full animate-spin"></div>
      <span class="font-mono text-[10px] text-[--color-muted]">Rendering architecture model...</span>
    </div>
  {/if}
</div>
