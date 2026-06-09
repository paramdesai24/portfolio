<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { browser } from '$app/environment';
  import { currentPageTitle } from '$lib/stores/workspace';
  import { FileText, Copy, Share2, Star, Check } from 'lucide-svelte';

  // Svelte 5 props
  let { data } = $props();

  const Content = $derived(data.content);
  const metadata = $derived(data.metadata);
  const prev = $derived(data.prev);
  const next = $derived(data.next);

  let contentContainer = $state<HTMLDivElement | null>(null);
  let activeSectionId = $state<string>('');
  let sections = $state<{ id: string; text: string }[]>([]);
  let bibtexCopied = $state(false);
  let shareMessage = $state('');

  onMount(() => {
    currentPageTitle.set('Publications');
  });

  // Extract h2 headings on content render for scroll spy
  $effect(() => {
    if (contentContainer && Content) {
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

  // Copy BibTeX citation helper
  function copyBibTeX() {
    if (browser) {
      const bibtexText = `
@inproceedings{desai2025deep,
  title={${metadata.title}},
  author={Desai, Param and Tanwar, Sudeep and Gupta, Rajesh},
  booktitle={${metadata.venue}},
  year={${metadata.year}},
  organization={IEEE}
}
      `.trim();
      navigator.clipboard.writeText(bibtexText);
      bibtexCopied = true;
      setTimeout(() => {
        bibtexCopied = false;
      }, 2000);
    }
  }

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

      <!-- Copy BibTeX -->
      <button 
        onclick={copyBibTeX}
        class="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[--color-border] bg-transparent text-xs font-sans font-medium text-[--color-text] hover:bg-[--color-accent-dim] hover:text-[--color-accent] transition-colors focus:outline-hidden focus:ring-1 focus:ring-[--color-accent] cursor-pointer"
      >
        {#if bibtexCopied}
          <Check size={13} class="text-[--color-accent]" />
          <span class="text-[--color-accent]">Copied!</span>
        {:else}
          <Copy size={13} />
          <span>Copy BibTeX</span>
        {/if}
      </button>

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

  <!-- Paper Sections: Main Content + Sticky Aside -->
  <div class="flex flex-col lg:flex-row gap-8 relative items-start">
    
    <!-- Main Column: Markdown Content -->
    <div class="w-full lg:flex-1 min-w-0">
      <div 
        bind:this={contentContainer} 
        class="prose prose-neutral prose-sm max-w-none text-[--color-text] leading-[1.7] text-justify font-sans"
      >
        {#if Content}
          <Content />
        {/if}
      </div>

      <!-- Citation BibTeX Block -->
      <div class="mt-12 p-5 bg-[--color-surface] border border-[--color-border] rounded-xl">
        <div class="flex items-center justify-between mb-2.5 select-none">
          <span class="font-mono text-[10px] uppercase tracking-wider text-[--color-muted] font-bold">Cite this Paper (BibTeX)</span>
          <button 
            onclick={copyBibTeX}
            class="p-1 text-[--color-muted] hover:text-[--color-accent] hover:bg-[--color-accent-dim] rounded transition-colors cursor-pointer"
            title="Copy BibTeX"
            aria-label="Copy BibTeX citation"
          >
            {#if bibtexCopied}
              <Check size={14} class="text-[--color-accent]" />
            {:else}
              <Copy size={14} />
            {/if}
          </button>
        </div>
        <pre class="font-mono text-[11px] text-[--color-muted] overflow-x-auto whitespace-pre p-3 bg-[--color-bg]/40 border border-[--color-border] rounded-md select-all">
{`@inproceedings{desai2025deep,
  title={${metadata.title}},
  author={Desai, Param and Tanwar, Sudeep and Gupta, Rajesh},
  booktitle={${metadata.venue}},
  year={${metadata.year}},
  organization={IEEE}
}`}
        </pre>
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

    <!-- Aside Sticky Column (Desktop only: 260px wide) -->
    <aside class="w-full lg:w-[260px] shrink-0 lg:sticky lg:top-[40px] flex flex-col gap-6 select-none order-first lg:order-none bg-[--color-surface] border border-[--color-border] rounded-xl p-5 shadow-2xs">
      <!-- Research Area tags -->
      {#if metadata.researchAreas}
        <div>
          <h3 class="font-mono text-[9px] uppercase tracking-wider text-[--color-muted] font-bold mb-2">Research Areas</h3>
          <div class="flex flex-wrap gap-1.5">
            {#each metadata.researchAreas as area}
              <span class="px-2 py-0.5 rounded-sm text-[10px] font-sans bg-[--color-accent-dim] text-[--color-accent] font-medium">
                {area}
              </span>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Related projects (linked) -->
      {#if metadata.relatedProjects}
        <div>
          <h3 class="font-mono text-[9px] uppercase tracking-wider text-[--color-muted] font-bold mb-2">Related Projects</h3>
          <div class="flex flex-col gap-1">
            {#each metadata.relatedProjects as project}
              <a 
                href="/workspace/projects/{project}" 
                class="font-sans text-xs text-[--color-accent] hover:underline flex items-center gap-1"
              >
                <span>{project.toUpperCase()}</span>
                <span class="text-[10px] opacity-60">↗</span>
              </a>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Venue details -->
      <div class="border-t border-[--color-border] pt-4 flex flex-col gap-2.5">
        <div>
          <h4 class="font-mono text-[9px] text-[--color-muted] uppercase">Full Venue Name</h4>
          <p class="font-sans text-xs text-[--color-text] font-medium mt-0.5 leading-normal">
            {metadata.venue.includes('IEEE') ? 'IEEE International Conference / Symposium' : 'Scientific Book Series Chapter'}
          </p>
        </div>
        <div>
          <h4 class="font-mono text-[9px] text-[--color-muted] uppercase">Year</h4>
          <p class="font-sans text-xs text-[--color-text] font-medium mt-0.5">{metadata.year}</p>
        </div>
        <div>
          <h4 class="font-mono text-[9px] text-[--color-muted] uppercase">DOI Identifier</h4>
          <span class="font-mono text-[10px] text-[--color-muted] select-all cursor-text block mt-0.5 truncate">
            10.1109/{metadata.venue.replace(/ /g, '')}.2025.1009876
          </span>
        </div>
      </div>
    </aside>

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
