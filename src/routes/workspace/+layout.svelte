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
    Briefcase, 
    FileText, 
    ArrowLeft, 
    Menu, 
    X,
    ClipboardList
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

  // Lock body scroll when drawer is open
  $effect(() => {
    if (drawerOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  });

  const navGroups = [
    {
      title: 'Research',
      items: [
        { name: 'Research Overview', href: '/workspace/research', icon: BookOpen },
        { name: 'Publications', href: '/workspace/publications', icon: Award }
      ]
    },
    {
      title: 'Work',
      items: [
        { name: 'Projects', href: '/workspace/projects', icon: Briefcase },
        { name: 'Experience', href: '/workspace/experience', icon: ClipboardList }
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

<div class="min-h-screen bg-[--color-bg] text-[--color-text] flex relative">
  <!-- Skip to main content accessibility link -->
  <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[--color-accent] focus:text-[--color-surface] focus:border focus:border-[--color-border] focus:rounded-lg select-none">
    Skip to content
  </a>
  
  <!-- RESPONSIVE SIDEBAR -->
  <aside class="flex flex-col w-16 md:w-64 fixed inset-y-0 left-0 border-r border-[--color-border] z-50 select-none" style="background-color: #FDFAF5; box-shadow: 1px 0 0 var(--color-border);">
    <!-- Top profile section -->
    <div class="p-4 md:p-6 flex items-center justify-center md:justify-start gap-3 border-b border-[--color-border]">
      <img src="/avatar.png" alt="Param Desai" class="w-8 h-8 rounded-full object-cover border border-[--color-border] select-none" />
      <div class="hidden md:flex flex-col">
        <span class="font-sans text-sm font-semibold text-[--color-text] leading-tight">Param Desai</span>
        <span class="font-sans text-[11px] text-[--color-muted]">i do what i gotta do</span>
      </div>
    </div>

    <!-- Navigation Area -->
    <nav class="flex-1 overflow-y-auto px-2 md:px-4 py-6 flex flex-col gap-6">
      {#each navGroups as group}
        <div class="flex flex-col gap-1.5">
          <span class="hidden md:inline px-3 text-[10px] font-mono uppercase tracking-wider text-[--color-muted] font-semibold">{group.title}</span>
          <div class="flex flex-col gap-0.5">
            {#each group.items as item}
              {@const Icon = item.icon}
              <a
                href={item.href}
                aria-current={isActive($page.url.pathname, item.href) ? 'page' : undefined}
                class="flex items-center justify-center md:justify-start h-[36px] px-3 rounded-lg text-sm font-sans gap-2.5 transition-all duration-150 group border-l-2
                {isActive($page.url.pathname, item.href)
                  ? 'bg-[--color-accent-dim] text-[--color-accent] border-[--color-accent] font-medium'
                  : 'border-transparent text-[--color-muted] hover:bg-[--color-accent-dim] hover:text-[--color-text]'}"
                title={item.name}
              >
                <Icon size={16} />
                <span class="hidden md:inline">{item.name}</span>
              </a>
            {/each}
          </div>
        </div>
      {/each}
    </nav>

    <!-- Bottom Section -->
    <div class="p-4 md:p-6 border-t border-[--color-border] flex flex-col items-center md:items-start gap-3">
      <a href="/" class="flex items-center justify-center md:justify-start text-xs font-sans text-[--color-muted] hover:text-[--color-text] transition-colors gap-1.5 py-1" title="Back to Home">
        <ArrowLeft size={14} />
        <span class="hidden md:inline">Back to Home</span>
      </a>
      <button 
        onclick={() => paletteOpen.set(true)}
        class="text-left font-mono text-[10px] text-[--color-muted] hover:text-[--color-text] opacity-60 hover:opacity-100 transition-all cursor-pointer focus:outline-hidden"
        title="Search"
      >
        <span class="pulse-hint hidden md:inline">⌘K to search</span>
        <span class="md:hidden font-mono text-[10px]">⌘K</span>
      </button>
    </div>
  </aside>

  <!-- MAIN CONTENT AREA -->
  <div class="flex-1 pl-16 md:pl-64 flex flex-col min-h-screen min-w-0">
    {#key $page.url.pathname}
      <main 
        id="main-content"
        in:fly={{ y: 8, duration: 200, delay: 100, easing: cubicOut }} 
        class="flex-1 px-4 py-6 md:px-[48px] md:py-[40px] w-full max-w-5xl mx-auto flex flex-col"
      >
        {@render children()}
      </main>
    {/key}
  </div>

  {#if $paletteOpen}
    <CommandPalette />
  {/if}

</div>
