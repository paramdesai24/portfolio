<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { currentPageTitle } from '$lib/stores/workspace';
  import type { Project } from '$lib/types';
  import { ExternalLink, Star } from 'lucide-svelte';

  onMount(() => {
    currentPageTitle.set('Projects');
  });

  // Svelte 5 props
  let { data } = $props();
  const projects = $derived(data.projects || []);

  type FilterTheme = 'All' | 'AI Systems' | 'Probabilistic Modelling' | 'LLMs' | 'Climate AI';
  let activeFilter = $state<FilterTheme>('All');

  // Filter logic helper mapping FilterThemes to Project researchThemes
  function projectMatchesFilter(project: Project, filter: FilterTheme): boolean {
    if (filter === 'All') return true;
    
    const themes = project.researchThemes.map(t => t.toLowerCase());
    
    if (filter === 'AI Systems') {
      return themes.includes('intelligent systems') || themes.includes('conversational ai') || themes.includes('llms') || themes.includes('ai systems');
    }
    if (filter === 'Probabilistic Modelling') {
      return themes.includes('probabilistic modelling') || themes.includes('simulation') || themes.includes('time series') || themes.includes('time series forecasting');
    }
    if (filter === 'LLMs') {
      return themes.includes('llms') || themes.includes('rag') || themes.includes('nl-to-sql');
    }
    if (filter === 'Climate AI') {
      return themes.includes('climate ai') || themes.includes('time series') || themes.includes('time series forecasting') || themes.includes('climate intelligence');
    }
    return false;
  }

  // Filtered projects state
  let filteredProjects = $derived(
    projects.filter(p => projectMatchesFilter(p, activeFilter))
  );
</script>

