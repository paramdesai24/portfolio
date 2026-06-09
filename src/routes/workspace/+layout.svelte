<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { currentPageTitle } from '$lib/stores/workspace';
  import { paletteOpen } from '$lib/stores/commandPalette';
  import CommandPalette from '$lib/components/CommandPalette.svelte';
  import { 
    BookOpen, 
    Award, 
    Lightbulb, 
    Network, 
    Briefcase, 
    FileText, 
    ArrowLeft, 
    Menu, 
    X 
  } from '@lucide/svelte';

  // Svelte 5 snippet props
  let { children } = $props();

  let drawerOpen = $state(false);

  // Close the mobile drawer on route change
  $effect(() => {
    // Referencing $page.url.pathname creates a dependency so this effect runs on route changes
    const path = $page.url.pathname;
    drawerOpen = false;
  });

  const navGroups = [
    {
      title: 'Research',
      items: [
        { name: 'Research Overview', href: '/workspace/research', icon: BookOpen },
        { name: 'Publications', href: '/workspace/publications', icon: Award },
        { name: 'Research Ideas', href: '/workspace/research-ideas', icon: Lightbulb },
        { name: 'Mind Map', href: '/workspace/mind-map', icon: Network }
      ]
    },
    {
      title: 'Work',
      items: [
        { name: 'Projects', href: '/workspace/projects', icon: Briefcase }
      ]
    },
    {
      title: 'About',
      items: [
        { name: 'Resume', href: '/workspace/resume', icon: FileText }
      ]
    }
  ];

  function isActive(currentPath: string, href: string): boolean {
    if (href === '/workspace/research') {
      return currentPath === '/workspace/research';
    }
    return currentPath.startsWith(href);
  }

  function toggleDrawer() {
    drawerOpen = !drawerOpen;
  }

  function closeDrawer() {
    drawerOpen = false;
  }

  function handleWindowKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      paletteOpen.update(open => !open);
    }
  }
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<div class="min-h-screen bg-[--color-bg] text-[--color-text] flex flex-col lg:flex-row relative">
  <!-- Skip to main content accessibility link -->
  <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[--color-accent] focus:text-[--color-surface] focus:border focus:border-[--color-border] focus:rounded-lg select-none">
    Skip to content
  </a>
  
  <!-- DESKTOP SIDEBAR -->
  <aside class="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 bg-[--color-surface] border-r border-[--color-border] z-30 select-none" style="box-shadow: 1px 0 0 var(--color-border);">
    <!-- Top profile section -->
    <div class="p-6 flex items-center gap-3 border-b border-[--color-border]">
      <div class="w-8 h-8 rounded-full bg-[--color-accent] text-[--color-surface] flex items-center justify-center font-sans font-semibold text-xs select-none">
        PD
      </div>
      <div class="flex flex-col">
        <span class="font-sans text-sm font-semibold text-[--color-text] leading-tight">Param Desai</span>
        <span class="font-sans text-[11px] text-[--color-muted]">AI Researcher</span>
      </div>
    </div>

    <!-- Navigation Area -->
    <nav class="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-6">
      {#each navGroups as group}
        <div class="flex flex-col gap-1.5">
          <span class="px-3 text-[10px] font-mono uppercase tracking-wider text-[--color-muted] font-semibold">{group.title}</span>
          <div class="flex flex-col gap-0.5">
            {#each group.items as item}
              {@const Icon = item.icon}
              <a
                href={item.href}
                aria-current={isActive($page.url.pathname, item.href) ? 'page' : undefined}
                class="flex items-center h-[36px] px-3 rounded-lg text-sm font-sans gap-2.5 transition-all duration-150 group border-l-2
                {isActive($page.url.pathname, item.href)
                  ? 'bg-[--color-accent-dim] text-[--color-accent] border-[--color-accent] font-medium'
                  : 'border-transparent text-[--color-muted] hover:bg-[--color-accent-dim] hover:text-[--color-text]'}"
              >
                <Icon size={16} />
                <span>{item.name}</span>
              </a>
            {/each}
          </div>
        </div>
      {/each}
    </nav>

    <!-- Bottom Section -->
    <div class="p-6 border-t border-[--color-border] flex flex-col gap-3">
      <a href="/" class="flex items-center text-xs font-sans text-[--color-muted] hover:text-[--color-text] transition-colors gap-1.5 py-1">
        <ArrowLeft size={14} />
        <span>Back to Home</span>
      </a>
      <button 
        onclick={() => paletteOpen.set(true)}
        class="text-left font-mono text-[10px] text-[--color-muted] hover:text-[--color-text] opacity-60 hover:opacity-100 transition-all cursor-pointer focus:outline-hidden"
      >
        <span class="pulse-hint">⌘K to search</span>
      </button>
      <span class="font-mono text-[9px] text-[--color-muted] opacity-60 select-none">
        Last updated: June 2025
      </span>
    </div>
  </aside>

  <!-- MOBILE HEADER -->
  <header class="lg:hidden sticky top-0 z-40 flex items-center justify-between h-14 bg-[--color-bg] border-b border-[--color-border] px-6 select-none w-full">
    <a href="/" class="font-serif italic font-semibold text-lg text-[--color-text]">PD</a>
    <span class="font-sans text-sm font-semibold text-[--color-text] truncate px-4">{$currentPageTitle}</span>
    <button 
      onclick={toggleDrawer} 
      class="text-[--color-text] focus:outline-none p-1" 
      aria-label="Toggle navigation menu"
      aria-expanded={drawerOpen}
    >
      <Menu size={20} />
    </button>
  </header>

  <!-- MOBILE DRAWER -->
  {#if drawerOpen}
    <!-- Backdrop overlay -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div 
      transition:fade={{ duration: 150 }}
      class="fixed inset-0 z-50 bg-black/25 backdrop-blur-xs lg:hidden"
      onclick={closeDrawer}
      role="presentation"
    ></div>

    <!-- Drawer Content -->
    <aside 
      transition:fly={{ x: -256, duration: 200, easing: cubicOut }}
      class="fixed inset-y-0 left-0 z-50 w-64 bg-[--color-surface] border-r border-[--color-border] flex flex-col justify-between lg:hidden"
      style="box-shadow: 1px 0 0 var(--color-border);"
    >
      <!-- Top Section -->
      <div class="p-6 flex items-center justify-between border-b border-[--color-border]">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-[--color-accent] text-[--color-surface] flex items-center justify-center font-sans font-semibold text-xs select-none">
            PD
          </div>
          <div class="flex flex-col">
            <span class="font-sans text-sm font-semibold text-[--color-text] leading-tight">Param Desai</span>
            <span class="font-sans text-[11px] text-[--color-muted]">AI Researcher</span>
          </div>
        </div>
        <button onclick={closeDrawer} class="text-[--color-muted] hover:text-[--color-text] p-1" aria-label="Close menu">
          <X size={20} />
        </button>
      </div>

      <!-- Navigation Area -->
      <nav class="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-6">
        {#each navGroups as group}
          <div class="flex flex-col gap-1.5">
            <span class="px-3 text-[10px] font-mono uppercase tracking-wider text-[--color-muted] font-semibold">{group.title}</span>
            <div class="flex flex-col gap-0.5">
              {#each group.items as item}
                {@const Icon = item.icon}
                <a
                  href={item.href}
                  aria-current={isActive($page.url.pathname, item.href) ? 'page' : undefined}
                  class="flex items-center h-[44px] px-3 rounded-lg text-sm font-sans gap-2.5 transition-all duration-150 group border-l-2
                  {isActive($page.url.pathname, item.href)
                    ? 'bg-[--color-accent-dim] text-[--color-accent] border-[--color-accent] font-medium'
                    : 'border-transparent text-[--color-muted] hover:bg-[--color-accent-dim] hover:text-[--color-text]'}"
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </a>
              {/each}
            </div>
          </div>
        {/each}
      </nav>

      <!-- Bottom Section -->
      <div class="p-6 border-t border-[--color-border] flex flex-col gap-3">
        <a href="/" class="flex items-center text-xs font-sans text-[--color-muted] hover:text-[--color-text] transition-colors gap-1.5 py-1">
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </a>
        <button 
          onclick={() => paletteOpen.set(true)}
          class="text-left font-mono text-[10px] text-[--color-muted] hover:text-[--color-text] opacity-60 hover:opacity-100 transition-all cursor-pointer focus:outline-hidden"
        >
          <span class="pulse-hint">⌘K to search</span>
        </button>
        <span class="font-mono text-[9px] text-[--color-muted] opacity-60 select-none">
          Last updated: June 2025
        </span>
      </div>
    </aside>
  {/if}

  <!-- MAIN CONTENT AREA -->
  <div class="flex-1 lg:pl-64 flex flex-col min-h-screen min-w-0">
    {#key $page.url.pathname}
      <main 
        id="main-content"
        in:fly={{ y: 8, duration: 200, delay: 100, easing: cubicOut }} 
        class="flex-1 px-6 py-8 lg:px-[48px] lg:py-[40px] w-full max-w-5xl mx-auto flex flex-col"
      >
        {@render children()}
      </main>
    {/key}
  </div>

  {#if $paletteOpen}
    <CommandPalette />
  {/if}

</div>
