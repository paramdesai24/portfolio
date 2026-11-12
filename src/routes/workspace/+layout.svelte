<script lang="ts">
  import { page } from '$app/state';
  import PortfolioPage from '$lib/components/home/PortfolioPage.svelte';
  import CommandPalette from '$lib/components/CommandPalette.svelte';
  import { paletteOpen } from '$lib/stores/commandPalette';

  let { children } = $props();
  const section = $derived(page.url.pathname.split('/')[2]);
  const mode = $derived(['projects', 'research', 'publications'].includes(section)
    ? 'pixel'
    : ['experience', 'programming', 'blog'].includes(section) ? 'shutter' : undefined);

  function handleKeydown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      paletteOpen.update(open => !open);
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if mode}
  <PortfolioPage {mode}>{@render children()}</PortfolioPage>
{:else if section === "resume"}
  {@render children()}
{:else}
  <main id="main-content" class="w-full max-w-5xl mx-auto px-4 py-6 md:px-12 md:py-10">
    {@render children()}
  </main>
{/if}

{#if $paletteOpen}<CommandPalette />{/if}
