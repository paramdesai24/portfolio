<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { browser } from '$app/environment';
  import { currentPageTitle } from '$lib/stores/workspace';
  import { Share2 } from '@lucide/svelte';
  import { theme } from '$lib/stores/theme';

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
    currentPageTitle.set('Blog');
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
          return { id: h.id, text: h.textContent || '' };
        });
        sections = newSections;
      });
    }
  });

  // Track active section on scroll
  $effect(() => {
    if (sections.length === 0 || !contentContainer || !browser) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activeSectionId = entry.target.id;
      });
    }, { root: null, rootMargin: '-15% 0px -55% 0px', threshold: 0 });

    const headings = contentContainer.querySelectorAll('h2');
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  });

  function handleShare() {
    if (browser) {
      navigator.clipboard.writeText(window.location.href);
      shareMessage = 'Link copied!';
      setTimeout(() => { shareMessage = ''; }, 2000);
    }
  }

  const categoryColors: Record<string, string> = {
    'Research': 'bg-[--color-accent-dim] text-[--color-accent]',
    'Explainer': 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    'Narrative': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
  };

  function formatDate(dateStr: string | undefined): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
</script>

<div class="flex flex-col w-full min-h-screen">
  <!-- Back Link -->
  <a
    href="/workspace/blog"
    class="inline-flex items-center gap-1.5 text-xs font-mono text-[--color-muted] hover:text-[--color-text] transition-colors mb-6 group select-none"
  >
    <span class="transition-transform duration-200 group-hover:-translate-x-1">←</span>
    <span>Back to Writing</span>
  </a>

  <!-- Header -->
  <header class="mb-8 select-none">
    <div class="flex flex-wrap items-center gap-2 mb-3.5">
      {#if metadata.category}
        <span class="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-semibold uppercase tracking-wider {categoryColors[metadata.category] || 'bg-[--color-accent-dim] text-[--color-accent]'}">
          {metadata.category}
        </span>
      {/if}
      {#if metadata.readingTime}
        <span class="px-2.5 py-0.5 rounded-full text-[9px] font-mono border border-[--color-border] text-[--color-muted] uppercase tracking-wider font-semibold">
          {metadata.readingTime} read
        </span>
      {/if}
      {#if metadata.publishedDate}
        <span class="px-2.5 py-0.5 rounded-full text-[9px] font-mono border border-[--color-border] text-[--color-muted] uppercase tracking-wider">
          {formatDate(metadata.publishedDate)}
        </span>
      {/if}
    </div>

    <!-- Title -->
    <h1 class="font-serif text-2xl md:text-[36px] text-[--color-text] tracking-tight leading-snug max-w-[760px] mb-3">
      {metadata.title}
    </h1>

    {#if metadata.description}
      <p class="font-sans text-sm text-[--color-muted] leading-relaxed max-w-[600px] mb-4">
        {metadata.description}
      </p>
    {/if}

    <!-- Actions Row -->
    <div class="flex items-center gap-2 mt-4 pb-6 border-b border-[--color-border]">
      {#if metadata.targetAudience}
        <span class="font-mono text-[10px] text-[--color-muted] italic opacity-70">
          For: {metadata.targetAudience}
        </span>
      {/if}
      <div class="flex-1"></div>
      <button
        onclick={handleShare}
        class="relative p-1.5 text-[--color-muted] hover:text-[--color-accent] hover:bg-[--color-accent-dim] rounded-lg border border-[--color-border] transition-colors focus:outline-hidden cursor-pointer"
        aria-label="Share article"
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

  <!-- Themes chips -->
  {#if metadata.themes && metadata.themes.length > 0}
    <div class="flex flex-wrap gap-1.5 mb-8 select-none">
      {#each metadata.themes as theme}
        <span class="px-2 py-0.5 rounded-sm text-[9px] font-sans bg-[--color-bg] border border-[--color-border] text-[--color-muted]">
          {theme.replace(/-/g, ' ')}
        </span>
      {/each}
    </div>
  {/if}

  <!-- Main Content -->
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
    <nav class="flex items-center justify-between text-xs font-mono text-[--color-muted] select-none" aria-label="Essay navigation">
      <div>
        {#if prev}
          <a href="/workspace/blog/{prev.slug}" class="hover:text-[--color-accent] transition-colors flex items-center gap-1 group max-w-[200px]">
            <span class="transition-transform duration-200 group-hover:-translate-x-0.5 shrink-0">←</span>
            <span class="truncate">{prev.title}</span>
          </a>
        {:else}
          <span class="opacity-30">← Start of Writing</span>
        {/if}
      </div>
      <div>
        {#if next}
          <a href="/workspace/blog/{next.slug}" class="hover:text-[--color-accent] transition-colors flex items-center gap-1 group max-w-[200px]">
            <span class="truncate text-right">{next.title}</span>
            <span class="transition-transform duration-200 group-hover:translate-x-0.5 shrink-0">→</span>
          </a>
        {:else}
          <span class="opacity-30">End of Writing →</span>
        {/if}
      </div>
    </nav>
  </div>
</div>

<style>
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
    line-height: 1.75;
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
  :global(.prose strong) {
    font-weight: 600;
    color: var(--color-text);
  }
  :global(.prose em) {
    font-style: italic;
    color: var(--color-muted);
  }
  :global(.prose code) {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    background-color: var(--color-bg);
    padding: 0.15rem 0.35rem;
    border-radius: 4px;
    border: 1px solid var(--color-border);
  }
  :global(.prose hr) {
    border: none;
    border-top: 1px solid var(--color-border);
    margin: 2rem 0;
  }
  :global(.prose blockquote) {
    border-left: 3px solid var(--color-accent);
    padding-left: 1rem;
    margin-left: 0;
    color: var(--color-muted);
    font-style: italic;
  }
</style>
