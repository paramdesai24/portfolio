<script lang="ts">
  import PortfolioGuide from '$lib/components/home/PortfolioGuide.svelte';
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { currentPageTitle } from '$lib/stores/workspace';
  import { FileText, Star, Mic } from '@lucide/svelte';

  onMount(() => {
    currentPageTitle.set('Publications');
  });

  // Svelte 5 props
  let { data } = $props();
  const publications = $derived(data.publications || []);
</script>

<svelte:head>
  <title>Publications</title>
  <meta name="description" content="Academic publications, research papers, and conference proceedings by Param Desai." />
</svelte:head>

<div class="flex flex-col w-full min-h-screen">
  <PortfolioGuide title="Publications" description="Peer-reviewed research across IEEE, Springer, and international venues." message="Each paper starts with a question. Pick one and see where it went." />

  {#if publications.length > 0}
    <div class="flex flex-col gap-6">
      {#each publications as paper (paper.id)}
        <!-- Publication Item Card -->
        <div
          data-scroll-reveal data-guide-line={paper.shortDescription || paper.title}
          in:fade={{ duration: 150 }}
          class="group relative flex flex-col sm:flex-row gap-4 sm:gap-6 p-6 bg-[--color-surface] border border-[--color-border] rounded-xl transition-all duration-300 hover:shadow-xs hover:border-[--color-accent]"
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

              <!-- Highlighted Presentation Note Badge -->
              {#if paper.note}
                <div class="mt-3 flex items-center gap-2 select-none">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-sans font-medium bg-[--color-accent-dim] text-[--color-accent] border border-[--color-accent]/20 shadow-2xs">
                    <Mic size={12} class="shrink-0 text-[--color-accent]" />
                    <span>{paper.note}</span>
                  </span>
                </div>
              {/if}

              <!-- Metadata (Location, DOI) -->
              {#if paper.location || paper.doi}
                <div class="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] sm:text-[11px] font-mono text-[--color-muted] select-text">
                  {#if paper.location}
                    <span class="flex items-center gap-1">
                      <span class="opacity-60 select-none">Location:</span>
                      <span class="text-[--color-text]">{paper.location}</span>
                    </span>
                  {/if}
                  {#if paper.doi}
                    <span class="flex items-center gap-1">
                      <span class="opacity-60 select-none">DOI:</span>
                      <a href="https://doi.org/{paper.doi}" target="_blank" rel="noopener noreferrer" class="text-[--color-accent] hover:underline">{paper.doi}</a>
                    </span>
                  {/if}
                </div>
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
      <h3 class="font-serif text-lg text-[--color-text] font-semibold mb-1">No publications available</h3>
    </div>
  {/if}
</div>
