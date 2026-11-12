<script lang="ts">
  import PortfolioGuide from "$lib/components/home/PortfolioGuide.svelte";
  import { projectPreviews } from '$lib/components/home/projectPreviews';
  import { tick } from 'svelte';
  import { browser } from '$app/environment';
  import { ExternalLink, Star } from '@lucide/svelte';
  import TechLogo from '$lib/components/TechLogo.svelte';

  // Svelte 5 props
  let { data } = $props();

  const Content = $derived(data.content);
  const metadata = $derived(data.metadata);

  let contentContainer = $state<HTMLDivElement | null>(null);
  let sections = $state<{ id: string; text: string }[]>([]);
  let activeSectionId = $state<string>('');
  let shareMessage = $state('');

  function handleShare() {
    if (browser) {
      navigator.clipboard.writeText(window.location.href);
      shareMessage = 'Link copied!';
      setTimeout(() => {
        shareMessage = '';
      }, 2000);
    }
  }

  // Extract h2 headings on content render
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

  // Track active section scroll highlighting
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

  $effect(() => {
    const container = contentContainer;
    const content = data.content;
    if (!container || !content) return;
    let cancelled = false;
    void tick().then(() => {
      if (!cancelled) return renderMermaidDiagrams(container, () => cancelled);
    });
    return () => { cancelled = true; };
  });

  async function renderMermaidDiagrams(container: HTMLDivElement, cancelled: () => boolean) {
    const blocks = container.querySelectorAll('pre:has(code.language-mermaid), pre.language-mermaid');
    if (!blocks.length) return;
    try {
      const mermaid = (await import('mermaid')).default;
      if (cancelled()) return;
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        securityLevel: 'strict',
        fontFamily: 'Instrument Sans, system-ui, sans-serif',
        flowchart: { htmlLabels: false, useMaxWidth: true },
        themeVariables: {
          background: '#f4faf4',
          primaryColor: '#d4e8ed',
          primaryTextColor: '#101d2a',
          primaryBorderColor: '#31516e',
          lineColor: '#304b5d',
          textColor: '#101d2a',
          edgeLabelBackground: '#f4faf4',
          clusterBkg: '#e0eff0',
          clusterBorder: '#31516e'
        }
      });

      for (const block of blocks) {
        if (cancelled()) return;
        const code = block.textContent?.trim();
        if (!code) continue;
        try {
          const { svg } = await mermaid.render('architecture-' + Math.random().toString(36).slice(2), code);
          if (cancelled()) return;
          const diagram = document.createElement('div');
          diagram.className = 'mermaid-diagram';
          diagram.innerHTML = svg;
          block.replaceWith(diagram);
        } catch (error) {
          console.error('Could not render architecture diagram:', error);
        }
      }
    } catch (error) {
      console.error('Could not load Mermaid:', error);
    }
  }
</script>

<svelte:head>
  <title>{metadata?.title ? `${metadata.title}` : 'Project'}</title>
</svelte:head>

