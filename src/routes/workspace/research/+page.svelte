<script lang="ts">
  import { onMount } from 'svelte';
  import { currentPageTitle } from '$lib/stores/workspace';
  import { ArrowRight, BookOpen, Award, Layers } from '@lucide/svelte';

  let { data } = $props();
  const researchAreas = $derived(data.researchAreas || []);
  const publications = $derived(data.publications || []);

  let mounted = $state(false);

  // Set page title and trigger animations
  onMount(() => {
    currentPageTitle.set('Research');
    const timer = setTimeout(() => {
      mounted = true;
    }, 50);
    return () => clearTimeout(timer);
  });

  // Dynamically group publications by year for the timeline view
  let timelineData = $derived.by(() => {
    const grouped: Record<string, { year: string; publications: { venue: string; title: string }[] }> = {};
    for (const pub of publications) {
      const yearStr = pub.year.toString();
      if (!grouped[yearStr]) {
        grouped[yearStr] = { year: yearStr, publications: [] };
      }
      grouped[yearStr].publications.push({
        venue: pub.venue,
        title: pub.title
      });
    }
    return Object.values(grouped).sort((a, b) => b.year.localeCompare(a.year));
  });
</script>

<svelte:head>
  <title>Research | Param Desai</title>
  <meta name="description" content="Explore Param Desai's active research fields, papers, and current research focus." />
</svelte:head>

<div class="flex flex-col gap-16 w-full" class:animate-in={mounted}>
  <!-- Section 1: Header -->
  <section class="anim-item delay-100 flex flex-col gap-2">
    <h1 class="font-serif text-4xl font-normal text-[--color-text]">Research</h1>
    <p class="text-[--color-muted] font-sans text-sm">
      Areas of inquiry, open questions, and ongoing investigations.
    </p>
  </section>

  <!-- Section 2: Research Activity Summary -->
  <section class="anim-item delay-200">
    <div class="flex items-center gap-4 text-xs font-mono text-[--color-muted] select-none border-b border-[--color-border] pb-6">
      <div class="flex items-center gap-1.5">
        <Award size={14} class="text-[--color-accent]" />
        <span>6 Publications</span>
      </div>
      <span class="w-[1px] h-3 bg-[--color-border]"></span>
      <div class="flex items-center gap-1.5">
        <BookOpen size={14} class="text-[--color-accent]" />
        <span>3 Active Projects</span>
      </div>
      <span class="w-[1px] h-3 bg-[--color-border]"></span>
      <div class="flex items-center gap-1.5">
        <Layers size={14} class="text-[--color-accent]" />
        <span>5 Research Areas</span>
      </div>
    </div>
  </section>

  <!-- Section 3: Research Area Cards -->
  <section class="flex flex-col gap-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {#each researchAreas as area, idx}
        <div 
          class="card research-card group flex flex-col justify-between anim-item"
          style="transition-delay: {100 + idx * 50}ms;"
        >
          <div>
            <h3 class="font-serif text-xl text-[--color-text] mb-3">{area.title}</h3>
            
            <!-- Tags -->
            <div class="flex flex-wrap gap-1.5 mb-4">
              {#each area.tags as tag}
                <span class="text-[10px] font-mono bg-[--color-accent-dim] text-[--color-accent] px-2 py-0.5 rounded">
                  {tag}
                </span>
              {/each}
            </div>

            <!-- Description with expand on hover -->
            <p class="text-sm text-[--color-muted] font-sans leading-relaxed clamp-desc mb-6">
              {area.description}
            </p>
          </div>

          <!-- Bottom Row -->
          <div class="flex justify-between items-center text-xs font-mono border-t border-[--color-border]/60 pt-4 mt-auto">
            <span class="text-[--color-muted]">
              {area.publicationCount} publications &bull; {area.projectCount} projects
            </span>
            <a href="/workspace/projects" class="text-[--color-accent] hover:underline inline-flex items-center gap-0.5 font-medium">
              Explore <ArrowRight size={12} />
            </a>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- Section 4: Research Timeline -->
  <section class="flex flex-col gap-6 anim-item delay-800">
    <h3 class="font-serif text-2xl text-[--color-text] border-b border-[--color-border] pb-3">Publication Timeline</h3>
    <div class="flex overflow-x-auto gap-8 pb-4 scrollbar-none snap-x snap-mandatory">
      {#each timelineData as column}
        <div class="flex-shrink-0 w-72 snap-align-start flex flex-col gap-4 bg-[--color-surface] border border-[--color-border] p-5 rounded-xl shadow-card">
          <span class="font-serif text-lg font-semibold border-b border-[--color-border] pb-1.5 text-[--color-accent] inline-block transform rotate-[-2deg]">{column.year}</span>
          <div class="flex flex-col gap-3">
            {#each column.publications as pub}
              <div class="bg-[--color-bg] p-3 rounded-lg border border-[--color-border]/50 flex flex-col gap-2">
                <span class="self-start text-[9px] font-mono bg-[--color-accent-dim] text-[--color-accent] px-1.5 py-0.5 rounded uppercase font-semibold">
                  {pub.venue}
                </span>
                <p class="text-xs text-[--color-text] font-sans font-medium leading-snug line-clamp-2">
                  {pub.title}
                </p>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- Section 5: Current Focus Note (Sticky Note Style) -->
  <section class="anim-item delay-900 flex justify-center py-4">
    <div class="sticky-note max-w-lg w-full bg-[--color-sticky-bg] border border-[--color-sticky-border] rounded-lg p-6 shadow-md transform rotate-[-0.5deg] hover:rotate-0 transition-transform duration-300">
      <div class="flex items-center gap-2 mb-3">
        <span class="w-2.5 h-2.5 rounded-full bg-[--color-sticky-text]"></span>
        <span class="font-mono text-xs text-[--color-sticky-text] font-bold uppercase tracking-wider">Current Focus</span>
      </div>
      <p class="font-serif italic text-[15px] text-[--color-sticky-text] leading-relaxed">
        "Currently focused on Machine Unlearning and Trustworthy AI — particularly how models can forget selectively while remaining accurate, auditable, and compliant with privacy regulations."
      </p>
    </div>
  </section>
</div>

<style>
  /* Base animation settings */
  .anim-item {
    opacity: 0;
    transform: translateY(16px);
  }

  /* Transition triggers on mount */
  :global(.animate-in) .anim-item {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .delay-100 { transition-delay: 50ms; }
  .delay-200 { transition-delay: 100ms; }
  .delay-800 { transition-delay: 200ms; }
  .delay-900 { transition-delay: 250ms; }

  /* Custom Hover Effects for Cards */
  .research-card {
    border-left: 3px solid transparent;
    transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
  }
  .research-card:hover {
    border-left-color: var(--color-accent);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.02);
  }

  /* Line clamp description with expand-on-hover */
  .clamp-desc {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }
  .research-card:hover .clamp-desc {
    -webkit-line-clamp: unset;
    line-clamp: unset;
  }

  /* Scrollbar hiding for timeline */
  .scrollbar-none::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-none {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  /* Sticky note styling */
  .sticky-note {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  }

  @media (prefers-reduced-motion: reduce) {
    .anim-item {
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
    }
    .research-card {
      transform: none !important;
    }
  }
</style>
