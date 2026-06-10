<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { currentPageTitle } from '$lib/stores/workspace';
  import type { Publication } from '$lib/types';
  import { FileText, Star, Search } from '@lucide/svelte';

  onMount(() => {
    currentPageTitle.set('Publications');
  });

  // Svelte 5 props
  let { data } = $props();
  const publications = $derived(data.publications || []);

  // Search & Filter State
  let searchQuery = $state('');
  let debouncedSearchQuery = $state('');
  let selectedYear = $state<'All' | '2025' | '2026'>('All');
  let selectedArea = $state<'All' | 'XAI' | 'Cybersecurity' | 'Machine Unlearning' | 'Quantum Security'>('All');

  // Debounce search query
  $effect(() => {
    const query = searchQuery;
    const timer = setTimeout(() => {
      debouncedSearchQuery = query;
    }, 200);
    return () => clearTimeout(timer);
  });



  // Filtered publications derived state
  let filteredPublications = $derived(
    publications.filter((pub) => {
      // 1. Search Query filter (title, venue, research areas)
      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase();
        const matchesTitle = pub.title.toLowerCase().includes(query);
        const matchesVenue = pub.venue.toLowerCase().includes(query);
        const matchesAreas = (pub.researchArea || []).some((a) => a.toLowerCase().includes(query));
        if (!matchesTitle && !matchesVenue && !matchesAreas) {
          return false;
        }
      }

      // 2. Year Filter
      if (selectedYear !== 'All') {
        if (pub.year.toString() !== selectedYear) {
          return false;
        }
      }

      // 3. Area Filter
      if (selectedArea !== 'All') {
        const areas = (pub.researchArea || []).map((a) => a.toLowerCase());
        if (!areas.includes(selectedArea.toLowerCase())) {
          return false;
        }
      }

      return true;
    })
  );
</script>