<div class="flex flex-col w-full min-h-screen">
  <!-- Back Link -->
  <a 
    href="/workspace/projects" 
    class="project-back inline-flex items-center gap-1.5 text-xs font-mono mb-6 group select-none"
  >
    <span class="transition-transform duration-200 group-hover:-translate-x-1">←</span>
    <span>Back to Projects</span>
  </a>

  <!-- Hero Block -->
  <div class="mb-8">
    <div class="flex flex-wrap items-center gap-2.5 mb-3.5 select-none">
      <!-- Status Badge -->
      {#if metadata.status}
        <span class="px-2.5 py-0.5 rounded-full text-[9px] font-mono border uppercase tracking-wider font-semibold 
          {metadata.status === 'live' ? 'bg-[--color-status-live-bg] text-[--color-status-live-text] border-[--color-status-live-border]' : ''}
          {metadata.status === 'active' ? 'bg-[--color-status-active-bg] text-[--color-status-active-text] border-[--color-status-active-border]' : ''}
          {metadata.status === 'prototype' ? 'bg-[--color-status-prototype-bg] text-[--color-status-prototype-text] border-[--color-status-prototype-border]' : ''}
        ">
          {metadata.status}
        </span>
      {/if}
      
      <!-- Achievement Badges -->
      {#if metadata.achievements}
        {#each metadata.achievements as achievement}
          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-mono border border-[--color-achievement-border] bg-[--color-achievement-bg] text-[--color-achievement-text] font-semibold">
            <Star size={10} class="fill-[--color-achievement-text] stroke-none" />
            {achievement}
          </span>
        {/each}
      {/if}
    </div>

    <PortfolioGuide title={metadata.title} description={metadata.shortDescription} message={shareMessage || `You opened ${metadata.title}. Let’s see what makes it tick.`} />

    <!-- CTA Row -->
    <div class="flex items-center gap-3 mt-6 pb-6 border-b border-[--color-border]">
      {#if metadata.githubUrl}
        <a 
          href={metadata.githubUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[--color-border] bg-transparent text-xs font-sans font-medium text-[--color-text] hover:bg-[--color-accent-dim] hover:text-[--color-accent] transition-colors focus:outline-hidden focus:ring-1 focus:ring-[--color-accent]"
        >
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
          </svg>
          <span>GitHub</span>
        </a>
      {/if}
      
      {#if metadata.demoUrl || metadata.status === 'live'}
        <a 
          href={metadata.demoUrl || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[--color-border] bg-transparent text-xs font-sans font-medium text-[--color-text] hover:bg-[--color-accent-dim] hover:text-[--color-accent] transition-colors focus:outline-hidden focus:ring-1 focus:ring-[--color-accent]"
        >
          <ExternalLink size={14} />
          <span>Live Demo</span>
        </a>
      {/if}

      <!-- Share Button -->
      <button 
        onclick={handleShare}
        class="relative p-2 text-[--color-muted] hover:text-[--color-accent] hover:bg-[--color-accent-dim] rounded-lg border border-[--color-border] transition-colors focus:outline-hidden cursor-pointer"
        aria-label="Share project"
      >
        <svg class="w-4 h-4 fill-none stroke-current" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>

        {#if shareMessage}
          <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[--color-surface] border border-[--color-border] text-[--color-accent] text-[10px] font-sans px-2 py-0.5 rounded shadow-xs select-none whitespace-nowrap">
            {shareMessage}
          </span>
        {/if}
      </button>
    </div>
  </div>

  {#if projectPreviews[metadata.id]}
    <div class="case-previews" data-guide-line="Here’s what the project looks like in action.">
      {#each projectPreviews[metadata.id] as preview (preview.file)}
        <figure>
          <img src={'/screenshots/' + preview.file} alt={preview.alt} width={preview.width} height={preview.height} loading="lazy" />
          <figcaption>{preview.alt}</figcaption>
        </figure>
      {/each}
    </div>
  {/if}

  <!-- Column Layout -->
  <div class="flex flex-col lg:flex-row gap-8 relative items-start">
    
    <!-- Column 1: Metadata Sidebar (Left) -->
    <aside class="w-full lg:w-60 lg:sticky lg:top-[40px] flex flex-col gap-6 select-none shrink-0 order-1 lg:order-none">
      <!-- Tech Stack -->
      {#if metadata.techStack}
        <div>
          <h3 class="font-mono text-[10px] uppercase tracking-wider text-[--color-muted] font-bold mb-2.5">Tech Stack</h3>
          <div class="flex flex-wrap gap-1.5">
            {#each metadata.techStack as tech}
              <span class="px-2 py-0.5 rounded-sm text-[10px] font-mono bg-[--color-bg] border border-[--color-border] text-[--color-muted] flex items-center gap-1">
                <TechLogo tech={tech} size={14} />
              </span>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Research Themes -->
      {#if metadata.researchThemes}
        <div>
          <h3 class="font-mono text-[10px] uppercase tracking-wider text-[--color-muted] font-bold mb-2.5">Research Themes</h3>
          <div class="flex flex-wrap gap-1.5">
            {#each metadata.researchThemes as theme}
              <span class="px-2.5 py-0.5 rounded-sm text-[10px] font-sans bg-[--color-accent-dim] text-[--color-accent] font-medium border border-transparent">
                {theme}
              </span>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Status Metadata block -->
      <div class="border-t border-[--color-border] pt-4 flex flex-col gap-2.5">
        <div class="flex justify-between items-center text-xs">
          <span class="font-mono text-[10px] text-[--color-muted]">Status:</span>
          <span class="font-sans font-semibold capitalize text-[--color-text]">{metadata.status}</span>
        </div>
        {#if metadata.githubUrl}
          <div class="flex justify-between items-center text-xs">
            <span class="font-mono text-[10px] text-[--color-muted]">Codebase:</span>
            <a href={metadata.githubUrl} target="_blank" rel="noopener noreferrer" class="font-sans text-[--color-accent] hover:underline">Open Source</a>
          </div>
        {/if}
      </div>
    </aside>

    <!-- Column 2: Main Content (Center) -->
    <div class="w-full lg:flex-1 min-w-0">
      <div 
        bind:this={contentContainer} 
        class="prose-academic prose-sm max-w-none text-[--color-text] leading-[1.7] text-justify font-sans"
      >
        {#if Content}
          {#key metadata.id}
            <Content />
          {/key}
        {/if}
      </div>

      <!-- Back Link Footer -->
      <div class="h-px bg-[--color-border] my-10"></div>
      <a 
        href="/workspace/projects" 
        class="inline-flex items-center gap-1.5 text-xs font-mono text-[--color-muted] hover:text-[--color-text] transition-colors group select-none"
      >
        <span class="transition-transform duration-200 group-hover:-translate-x-1">←</span>
        <span>Back to Projects</span>
      </a>
    </div>

    <!-- Column 3: Sticky Section Navigator (Right) -->
    {#if sections.length > 0}
      <nav 
        class="hidden lg:block w-44 sticky top-[100px] shrink-0 border-l border-[--color-border] pl-4 select-none"
        aria-label="Table of contents"
      >
        <h3 class="font-mono text-[9px] uppercase tracking-wider text-[--color-muted] font-bold mb-3">Contents</h3>
        <ul class="space-y-2.5">
          {#each sections as section}
            {@const sectionLabel = section.text.toLowerCase() === 'lessons learned' ? 'Lessons' : section.text}
            <li>
              <a 
                href="#{section.id}"
                class="block font-sans text-xs transition-all duration-150 py-0.5 truncate
                {activeSectionId === section.id 
                  ? 'text-[--color-accent] font-semibold border-l-2 border-[--color-accent] pl-2 -ml-[18px]' 
                  : 'text-[--color-muted] hover:text-[--color-text]'}"
              >
                {sectionLabel}
              </a>
            </li>
          {/each}
        </ul>
      </nav>
    {/if}

  </div>
</div>

<style>
  .project-back { color:white; }
  .project-back:hover { text-decoration:underline; }
  .case-previews { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,23rem),1fr)); gap:1rem; margin-bottom:2rem; }
  .case-previews figure { margin:0; }
  .case-previews img { width:100%; height:auto; border-radius:.75rem; }
  .case-previews figcaption { margin-top:.5rem; font-size:.85rem; }
  /* Academic prose styling overrides for detail pages */
  :global(.prose h2) {
    font-family: var(--portfolio-font);
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
  :global(.prose code:not(.language-mermaid)) {
    font-family: var(--portfolio-font);
    font-size: 12px;
    background-color: var(--color-bg);
    padding: 0.15rem 0.35rem;
    border-radius: 4px;
    border: 1px solid var(--color-border);
  }

  :global(.mermaid-diagram) { margin:2rem 0; padding:clamp(.5rem,2vw,1.25rem); background:#f4faf4; border:1px solid #31516e45; border-radius:.75rem; overflow-x:auto; }
  :global(.mermaid-diagram svg) { display:block; height:auto; margin-inline:auto; }
</style>
