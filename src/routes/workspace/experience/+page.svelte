<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { currentPageTitle } from '$lib/stores/workspace';
  import type { Experience } from '$lib/types';
  import { ArrowRight, MapPin } from '@lucide/svelte';
  import TechLogo from '$lib/components/TechLogo.svelte';

  onMount(() => {
    currentPageTitle.set('Experience');
  });

  // Svelte 5 props
  let { data } = $props();
  const experiences = $derived(data.experiences || []);
</script>

<div class="flex flex-col w-full min-h-screen">
  <!-- Page Header -->
  <div class="mb-8">
    <h1 class="font-serif text-[32px] text-[--color-text] tracking-tight">Work Experience</h1>
    <p class="font-sans text-sm text-[--color-muted] mt-1.5">
      My professional journey, academic leadership, and AI research roles.
    </p>
  </div>

  <!-- Experiences Grid -->
  {#if experiences.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {#each experiences as exp (exp.id)}
        <!-- Experience Card -->
        <div 
          in:fade={{ duration: 180 }}
          class="group relative flex flex-col justify-between p-6 bg-[--color-surface] border border-[--color-border] rounded-xl hover:shadow-md hover:border-l-[3px] hover:border-l-[--color-accent] h-full transition-all duration-300"
        >
          <div>
            <div class="flex justify-between items-start mb-1.5">
              <span class="text-[10px] font-mono text-[--color-accent] uppercase font-bold tracking-wider">
                {exp.company}
              </span>
              <span class="text-[10px] font-mono text-[--color-muted]">
                {exp.period}
              </span>
            </div>
            <h2 class="font-serif text-2xl text-[--color-text] group-hover:text-[--color-accent] transition-colors duration-300 mb-3">
              <a href="/workspace/experience/{exp.id}" class="focus:outline-hidden">
                {exp.role}
              </a>
            </h2>
            
            {#if exp.location}
              <div class="flex items-center gap-1 text-[10px] text-[--color-muted] font-sans mb-4">
                <MapPin size={10} />
                <span>{exp.location}</span>
              </div>
            {/if}

            <p class="text-xs text-[--color-muted] leading-relaxed mb-6 font-sans text-justify line-clamp-3">
              {exp.shortDescription}
            </p>
          </div>

          <div>
            <!-- Skills tags -->
            <div class="flex flex-wrap gap-1.5 mb-5 select-none">
              {#each exp.skills.slice(0, 4) as skill}
                <span class="text-[9px] font-mono bg-[--color-bg] text-[--color-muted] border border-[--color-border] px-2 py-0.5 rounded flex items-center gap-1">
                  <TechLogo tech={skill} size={14} />
                </span>
              {/each}
              {#if exp.skills.length > 4}
                <span class="text-[9px] font-mono bg-[--color-bg] text-[--color-muted] border border-[--color-border] px-2 py-0.5 rounded">
                  +{exp.skills.length - 4} more
                </span>
              {/if}
            </div>

            <!-- Read Details link -->
            <a 
              href="/workspace/experience/{exp.id}" 
              class="text-xs font-semibold text-[--color-accent] hover:text-[--color-text] inline-flex items-center gap-1.5 transition-colors"
            >
              Read details <ArrowRight size={13} class="transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="text-center py-12 text-[--color-muted] font-sans">
      No experience records found.
    </div>
  {/if}
</div>
