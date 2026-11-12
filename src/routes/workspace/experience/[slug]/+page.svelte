<script lang="ts">
  import PortfolioGuide from '$lib/components/home/PortfolioGuide.svelte';
  import { onMount } from 'svelte';
  import { currentPageTitle } from '$lib/stores/workspace';
  import { Briefcase, Calendar, MapPin } from '@lucide/svelte';
  import TechLogo from '$lib/components/TechLogo.svelte';

  // Svelte 5 props
  let { data } = $props();

  const Content = $derived(data.content);
  const metadata = $derived(data.metadata);
  const prev = $derived(data.prev);
  const next = $derived(data.next);

  onMount(() => {
    currentPageTitle.set('Experience');
  });
</script>

<svelte:head>
  <title>{metadata?.role ? `${metadata.role}` : 'Experience'}</title>
</svelte:head>

<div class="flex flex-col w-full min-h-screen">
  <!-- Back Link -->
  <a 
    href="/workspace/experience" 
    class="role-back inline-flex items-center gap-1.5 text-xs font-mono mb-6 group select-none"
  >
    <span class="transition-transform duration-200 group-hover:-translate-x-1">←</span>
    <span>Back to Experience</span>
  </a>

  <!-- Header Block -->
  <header class="mb-8 select-none border-b border-[--color-border] pb-8">
    <div class="flex items-center gap-2 mb-3.5">
      <span class="px-2.5 py-0.5 rounded-full text-[9px] font-mono bg-[--color-accent-dim] text-[--color-accent] border border-transparent font-semibold uppercase tracking-wider">
        {metadata.company}
      </span>
    </div>

    <PortfolioGuide compact title={metadata.role} description={metadata.shortDescription} message="Here’s what the work looked like day to day." />

    <!-- Metadata Rows -->
    <div class="flex flex-wrap gap-4 text-xs text-[--color-muted] font-sans">
      <div class="flex items-center gap-1.5">
        <Calendar size={13} />
        <span>{metadata.period}</span>
      </div>
      {#if metadata.location}
        <div class="flex items-center gap-1.5">
          <MapPin size={13} />
          <span>{metadata.location}</span>
        </div>
      {/if}
    </div>
  </header>

  <!-- Layout: Sidebar + Main Content -->
  <div class="flex flex-col lg:flex-row gap-8 items-start w-full">
    <!-- Left Column: Main Markdown Content -->
    <div class="w-full lg:flex-1 min-w-0">
      <div class="prose-academic role-story">
        {#if Content}
          <Content />
        {/if}
      </div>

      <!-- Divider -->
      <div class="h-px bg-[--color-border] my-10"></div>

      <!-- Timeline Navigation Footer -->
      <nav class="flex items-center justify-between text-xs font-mono text-[--color-muted] select-none" aria-label="Timeline navigation">
        <div>
          {#if prev}
            <a href="/workspace/experience/{prev.slug}" class="hover:text-[--color-accent] transition-colors flex items-center gap-1 group">
              <span class="transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
              <span>{prev.title}</span>
            </a>
          {:else}
            <span class="opacity-30">← End of History</span>
          {/if}
        </div>
        <div>
          {#if next}
            <a href="/workspace/experience/{next.slug}" class="hover:text-[--color-accent] transition-colors flex items-center gap-1 group">
              <span>{next.title}</span>
              <span class="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </a>
          {:else}
            <span class="opacity-30">End of History →</span>
          {/if}
        </div>
      </nav>
    </div>

    <!-- Right Column: Skills Sidebar -->
    <aside class="w-full lg:w-[260px] shrink-0 flex flex-col gap-6 select-none bg-[--color-surface] border border-[--color-border] rounded-xl p-5 shadow-2xs">
      <div>
        <h3 class="font-mono text-[9px] uppercase tracking-wider text-[--color-muted] font-bold mb-2">Core Skills & Tools</h3>
        <div class="flex flex-wrap gap-1.5">
          {#each metadata.skills as skill}
            <span class="px-2 py-0.5 rounded-sm text-[10px] font-sans bg-[--color-accent-dim] text-[--color-accent] font-medium border border-transparent flex items-center gap-1">
              <TechLogo tech={skill} size={14} />
            </span>
          {/each}
        </div>
      </div>
    </aside>
  </div>
</div>

<style>
  .role-back { color:white; }
  .role-story { max-width:72ch; font-family:"Instrument Sans",system-ui,sans-serif; font-size:1.05rem; line-height:1.7; }
  .role-story :global(p) { font-size:inherit; line-height:inherit; text-align:start; }
</style>
