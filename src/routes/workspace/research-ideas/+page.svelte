<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { currentPageTitle } from '$lib/stores/workspace';

  onMount(() => {
    currentPageTitle.set('Research Ideas');
  });

  // Svelte 5 props
  let { data } = $props();
  const ideas = $derived(data.ideas || []);

  // Accordion state - default the first item to expanded
  let expandedId = $state<string | null>('machine-unlearning-at-scale');

  function toggleExpand(id: string) {
    if (expandedId === id) {
      expandedId = null;
    } else {
      expandedId = id;
    }
  }

  // Consistent status colors matching the visual guidelines
  function getStatusColor(status: string) {
    const s = status.toLowerCase();
    if (s === 'active interest' || s === 'active') {
      return {
        bg: 'var(--color-status-live-bg)',
        text: 'var(--color-status-live-text)',
        border: 'var(--color-status-live-border)'
      };
    } else if (s === 'exploring') {
      return {
        bg: 'var(--color-status-exploring-bg)',
        text: 'var(--color-status-exploring-text)',
        border: 'var(--color-status-exploring-border)'
      };
    } else {
      return {
        bg: 'var(--color-status-active-bg)',
        text: 'var(--color-status-active-text)',
        border: 'var(--color-status-active-border)'
      };
    }
  }

  // Svelte Action to animate left border color when card is intersecting viewport
  function lazyBorder(node: HTMLElement, targetColor: string) {
    node.style.borderLeftColor = 'var(--color-border)'; // Initial grey
    node.style.transition = 'border-color 0.8s ease-out';

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          node.style.borderLeftColor = targetColor;
          observer.unobserve(node);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(node);

    return {
      destroy() {
        observer.disconnect();
      }
    };
  }
</script>

<div class="flex flex-col w-full min-h-screen">
  <!-- Page Header -->
  <div class="mb-6 select-none">
    <h1 class="font-serif text-[32px] text-[--color-text] tracking-tight">Research Ideas</h1>
    <p class="font-sans text-sm text-[--color-muted] mt-1.5">
      Open questions, unexplored directions, and problems worth solving.
    </p>
    
    <!-- Handwritten-style note in italic Instrument Serif -->
    <p class="font-serif italic text-xs md:text-sm text-[--color-accent] mt-3">
      "This is a living document. Some of these are half-formed. That's intentional."
    </p>
  </div>

  <!-- Status Legend Row -->
  <div class="flex flex-wrap items-center gap-2 mb-8 select-none border-b border-[--color-border] pb-5">
    <span class="font-mono text-[9px] uppercase tracking-wider text-[--color-muted] font-bold mr-1">Status Legend:</span>
    <div class="flex flex-wrap gap-2">
      {#each ['Active Interest', 'Exploring', 'On Radar'] as statusOption}
        {@const colors = getStatusColor(statusOption as any)}
        <span 
          class="px-2.5 py-0.5 rounded-full text-[9px] font-mono border uppercase tracking-wider font-semibold"
          style="background-color: {colors.bg}; color: {colors.text}; border-color: {colors.border};"
        >
          {statusOption}
        </span>
      {/each}
    </div>
  </div>

  <!-- Ideas Accordion List -->
  <div class="flex flex-col gap-5">
    {#each ideas as idea (idea.id)}
      {@const isExpanded = expandedId === idea.id}
      {@const colors = getStatusColor(idea.status)}

      <div 
        in:fade={{ duration: 150 }}
        use:lazyBorder={colors.border}
        class="bg-[--color-surface] border border-[--color-border] rounded-xl transition-all duration-300 hover:shadow-xs border-l-[3px] overflow-hidden"
      >
        <!-- Clickable Header Row -->
        <button
          onclick={() => toggleExpand(idea.id)}
          class="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-hidden group select-none"
          aria-expanded={isExpanded}
          aria-controls="content-{idea.id}"
        >
          <div class="flex-1">
            <h2 class="font-serif text-[20px] text-[--color-text] group-hover:text-[--color-accent] transition-colors duration-200 leading-snug">
              {idea.title}
            </h2>
          </div>
          
          <div class="flex items-center gap-3">
            <span 
              class="px-2.5 py-0.5 rounded-full text-[9px] font-mono border uppercase tracking-wider font-semibold shrink-0"
              style="background-color: {colors.bg}; color: {colors.text}; border-color: {colors.border};"
            >
              {idea.status}
            </span>
            <span class="text-[--color-muted] group-hover:text-[--color-accent] transition-transform duration-300 text-xs font-mono {isExpanded ? 'rotate-180' : ''}">
              ▼
            </span>
          </div>
        </button>

        <!-- Problem Preview (Shown ONLY when collapsed) -->
        {#if !isExpanded}
          <div class="px-5 pb-5 -mt-2.5 select-text" transition:fade={{ duration: 100 }}>
            <p class="font-sans text-xs text-[--color-muted] line-clamp-1">
              {idea.problem}
            </p>
          </div>
        {/if}

        <!-- Detailed Content Panel with CSS max-height transition -->
        <div 
          id="content-{idea.id}"
          class="overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out"
          style="max-height: {isExpanded ? '800px' : '0px'}; opacity: {isExpanded ? '1' : '0'};"
        >
          <div class="px-5 pb-6 border-t border-[--color-border]/60 pt-4 flex flex-col gap-4.5 select-text">
            <!-- Problem Section -->
            <div>
              <h3 class="font-mono text-[9px] uppercase tracking-wider text-[--color-muted] font-bold mb-1.5 select-none">
                The Problem
              </h3>
              <p class="font-sans text-xs md:text-sm text-[--color-text] leading-relaxed text-justify">
                {idea.problem}
              </p>
            </div>

            <!-- Why It Matters Section -->
            <div>
              <h3 class="font-mono text-[9px] uppercase tracking-wider text-[--color-muted] font-bold mb-1.5 select-none">
                Why It Matters
              </h3>
              <p class="font-sans text-xs md:text-sm text-[--color-text] leading-relaxed text-justify">
                {idea.whyItMatters}
              </p>
            </div>

            <!-- Directions Section -->
            <div>
              <h3 class="font-mono text-[9px] uppercase tracking-wider text-[--color-muted] font-bold mb-2 select-none">
                Possible Directions
              </h3>
              <ul class="font-sans text-xs md:text-sm text-[--color-text] space-y-1.5 pl-4 list-disc marker:text-[--color-accent]">
                {#each idea.directions as direction}
                  <li class="pl-1 leading-relaxed">
                    {direction}
                  </li>
                {/each}
              </ul>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>

  <!-- Bottom Note -->
  <footer class="mt-16 mb-8 text-center select-none border-t border-[--color-border] pt-6">
    <p class="font-serif italic text-sm text-[--color-muted]">
      Have a thought on any of these? 
      <a href="mailto:paramdesai24@gmail.com" class="text-[--color-accent] hover:underline transition-colors ml-0.5">
        paramdesai24@gmail.com
      </a>
    </p>
  </footer>
</div>

<style>
  /* CSS transitions and visual polish */
  button:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: -2px;
  }
</style>
