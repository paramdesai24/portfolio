<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { browser } from '$app/environment';
  import { currentPageTitle } from '$lib/stores/workspace';
  import { FileText, Share2, Star } from '@lucide/svelte';
  import { theme } from '$lib/stores/theme';

  // Svelte 5 props
  let { data } = $props();

  const Content = $derived(data.content);
  const metadata = $derived(data.metadata);
  const prev = $derived(data.prev);
  const next = $derived(data.next);

  let contentContainer = $state<HTMLDivElement | null>(null);
  let activeSectionId = $state<string>('');
  let sections = $state<{ id: string; text: string }[]>([]);
  let shareMessage = $state('');

  onMount(() => {
    currentPageTitle.set('Publications');
  });

  // Extract h2 headings on content render for scroll spy
  $effect(() => {
    if (contentContainer && data.content !== undefined) {
      tick().then(() => {
        if (!contentContainer) return;
        const headings = contentContainer.querySelectorAll('h2');
        const newSections = Array.from(headings).map((h, i) => {
          if (!h.id) {
            h.id = h.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `section-${i}`;
          }
          return {
            id: h.id,
            text: h.textContent || ''
          };
        });
        sections = newSections;
      });
    }
  });

  // Track active section highlight on scroll
  $effect(() => {
    if (sections.length === 0 || !contentContainer || !browser) return;

    const observerOptions = {
      root: null,
      rootMargin: '-15% 0px -55% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSectionId = entry.target.id;
        }
      });
    }, observerOptions);

    const headings = contentContainer.querySelectorAll('h2');
    headings.forEach((h) => observer.observe(h));

    return () => {
      observer.disconnect();
    };
  });

  // Share link helper
  function handleShare() {
    if (browser) {
      navigator.clipboard.writeText(window.location.href);
      shareMessage = 'Citation link copied!';
      setTimeout(() => {
        shareMessage = '';
      }, 2000);
    }
  }
</script>

<div class="flex flex-col w-full min-h-screen">
  <!-- Back Link -->
  <a 
    href="/workspace/publications" 
    class="inline-flex items-center gap-1.5 text-xs font-mono text-[--color-muted] hover:text-[--color-text] transition-colors mb-6 group select-none"
  >
    <span class="transition-transform duration-200 group-hover:-translate-x-1">←</span>
    <span>Back to Publications</span>
  </a>

  <!-- Header Block -->
  <header class="mb-8 select-none">
    <div class="flex flex-wrap items-center gap-2 mb-3.5">
      <span class="px-2.5 py-0.5 rounded-full text-[9px] font-mono bg-[--color-accent-dim] text-[--color-accent] border border-transparent font-semibold uppercase tracking-wider">
        {metadata.venue}
      </span>
      <span class="px-2.5 py-0.5 rounded-full text-[9px] font-mono border border-[--color-border] text-[--color-muted] uppercase tracking-wider font-semibold">
        {metadata.year}
      </span>
      {#if metadata.status}
        <span class="px-2.5 py-0.5 rounded-full text-[9px] font-mono border border-[--color-border] text-[--color-accent] uppercase tracking-wider font-semibold">
          {metadata.status}
        </span>
      {/if}
    </div>

    <!-- Title -->
    <h1 class="font-serif text-2xl md:text-[36px] text-[--color-text] tracking-tight leading-snug max-w-[760px] mb-3">
      {metadata.title}
    </h1>

    <!-- Special Note -->
    {#if metadata.note}
      <div class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-sans border border-[--color-achievement-border] bg-[--color-achievement-bg] text-[--color-achievement-text] font-semibold mb-4">
        <Star size={10} class="fill-[--color-achievement-text] stroke-none" />
        {metadata.note}
      </div>
    {/if}

    <!-- Actions Row -->
    <div class="flex items-center gap-2 mt-4 pb-6 border-b border-[--color-border]">
      <a 
        href={metadata.pdfUrl || '#'}
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[--color-border] bg-transparent text-xs font-sans font-medium text-[--color-text] hover:bg-[--color-accent-dim] hover:text-[--color-accent] transition-colors focus:outline-hidden focus:ring-1 focus:ring-[--color-accent]"
      >
        <FileText size={13} />
        <span>PDF</span>
      </a>

      <!-- Share Link -->
      <button 
        onclick={handleShare}
        class="relative p-1.5 text-[--color-muted] hover:text-[--color-accent] hover:bg-[--color-accent-dim] rounded-lg border border-[--color-border] transition-colors focus:outline-hidden cursor-pointer"
        aria-label="Share citation"
      >
        <Share2 size={13} />
        {#if shareMessage}
          <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[--color-surface] border border-[--color-border] text-[--color-accent] text-[10px] font-sans px-2 py-0.5 rounded shadow-xs select-none whitespace-nowrap">
            {shareMessage}
          </span>
        {/if}
      </button>
    </div>
  </header>

  <!-- Abstract Block -->
  {#if metadata.abstract}
    <div class="mb-10 max-w-[680px]">
      <h2 class="font-mono text-[11px] uppercase tracking-widest text-[--color-muted] font-bold mb-2.5">Abstract</h2>
      <p class="font-sans text-sm md:text-base text-[--color-text] leading-[1.8] text-justify font-light select-text">
        {metadata.abstract}
      </p>
    </div>
  {/if}

  <!-- Paper Sections: Main Content -->
  <div class="w-full max-w-[760px] min-w-0">
    <div 
      bind:this={contentContainer} 
      class="prose-academic prose-sm max-w-none text-[--color-text] leading-[1.7] text-justify font-sans"
    >
      {#if Content}
        {#key $theme}
          <Content />
        {/key}
      {/if}
    </div>

    <!-- Divider -->
    <div class="h-px bg-[--color-border] my-10"></div>

    <!-- Navigation Footer -->
    <nav class="flex items-center justify-between text-xs font-mono text-[--color-muted] select-none" aria-label="Timeline navigation">
      <div>
        {#if prev}
          <a href="/workspace/publications/{prev.slug}" class="hover:text-[--color-accent] transition-colors flex items-center gap-1 group">
            <span class="transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
            <span>{prev.title}</span>
          </a>
        {:else}
          <span class="opacity-30">← End of Timeline</span>
        {/if}
      </div>
      <div>
        {#if next}
          <a href="/workspace/publications/{next.slug}" class="hover:text-[--color-accent] transition-colors flex items-center gap-1 group">
            <span>{next.title}</span>
            <span class="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </a>
        {:else}
          <span class="opacity-30">End of Timeline →</span>
        {/if}
      </div>
    </nav>
  </div>
</div>

<style>
  /* Academic prose styling overrides for detail pages */
  :global(.prose h2) {
    font-family: 'Instrument Serif', serif;
    font-size: 24px;
    font-weight: 500;
    color: var(--color-text);
    margin-top: 2.25rem;
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--color-border);
    scroll-margin-top: 120px;
  }
  :global(.prose h2:first-of-type) {
    margin-top: 0;
  }
  :global(.prose p) {
    margin-bottom: 1.25rem;
    font-size: 14px;
    line-height: 1.7;
    color: var(--color-text);
  }
  :global(.prose ul, .prose ol) {
    margin-bottom: 1.25rem;
    padding-left: 1.25rem;
    list-style-type: decimal;
  }
  :global(.prose li) {
    font-size: 14px;
    margin-bottom: 0.5rem;
    color: var(--color-text);
    line-height: 1.6;
  }
  :global(.prose code) {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    background-color: var(--color-bg);
    padding: 0.15rem 0.35rem;
    border-radius: 4px;
    border: 1px solid var(--color-border);
  }
</style>