<div class="flex flex-col w-full min-h-screen">
  <!-- Page Header -->
  <div class="mb-6">
    <h1 class="font-serif text-[32px] text-[--color-text] tracking-tight">Publications</h1>
    <p class="font-sans text-sm text-[--color-muted] mt-1.5">
      Peer-reviewed research across IEEE, Springer, and international venues.
    </p>
    <!-- Stats Row -->
    <div class="mt-3.5 font-mono text-[10px] text-[--color-accent] uppercase tracking-wider font-semibold">
      6 papers · 5 IEEE venues · 2025–2026
    </div>
  </div>

  <!-- Search + Filter Rows -->
  <div class="flex flex-col gap-4 mb-8">
    <!-- Search Row -->
    <div class="relative w-full max-w-md">
      <span class="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-[--color-muted] opacity-60">
        <Search size={14} />
      </span>
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search title, venue, or research area..."
        class="w-full pl-10 pr-4 py-2 font-sans text-xs bg-[--color-surface] border border-[--color-border] rounded-lg text-[--color-text] placeholder:text-[--color-muted]/70 focus:outline-hidden focus:ring-1 focus:ring-[--color-accent] focus:border-[--color-accent]"
      />
    </div>

    <!-- Filters -->
    <div class="flex flex-col gap-3 select-none">
      <!-- Year Filter pills -->
      <div class="flex items-center gap-2">
        <span class="font-mono text-[9px] uppercase tracking-wider text-[--color-muted] font-bold w-12 shrink-0">Year:</span>
        <div class="flex flex-wrap gap-1.5">
          {#each ['All', '2025', '2026'] as yOption}
            <button
              onclick={() => selectedYear = yOption as any}
              class="filter-pill {selectedYear === yOption ? 'selected' : ''}"
            >
              {yOption}
            </button>
          {/each}
        </div>
      </div>

      <!-- Area Filter pills -->
      <div class="flex items-start gap-2">
        <span class="font-mono text-[9px] uppercase tracking-wider text-[--color-muted] font-bold w-12 shrink-0 mt-1.5">Area:</span>
        <div class="flex flex-wrap gap-1.5">
          {#each ['All', 'XAI', 'Cybersecurity', 'Machine Unlearning', 'Quantum Security'] as aOption}
            <button
              onclick={() => selectedArea = aOption as any}
              class="filter-pill {selectedArea === aOption ? 'selected' : ''}"
            >
              {aOption}
            </button>
          {/each}
        </div>
      </div>
    </div>
  </div>

  <!-- Publications List -->
  {#if filteredPublications.length > 0}
    <div class="flex flex-col gap-6">
      {#each filteredPublications as paper (paper.id)}
        <!-- Publication Item Card -->
        <div
          in:fade={{ duration: 150 }}
          class="group relative flex flex-col sm:flex-row gap-4 sm:gap-6 p-6 bg-[--color-surface] border border-[--color-border] rounded-xl transition-all duration-300 hover:shadow-xs border-l-[3px] border-l-transparent hover:border-l-[--color-accent]"
        >
          <!-- Left Year Column -->
          <div class="flex sm:flex-col items-center justify-center sm:justify-start shrink-0 sm:w-14 font-mono text-sm sm:text-lg font-bold text-[--color-accent] tracking-wider sm:py-1 border-b sm:border-b-0 sm:border-r border-[--color-border] pb-2 sm:pb-0 sm:pr-4 select-none">
            <span class="inline-block transform rotate-[-2deg]">{paper.year}</span>
          </div>

          <!-- Center Content Block -->
          <div class="flex-1 flex flex-col justify-between">
            <div>
              <!-- Badge Row -->
              <div class="flex flex-wrap items-center gap-2 mb-2 select-none">
                <!-- Venue Chip -->
                <span class="px-2.5 py-0.5 rounded-full text-[9px] font-mono bg-[--color-accent-dim] text-[--color-accent] border border-transparent font-semibold uppercase tracking-wider">
                  {paper.venue}
                </span>

                <!-- Status Chip -->
                {#if paper.status}
                  <span class="px-2.5 py-0.5 rounded-full text-[9px] font-mono border border-[--color-border] text-[--color-muted] uppercase tracking-wider font-semibold">
                    {paper.status.charAt(0).toUpperCase() + paper.status.slice(1)}
                  </span>
                {/if}

                <!-- Featured Person Badge -->
                {#if paper.featured}
                  <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-mono border border-[--color-achievement-border] bg-[--color-achievement-bg] text-[--color-achievement-text] font-semibold">
                    <Star size={10} class="fill-[--color-achievement-text] stroke-none" />
                    Presented in Person
                  </span>
                {/if}
              </div>

              <!-- Title -->
              <h2 class="font-serif text-[18px] text-[--color-text] group-hover:text-[--color-accent] transition-colors duration-300 leading-snug">
                <a href="/workspace/publications/{paper.id.replace(/_/g, '-')}" class="focus:outline-hidden">
                  {paper.title}
                </a>
              </h2>

              <!-- Abstract Block -->
              {#if paper.abstract}
                <div class="mt-2.5">
                  <p class="font-sans text-xs text-[--color-muted] leading-relaxed text-justify">
                    {paper.abstract}
                  </p>
                </div>
              {/if}

              <!-- Italic Note -->
              {#if paper.note}
                <p class="font-sans italic text-[11px] text-[--color-accent] mt-2.5">
                  * {paper.note}
                </p>
              {/if}
            </div>

            <!-- Research Areas pills -->
            <div class="flex flex-wrap gap-1.5 mt-4 select-none">
              {#each paper.researchArea as area}
                <span class="px-2 py-0.5 rounded-sm text-[9px] font-sans bg-[--color-bg] border border-[--color-border] text-[--color-muted]">
                  {area}
                </span>
              {/each}
            </div>
          </div>

          <!-- Right Action Button -->
          {#if paper.pdfUrl}
            <div class="flex sm:flex-col justify-end items-end sm:justify-start shrink-0 select-none">
              <a
                href={paper.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="p-2 text-[--color-muted] hover:text-[--color-accent] hover:bg-[--color-accent-dim] rounded-lg border border-[--color-border] transition-colors focus:outline-hidden cursor-pointer"
                title="Download PDF"
                aria-label="Download PDF"
              >
                <FileText size={16} />
              </a>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {:else}
    <!-- Empty State -->
    <div
      in:fade={{ duration: 150 }}
      class="flex flex-col items-center justify-center py-16 px-4 bg-[--color-surface] border border-[--color-border] rounded-xl text-center select-none"
    >
      <svg class="w-16 h-16 text-[--color-muted] opacity-40 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
      <h3 class="font-serif text-lg text-[--color-text] font-semibold mb-1">No publications match your search</h3>
      <p class="font-sans text-xs text-[--color-muted] max-w-xs leading-normal">
        Try adjusting the search query or changing filters (Year or Research Area) to find matching documents.
      </p>
    </div>
  {/if}
</div>

<style>
  .filter-pill {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-family: var(--font-sans);
    font-size: 10px;
    transition: all 150ms ease;
    border: 1px solid var(--color-border);
    cursor: pointer;
    background-color: var(--color-surface);
    color: var(--color-muted);
  }
  .filter-pill:hover {
    color: var(--color-text);
    background-color: var(--color-accent-dim);
  }
  .filter-pill.selected {
    background-color: var(--color-text) !important;
    color: var(--color-surface) !important;
    border-color: var(--color-text) !important;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
</style>
