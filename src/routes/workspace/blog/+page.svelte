<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { currentPageTitle } from '$lib/stores/workspace';
  import type { BlogPost } from '$lib/types';
  import { ArrowRight, BookOpen, Microscope, Lightbulb, BookMarked } from '@lucide/svelte';

  let { data } = $props();
  const posts = $derived<BlogPost[]>(data.posts || []);

  let mounted = $state(false);
  let searchQuery = $state('');
  let selectedCategory = $state<'All' | 'Research' | 'Explainer' | 'Narrative'>('All');

  onMount(() => {
    currentPageTitle.set('Blog');
    setTimeout(() => { mounted = true; }, 50);
  });

  const pillars = [
    {
      icon: Microscope,
      title: "Explainability as Forensics",
      subtitle: "Not a UI — a diagnostic probe",
      body: "In Q-PhishNet, LIME outputs are run across the training set to expose adversarially poisoned samples through anomalous feature importance profiles. The explanation is no longer for a user — it is a probe of the model's relationship to its training data."
    },
    {
      icon: BookMarked,
      title: "The Privacy Illusion of FL",
      subtitle: "Gradient inversion breaks federated promises",
      body: "Federated learning avoids raw data sharing but leaves gradient transmissions exposed. FIDES closes this gap by securing the gradient channel with CV-QKD — shifting security guarantees from computational assumptions to physical laws of quantum mechanics."
    },
    {
      icon: Lightbulb,
      title: "Machine Unlearning Verification Gap",
      subtitle: "Active suppression vs. influence erasure",
      body: "Behavioral tests (forget-set accuracy below 5%) cannot distinguish a model that genuinely lost a pattern from one that memorized how to hide it. True verification requires statistical indistinguishability from a counterfactual — an open research frontier."
    },
    {
      icon: BookOpen,
      title: "The Deployment Engineer's Lens",
      subtitle: "Tampa changed how I evaluate my own work",
      body: "A model that achieves 99.4% simulation accuracy is useless if it cannot survive hardware constraints. After IEEE ICSC in Tampa, every paper I write now includes the deployment engineer's questions: QBER thresholds, graceful degradation strategies, and real-world failure modes."
    }
  ];

  let filteredPosts = $derived(
    posts.filter(post => {
      const matchesSearch = !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
  );

  function formatDate(dateStr: string | undefined): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  const categoryColors: Record<string, string> = {
    'Research': 'bg-[--color-accent-dim] text-[--color-accent]',
    'Explainer': 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    'Narrative': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
  };
</script>

<svelte:head>
  <title>Blog | Param Desai</title>
  <meta name="description" content="Writing on ML security, explainable AI, federated learning, and the gap between research correctness and real-world deployability." />
</svelte:head>

<div class="flex flex-col w-full" class:animate-in={mounted}>

  <!-- Header -->
  <section class="anim-item delay-100 mb-8">
    <h1 class="font-serif text-[32px] text-[--color-text] tracking-tight">Research Blog</h1>
    <p class="font-sans text-sm text-[--color-muted] mt-1.5 max-w-[520px] leading-relaxed">
      Technical essays at the intersection of ML security, explainability, and the gap between what a model proves and what a system can deploy.
    </p>
    <div class="mt-3.5 font-mono text-[10px] text-[--color-accent] uppercase tracking-wider font-semibold">
      5 essays · ML security · XAI · Federated Learning
    </div>
  </section>

  <!-- Core Philosophy Pillars -->
  <section class="anim-item delay-200 mb-10">
    <div class="flex items-center gap-2.5 mb-5">
      <span class="h-px flex-1 bg-[--color-border]"></span>
      <span class="font-mono text-[9px] uppercase tracking-widest text-[--color-muted] font-bold select-none">Core Philosophy</span>
      <span class="h-px flex-1 bg-[--color-border]"></span>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {#each pillars as pillar, i}
        {@const Icon = pillar.icon}
        <div
          class="pillar-card group relative flex flex-col gap-3 p-5 bg-[--color-surface] border border-[--color-border] rounded-xl transition-all duration-300 hover:border-[--color-accent] hover:shadow-sm anim-item"
          style="transition-delay: {150 + i * 60}ms"
          in:fade={{ duration: 200, delay: 150 + i * 60 }}
        >
          <!-- Accent top bar -->
          <div class="absolute top-0 left-5 right-5 h-[1.5px] bg-gradient-to-r from-transparent via-[--color-accent]/40 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div class="flex items-start gap-3">
            <div class="p-2 rounded-lg bg-[--color-accent-dim] text-[--color-accent] shrink-0 mt-0.5">
              <Icon size={15} />
            </div>
            <div class="flex flex-col gap-0.5">
              <h3 class="font-serif text-[15px] text-[--color-text] leading-snug">{pillar.title}</h3>
              <p class="font-mono text-[9px] text-[--color-accent] uppercase tracking-wider font-semibold">{pillar.subtitle}</p>
            </div>
          </div>
          <p class="font-sans text-xs text-[--color-muted] leading-relaxed">{pillar.body}</p>
        </div>
      {/each}
    </div>
  </section>

  <!-- Divider -->
  <div class="h-px bg-[--color-border] mb-8 anim-item delay-400"></div>

  <!-- Search + Filter -->
  <section class="anim-item delay-400 flex flex-col gap-3 mb-7">
    <input
      type="text"
      bind:value={searchQuery}
      placeholder="Search essays..."
      class="w-full max-w-sm pl-4 pr-4 py-2 font-sans text-xs bg-[--color-surface] border border-[--color-border] rounded-lg text-[--color-text] placeholder:text-[--color-muted]/70 focus:outline-hidden focus:ring-1 focus:ring-[--color-accent] focus:border-[--color-accent]"
    />
    <div class="flex items-center gap-2">
      <span class="font-mono text-[9px] uppercase tracking-wider text-[--color-muted] font-bold w-16 shrink-0">Category:</span>
      <div class="flex flex-wrap gap-1.5">
        {#each ['All', 'Research', 'Explainer', 'Narrative'] as cat}
          <button
            onclick={() => selectedCategory = cat as any}
            class="filter-pill {selectedCategory === cat ? 'selected' : ''}"
          >
            {cat}
          </button>
        {/each}
      </div>
    </div>
  </section>

  <!-- Posts List -->
  {#if filteredPosts.length > 0}
    <div class="flex flex-col gap-5 anim-item delay-500">
      {#each filteredPosts as post (post.id)}
        <article
          in:fade={{ duration: 150 }}
          class="group relative flex flex-col sm:flex-row gap-4 sm:gap-6 p-6 bg-[--color-surface] border border-[--color-border] rounded-xl transition-all duration-300 hover:shadow-xs hover:border-[--color-accent]"
        >
          <!-- Left date/category column -->
          <div class="flex sm:flex-col items-center justify-between sm:justify-start shrink-0 sm:w-[88px] border-b sm:border-b-0 sm:border-r border-[--color-border] pb-3 sm:pb-0 sm:pr-5 gap-2 sm:gap-3">
            <span class="font-mono text-[10px] text-[--color-muted] whitespace-nowrap">
              {formatDate(post.publishedDate)}
            </span>
            <span class="px-2 py-0.5 rounded-full text-[8px] font-mono font-semibold uppercase tracking-wider {categoryColors[post.category] || 'bg-[--color-accent-dim] text-[--color-accent]'}">
              {post.category}
            </span>
            {#if post.featured}
              <span class="hidden sm:inline-block font-mono text-[8px] text-[--color-accent] uppercase tracking-wider opacity-70">Featured</span>
            {/if}
          </div>

          <!-- Main content -->
          <div class="flex-1 flex flex-col justify-between gap-3">
            <div>
              <h2 class="font-serif text-[18px] text-[--color-text] group-hover:text-[--color-accent] transition-colors duration-300 leading-snug mb-2">
                <a href="/workspace/blog/{post.id}" class="focus:outline-hidden">{post.title}</a>
              </h2>
              {#if post.description}
                <p class="font-sans text-xs text-[--color-muted] leading-relaxed text-justify">{post.description}</p>
              {/if}
            </div>

            <div class="flex items-center justify-between mt-2">
              <!-- Themes -->
              {#if post.themes && post.themes.length > 0}
                <div class="flex flex-wrap gap-1.5">
                  {#each post.themes.slice(0, 2) as theme}
                    <span class="px-2 py-0.5 rounded-sm text-[9px] font-sans bg-[--color-bg] border border-[--color-border] text-[--color-muted]">
                      {theme.replace(/-/g, ' ')}
                    </span>
                  {/each}
                </div>
              {:else}
                <span></span>
              {/if}

              <!-- Read link + time -->
              <a
                href="/workspace/blog/{post.id}"
                class="inline-flex items-center gap-1 text-[10px] font-mono text-[--color-accent] hover:underline shrink-0 ml-3"
              >
                {post.readingTime || 'Read'}
                <ArrowRight size={11} />
              </a>
            </div>
          </div>
        </article>
      {/each}
    </div>
  {:else}
    <div
      in:fade={{ duration: 150 }}
      class="flex flex-col items-center justify-center py-16 px-4 bg-[--color-surface] border border-[--color-border] rounded-xl text-center select-none"
    >
      <h3 class="font-serif text-lg text-[--color-text] font-semibold mb-1">No essays match your search</h3>
      <p class="font-sans text-xs text-[--color-muted] max-w-xs leading-normal">
        Try adjusting the search term or selecting a different category.
      </p>
    </div>
  {/if}
</div>

<style>
  .anim-item {
    opacity: 0;
    transform: translateY(14px);
  }
  :global(.animate-in) .anim-item {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
                transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .delay-100 { transition-delay: 50ms; }
  .delay-200 { transition-delay: 100ms; }
  .delay-400 { transition-delay: 200ms; }
  .delay-500 { transition-delay: 250ms; }

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

  .pillar-card {
    border-left: 2px solid transparent;
    transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
  }
  .pillar-card:hover {
    border-left-color: var(--color-accent);
    transform: translateY(-1px);
  }
</style>