<div class="flex flex-col w-full min-h-screen">
  <!-- Page Header -->
  <div class="mb-8">
    <h1 class="font-serif text-[32px] text-[--color-text] tracking-tight">Projects</h1>
    <p class="font-sans text-sm text-[--color-muted] mt-1.5">
      Systems built at the intersection of research and engineering.
    </p>
  </div>

  <!-- Filter Bar -->
  <div class="flex flex-wrap gap-2 mb-8 select-none">
    {#each ['All', 'AI Systems', 'Probabilistic Modelling', 'LLMs', 'Climate AI'] as FilterOption}
      <button
        onclick={() => activeFilter = FilterOption as FilterTheme}
        class="px-4 py-1.5 rounded-full font-sans text-xs transition-all duration-200 border cursor-pointer
        {activeFilter === FilterOption 
          ? 'bg-[--color-accent] text-[--color-surface] border-[--color-accent] shadow-xs' 
          : 'bg-[--color-surface] text-[--color-muted] border-[--color-border] hover:text-[--color-text] hover:bg-[--color-accent-dim]'}"
      >
        {FilterOption}
      </button>
    {/each}
  </div>

  <!-- Projects Grid -->
  {#if filteredProjects.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {#each filteredProjects as project (project.id)}
        <!-- Project Card -->
        <div 
          in:fade={{ duration: 180 }}
          class="group relative flex flex-col justify-between p-6 bg-[--color-surface] border border-[--color-border] rounded-xl transition-all duration-350 hover:shadow-md hover:border-l-[3px] hover:border-l-[--color-accent]"
        >
          <div>
            <!-- Status & Achievement Badges -->
            <div class="flex flex-wrap items-center gap-2 mb-3.5 select-none">
              <!-- Status Badge -->
              {#if project.status}
                <span class="px-2.5 py-0.5 rounded-full text-[9px] font-mono border uppercase tracking-wider font-semibold 
                  {project.status.toLowerCase() === 'live' ? 'bg-[--color-status-live-bg] text-[--color-status-live-text] border-[--color-status-live-border]' : ''}
                  {project.status.toLowerCase() === 'active' ? 'bg-[--color-status-active-bg] text-[--color-status-active-text] border-[--color-status-active-border]' : ''}
                  {project.status.toLowerCase() === 'prototype' ? 'bg-[--color-status-prototype-bg] text-[--color-status-prototype-text] border-[--color-status-prototype-border]' : ''}
                ">
                  {project.status}
                </span>
              {/if}

              <!-- Achievement Badge -->
              {#if project.achievements && project.achievements.length > 0}
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-mono border border-[--color-achievement-border] bg-[--color-achievement-bg] text-[--color-achievement-text] font-semibold">
                  <Star size={10} class="fill-[--color-achievement-text] stroke-none" />
                  {project.achievements[0]}
                </span>
              {/if}
            </div>

            <!-- Title -->
            <h2 class="font-serif text-[22px] text-[--color-text] leading-snug tracking-tight mb-2.5">
              {project.title}
            </h2>

            <!-- Description -->
            <p class="font-sans text-xs text-[--color-muted] leading-[1.6] mb-5 line-clamp-3">
              {project.shortDescription}
            </p>

            <!-- Tech Stack row -->
            <div class="mb-4">
              <h3 class="font-mono text-[9px] uppercase tracking-wider text-[--color-muted] opacity-60 font-semibold mb-2 select-none">Tech Stack</h3>
              <div class="flex flex-wrap gap-1.5 overflow-hidden max-h-[52px]">
                {#each project.techStack.slice(0, 5) as tech}
                  <span class="px-2 py-0.5 rounded-xs text-[10px] font-mono bg-[--color-bg] border border-[--color-border] text-[--color-muted]">
                    {tech}
                  </span>
                {/each}
                {#if project.techStack.length > 5}
                  <span class="px-2 py-0.5 rounded-xs text-[10px] font-mono bg-[--color-bg] border border-[--color-border] text-[--color-muted] opacity-80">
                    +{project.techStack.length - 5} more
                  </span>
                {/if}
              </div>
            </div>

            <!-- Research Themes row -->
            <div class="mb-6">
              <h3 class="font-mono text-[9px] uppercase tracking-wider text-[--color-muted] opacity-60 font-semibold mb-2 select-none">Research Themes</h3>
              <div class="flex flex-wrap gap-1.5">
                {#each project.researchThemes as theme}
                  <span class="px-2 py-0.5 rounded-sm text-[10px] font-sans bg-[--color-accent-dim] text-[--color-accent] font-medium border border-transparent">
                    {theme}
                  </span>
                {/each}
              </div>
            </div>
          </div>

          <!-- Bottom Row Links -->
          <div class="pt-4 border-t border-[--color-border] flex items-center justify-between">
            <div class="flex items-center gap-3">
              <!-- GitHub Button -->
              {#if project.githubUrl}
                <a 
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="p-1.5 text-[--color-muted] hover:text-[--color-accent] hover:bg-[--color-accent-dim] rounded transition-colors focus:outline-hidden"
                  title="GitHub Repository"
                  aria-label="GitHub Repository"
                >
                  <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                </a>
              {/if}
              <!-- Demo Button (Placeholder) -->
              {#if project.demoUrl || project.status === 'Live'}
                <a 
                  href={project.demoUrl || '#'}
                  class="p-1.5 text-[--color-muted] hover:text-[--color-accent] hover:bg-[--color-accent-dim] rounded transition-colors focus:outline-hidden"
                  title="Live Demo"
                  aria-label="Live Demo"
                >
                  <ExternalLink size={15} />
                </a>
              {/if}
            </div>

            <!-- Read More Link -->
            <a 
              href="/workspace/projects/{project.id}"
              class="inline-flex items-center gap-1 font-sans text-xs font-semibold text-[--color-accent] hover:text-[--color-text] transition-colors focus:outline-hidden"
            >
              <span>Read more</span>
              <span class="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <!-- Empty State -->
    <div 
      in:fade={{ duration: 150 }}
      class="flex flex-col items-center justify-center py-16 px-4 bg-[--color-surface] border border-[--color-border] rounded-xl text-center select-none"
    >
      <!-- Warm Notebook Illustration -->
      <svg class="w-20 h-20 text-[--color-muted] opacity-40 mb-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" fill="#F7F3EA" />
        <path d="M6 2v20" />
        <path d="M10 6h6" />
        <path d="M10 10h6" />
        <path d="M10 14h6" />
      </svg>
      <h3 class="font-serif text-lg text-[--color-text] font-semibold mb-1">No projects match this filter</h3>
      <p class="font-sans text-xs text-[--color-muted] max-w-xs leading-normal">
        Try shifting filters or browse 'All' to check our complete technical inquiries portfolio.
      </p>
    </div>
  {/if}
</div>
